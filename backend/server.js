require("dotenv").config()

console.log("Groq key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO")

const express = require("express")
const cors = require("cors")
const db = require("./database")
const Groq = require("groq-sdk")

const app = express()

app.use(cors())
app.use(express.json())

/* -------------------------
   GROQ INITIALIZATION
--------------------------*/

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env file")
  process.exit(1)
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

/* -------------------------
   GET DATABASE SCHEMA
--------------------------*/

async function getDatabaseSchema() {

return new Promise((resolve,reject)=>{

db.all(
"SELECT name FROM sqlite_master WHERE type='table'",
[],
(err,tables)=>{

if(err) return reject(err)

let schema = ""
let pending = tables.length

tables.forEach(table=>{

db.all(`PRAGMA table_info(${table.name})`,[],(err,columns)=>{

schema += `${table.name}(`

columns.forEach(c=>{
schema += `${c.name}, `
})

schema += `)\n`

pending--

if(pending===0){
resolve(schema)
}

})

})

})

})

}

/* -------------------------
   SQL SAFETY VALIDATION
--------------------------*/

function validateSQL(sql){

const lower = sql.toLowerCase()

if(
lower.includes("delete") ||
lower.includes("drop") ||
lower.includes("update") ||
lower.includes("insert")
){
throw new Error("Unsafe SQL blocked")
}

if(!lower.startsWith("select")){
throw new Error("Only SELECT queries allowed")
}

return true

}

/* -------------------------
   CHART SELECTION LOGIC
--------------------------*/

function chooseChart(sql){

const s = sql.toLowerCase()

if(s.includes("date") || s.includes("month"))
return "line"

if(s.includes("group by"))
return "bar"

if(s.includes("percentage") || s.includes("share"))
return "pie"

return "bar"

}

/* -------------------------
   AI → SQL FUNCTION
--------------------------*/

async function generateSQL(userQuery){

const schema = await getDatabaseSchema()

const prompt = `
You are an expert data analyst.

Your job is to convert business questions into SQL queries.

Database schema:
${schema}

Steps to follow:
1. Understand the business question.
2. Identify relevant tables.
3. Decide aggregation (SUM, COUNT, AVG etc.).
4. Decide grouping column.
5. Write valid SQLite SQL.
6. Choose xAxis and yAxis.

Important rules:
- Only use columns from the schema.
- Never invent tables or columns.
- Always alias aggregated columns.
- Return ONLY valid JSON.

Examples:

User: show revenue by region

{
 "sql": "SELECT r.name AS region, SUM(s.revenue) AS revenue FROM sales s JOIN regions r ON s.region_id = r.id GROUP BY r.name",
 "xAxis": "region",
 "yAxis": "revenue",
 "title": "Revenue by Region"
}

User: total quantity sold by product category

{
 "sql": "SELECT p.category AS category, SUM(s.quantity) AS quantity FROM sales s JOIN products p ON s.product_id = p.id GROUP BY p.category",
 "xAxis": "category",
 "yAxis": "quantity",
 "title": "Quantity by Category"
}

If the dataset cannot answer the question return:

{
 "error": "This dataset does not contain the information required."
}

User question:
${userQuery}
`

const completion = await groq.chat.completions.create({
messages:[{ role:"user", content:prompt }],
model:"llama-3.3-70b-versatile",
temperature:0.2
})

let text = completion.choices[0].message.content

console.log("\nAI RAW RESPONSE:\n",text)

const match = text.match(/\{[\s\S]*\}/)

if(!match){
throw new Error("No JSON returned by AI")
}

const jsonText = match[0]

console.log("\nParsed JSON:\n",jsonText)

return JSON.parse(jsonText)

}

/* -------------------------
   BASIC ROUTE
--------------------------*/

app.get("/",(req,res)=>{
res.send("AI Dashboard API Running")
})

/* -------------------------
   DATABASE TEST
--------------------------*/

app.get("/sales",(req,res)=>{

const query=`
SELECT r.name AS region, SUM(s.revenue) AS revenue
FROM sales s
JOIN regions r ON s.region_id = r.id
GROUP BY r.name
`

db.all(query,[],(err,rows)=>{

if(err){
return res.status(500).json({error:err.message})
}

res.json(rows)

})

})

/* -------------------------
   POST /query
--------------------------*/

app.post("/query",async(req,res)=>{

try{

const {query}=req.body

if(!query){
return res.status(400).json({error:"Query text is required"})
}

console.log("\nUser query:",query)

const aiResponse = await generateSQL(query)

if(aiResponse.error){
return res.json(aiResponse)
}

validateSQL(aiResponse.sql)

db.all(aiResponse.sql,[],(err,rows)=>{

if(err){
return res.status(500).json({
error:"SQL execution failed",
details:err.message
})
}

res.json({
chartType: chooseChart(aiResponse.sql),
title: aiResponse.title,
xAxis: aiResponse.xAxis,
yAxis: aiResponse.yAxis,
data: rows
})

})

}catch(error){

console.error("AI route error:",error)

res.status(500).json({
error:"AI query failed",
details:error.message
})

}

})

/* -------------------------
   GET /query (Browser)
--------------------------*/

app.get("/query",async(req,res)=>{

const question = req.query.q || "show revenue by region"

try{

const aiResponse = await generateSQL(question)

if(aiResponse.error){
return res.json(aiResponse)
}

validateSQL(aiResponse.sql)

db.all(aiResponse.sql,[],(err,rows)=>{

if(err){
return res.json(err)
}

res.json({
chartType: chooseChart(aiResponse.sql),
title: aiResponse.title,
xAxis: aiResponse.xAxis,
yAxis: aiResponse.yAxis,
data: rows
})

})

}catch(error){

res.json(error)

}

})

/* -------------------------
   QUICK AI TEST
--------------------------*/

app.get("/test-ai",async(req,res)=>{

try{

const aiResponse = await generateSQL("show revenue by region")

res.json(aiResponse)

}catch(error){

console.error("TEST-AI ERROR:",error)

res.status(500).json({
error:"AI test failed",
details:error.message
})

}

})

/* -------------------------
   START SERVER
--------------------------*/

app.listen(5000,()=>{
console.log("🚀 Server running on port 5000")
})