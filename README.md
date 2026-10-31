# 🇷🇼 NexRwanda
### National Development Intelligence Platform

**Data. Innovation. Rwanda's Future.**

NexRwanda is a national development intelligence platform designed to organize, explore, and analyze development indicators across key sectors in Rwanda. It supports evidence-based decision-making through centralized development information, interactive analytics, and development intelligence capabilities.

<p align="center">
  <a href="https://nexxrwnda.vercel.app">
    <strong>🌐 Visit Live Platform</strong>
  </a>
  &nbsp; | &nbsp;
  <a href="https://drive.google.com/file/d/15iZslaEv-3l8Vip1gAtqGlhO7altSOYG/view?usp=sharing">
    <strong>▶ Watch Project Demo</strong>
  </a>
</p>

---

## 🎥 Project Demonstration

Watch the three-minute demonstration to explore NexRwanda's interface, features, and development intelligence capabilities.

**[▶ Watch the NexRwanda Demo Video on Google Drive](https://drive.google.com/file/d/15iZslaEv-3l8Vip1gAtqGlhO7altSOYG/view?usp=sharing)**

**Live application:** https://nexxrwnda.vercel.app

---

## 📌 Project Overview

NexRwanda aims to provide a centralized digital environment for exploring development indicators and understanding progress across Rwanda's priority development sectors.

The platform focuses on three main sectors:

- **Education** — Explore education indicators and available performance measurements.
- **Health** — Organize and analyze health-related development indicators.
- **Employment** — Explore employment indicators and available measurements.

The platform aligns its development monitoring approach with Rwanda's **National Strategy for Transformation (NST2)**.

## 🎯 Project Objectives

- Centralize development indicators in one platform.
- Improve accessibility of development information.
- Support monitoring of national development priorities.
- Enable users to explore trends and compare available measurements with targets.
- Identify missing targets and records requiring verification.
- Support evidence-based analysis and informed decision-making.
- Promote transparency in development data reporting.

## ✨ Key Features

### 1. Overview Dashboard
- Centralized development overview.
- Key performance indicators.
- Sector summaries.
- Development trends.
- Quick access to platform features.

### 2. Education
- Education development indicators.
- Performance summaries.
- Indicator measurements.
- Available reporting information.

### 3. Health
- Health development indicators.
- Performance monitoring.
- Data visualization.
- Reporting information.

### 4. Employment
- Employment-related indicators.
- Available measurements.
- Performance trends.
- Sector information.

### 5. Innovation
- AI Development Intelligence Assistant.
- Rwanda Development Gap Map concept.
- NST2 Progress and Early-Warning System.
- Development innovation recommendations.

### 6. Analytics
- Indicator trend analysis.
- Sector comparisons.
- Actual versus target visualizations.
- Filtering and data exploration.
- CSV export where supported.

### 7. Development Intelligence
- Evidence-based indicator analysis.
- Below-target measurement identification.
- Missing target identification.
- Pending verification identification.
- Demonstration data identification.
- Analysis limitations and reporting transparency.

### 8. Data Transparency
NexRwanda distinguishes between:
- Verified measurements.
- Pending verification.
- Demonstration measurements.
- Missing targets.
- Below-target measurements.

A data source label alone does not establish that a measurement has been independently verified. The platform aims to make data provenance and verification status transparent.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19 |
| Programming Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Authentication | JWT |
| API Communication | REST API |
| Data Visualization | Existing chart libraries |
| Geographic Visualization | Leaflet / React Leaflet |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git and GitHub |

## 🏗️ System Architecture

NexRwanda uses a separated frontend and backend architecture.

```text
                 USERS
                   |
                   v
          NEXT.JS FRONTEND
             (Vercel)
                   |
                   v
             REST API
                   |
                   v
            FASTAPI BACKEND
              (Render)
                   |
                   v
           NEON POSTGRESQL
              DATABASE
```

The frontend communicates with the backend through REST API endpoints. The backend handles authentication, data access, and development intelligence operations.

---

## 🚀 Live Deployment

| Component | Deployment |
|---|---|
| Frontend | [NexRwanda Live Platform](https://nexxrwnda.vercel.app) |
| Backend | [NexRwanda API](https://nexrwanda-api.onrender.com) |
| API Documentation | [Interactive Swagger Documentation](https://nexrwanda-api.onrender.com/docs) |
| Project Demo | [Watch on Google Drive](https://drive.google.com/file/d/15iZslaEv-3l8Vip1gAtqGlhO7altSOYG/view?usp=sharing) |

---

## 💻 Local Installation and Setup

### Prerequisites

Install the following:

- Node.js
- npm
- Python
- Git
- A PostgreSQL database or existing Neon PostgreSQL connection

### 1. Clone the repository

```bash
git clone https://github.com/munezerodenys/NextRwanda.git
cd NextRwanda
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the frontend environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 4. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Set up the backend

Open another terminal:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the backend environment variables in `backend/.env` using your own database connection and securely generated JWT secret.

Do not commit `.env` files or expose database credentials.

### 6. Start the backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 🔐 Security and Data Integrity

NexRwanda incorporates:

- JWT-based authentication.
- Protected API endpoints.
- Environment-based configuration.
- Database-backed data management.
- Data verification status.
- Clear distinction between demonstration and verified measurements.

**Important:** Never commit database credentials, JWT secrets, access tokens, or private environment files to GitHub.

---

## 🌍 Development Framework

**National alignment:** Rwanda's National Strategy for Transformation (NST2).

**Data source context:** National Institute of Statistics of Rwanda (NISR).

The platform is designed to support the exploration and monitoring of national development indicators. Data should only be treated as official and verified when its underlying source, reporting period, definition, and verification status have been established.

---

## 🔮 Future Development

Potential areas for further development include:

- Expanded district-level development data.
- Advanced natural-language intelligence capabilities.
- More comprehensive early-warning analytics.
- Additional official data integrations.
- Enhanced development forecasting.
- Improved reporting and export capabilities.

These are development directions and should not be interpreted as already implemented features.

---

## 👨‍💻 Project Information

**Project Name:** NexRwanda

**Product Title:** National Development Intelligence Platform

**Project Focus:** National development monitoring and data intelligence.

**Primary Sectors:** Education, Health, Employment.

**Development Framework:** NST2.

**Data Source Context:** NISR.

**Developer:** Munezero Denys

**GitHub Repository:** [NextRwanda](https://github.com/munezerodenys/NextRwanda)

---

## 📄 License

A license has not yet been specified for this repository. All rights and permissions remain subject to the repository owner's terms until a license is added.

---

<p align="center">
  <strong>NexRwanda</strong><br>
  Data. Innovation. Rwanda's Future.
</p>
