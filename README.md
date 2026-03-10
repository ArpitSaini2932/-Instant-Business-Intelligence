# Conversational AI Business Intelligence Dashboard

An AI-powered web application that allows users to generate business insights and dashboards using **natural language queries**.

Instead of writing SQL or configuring complex BI tools, users can simply ask questions like:

> "Show revenue by region"  
> "Total quantity sold by product category"  
> "Show monthly revenue trend"

The system automatically:
- Converts the question into SQL
- Queries the database
- Selects an appropriate chart
- Displays an interactive dashboard

---

# Problem Statement

In many organizations, accessing insights requires technical skills such as SQL or experience with complex Business Intelligence tools.

This creates bottlenecks where:
- Business teams depend on data teams
- Simple dashboards take hours or days
- Non-technical executives cannot explore data themselves

This project solves that problem by enabling **non-technical users to query data using plain English.**

---

# Key Features

- Natural language → SQL query generation
- Automatic chart selection
- Interactive dashboard visualization
- Schema-aware AI querying
- SQL safety validation
- Error handling for unsupported queries
- Clean UI with example prompts

---

# Tech Stack

## Frontend
- React
- Recharts
- Axios

## Backend
- Node.js
- Express

## AI Model
- Groq API (Llama 3.3 70B)

## Database
- SQLite

---

# System Architecture

```
User Query
   ↓
React UI
   ↓
Node.js API
   ↓
LLM (Groq)
   ↓
SQL Generation
   ↓
SQLite Database
   ↓
Chart Data
   ↓
Recharts Visualization
```

---

# Example Queries

Try asking questions like:

- `show revenue by region`
- `total quantity sold by product category`
- `compare revenue between regions`
- `show monthly revenue trend`
- `which region generates the highest revenue`

---

# Project Structure

```
ai-dashboard
│
├── backend
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   └── .env (not committed)
│
├── frontend
│   ├── src
│   ├── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Installation Guide

## 1 Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/Instant-Business-Intelligence.git
cd Instant-Business-Intelligence
```

---

## 2 Install Backend Dependencies

```
cd backend
npm install
```

---

## 3 Configure Environment Variables

Create a `.env` file inside the **backend** folder:

```
GROQ_API_KEY=your_api_key_here
```

⚠️ Never push `.env` to GitHub.

---

## 4 Start Backend Server

```
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

## 5 Install Frontend Dependencies

```
cd frontend
npm install
```

---

## 6 Start Frontend

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Evaluation Criteria Addressed

## Accuracy
- Correct SQL generation
- Schema-aware querying
- Safe SQL execution
- Context-aware chart selection

## UX
- Clean dashboard interface
- Interactive charts
- Loading states
- Example prompt suggestions

## Innovation
- Natural language BI querying
- AI-generated dashboards
- Real-time data exploration

---

# Example Workflow

1. User types a business question
2. AI converts the question into SQL
3. Backend queries the database
4. API returns structured data
5. Frontend renders a dashboard chart

---

# Future Improvements

- CSV upload for custom datasets
- Multi-chart dashboard generation
- Follow-up conversational queries
- Query caching
- More advanced visualizations

---

# Demo Flow

Example demo queries:

```
show revenue by region
total quantity sold by product category
show monthly revenue trend
```

These queries demonstrate:
- aggregation
- table joins
- time-series analytics

---

# License

MIT License
