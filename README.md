# Abhinandan Thakur (Abhi) — Engineering Portfolio Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Monorepo: npm workspaces](https://img.shields.io/badge/Monorepo-npm%20workspaces-crimson.svg)](https://docs.npmjs.com/cli/using-npm/workspaces)
[![Firebase: Ready](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Functions%20%7C%20Firestore-orange.svg)](https://firebase.google.com/)

A high-performance monorepo housing the production portfolio web application, interactive projects archive, and serverless Firebase backend microservices for systems developer & full-stack engineer **Abhinandan Thakur (Abhi)**.

---

## Architecture Overview

```
.
├── apps/
│   ├── web/                         # Frontend Portfolio Web Application
│   │   ├── public/
│   │   │   └── assets/
│   │   │       ├── frames/          # 240 high-performance canvas video frames
│   │   │       └── images/          # Production project mockups & system visuals
│   │   ├── src/
│   │   │   ├── css/
│   │   │   │   ├── style.css        # Hero, canvas animation & landing page styles
│   │   │   │   └── projects.css     # Sticky stacking showcase & modal design system
│   │   │   └── js/
│   │   │       ├── script.js        # Canvas video frame scrub engine (60fps lerp)
│   │   │       ├── projects.js      # GPU-composited sticky card stacking & Lenis
│   │   │       └── firebase-init.js # Client-side Firebase connector & inquiry helper
│   │   ├── index.html               # Main landing page
│   │   ├── projects.html            # Projects archive showcase
│   │   ├── resume.html              # Interactive resume preview
│   │   ├── server.js                # High-performance static dev server with asset aliases
│   │   └── package.json             # @portfolio/web package configuration
│   │
│   └── backend/                     # Node.js & Firebase Cloud Functions Service
│       ├── src/
│       │   ├── index.js             # Cloud Functions & standalone Express API entry
│       │   ├── routes/
│       │   │   ├── contact.js       # Validated inquiry ingestion & Firestore storage
│       │   │   └── telemetry.js     # Anonymous site telemetry & FCP tracking
│       │   └── services/
│       │       └── mailer.js        # Email dispatcher (Mailofly API & fallback)
│       ├── .env.example             # Environment variable template
│       └── package.json             # @portfolio/backend package configuration
│
├── firebase.json                    # Firebase CLI Hosting, Functions, and Firestore config
├── .firebaserc                      # Firebase project aliases
├── firestore.rules                  # Firestore security rules (strict write validation & admin protection)
├── firestore.indexes.json           # Firestore compound query indexes
├── storage.rules                    # Cloud Storage security rules
├── package.json                     # Monorepo root workspace orchestrator
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation & Firebase guide
```

---

## Getting Started

### 1. Run Locally

From the root directory of the monorepo:

```bash
# Start the web frontend on http://localhost:3000
npm run dev

# Or start the backend API on http://localhost:5000
npm run dev:backend
```

### 2. Available Root Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the high-performance local dev server for `apps/web`. |
| `npm run dev:backend` | Starts the Express / Cloud Functions local API server. |
| `npm run build` | Validates static assets and compiles the frontend workspace. |
| `npm run deploy` | Deploys entire monorepo to Firebase (Hosting + Functions + Firestore). |
| `npm run deploy:hosting` | Deploys only the static web frontend (`apps/web`) to Firebase CDN. |
| `npm run deploy:functions` | Deploys backend microservices (`apps/backend`) to Google Cloud Functions. |
| `npm run deploy:firestore` | Deploys security rules and compound indexes to Cloud Firestore. |
| `npm run emulators` | Boots the local Firebase Suite (Hosting, Functions, Firestore Emulator UI). |

---

## Connecting Firebase (Step-by-Step)

When you are ready to connect your live Firebase project, follow these simple steps:

### Step 1: Install Firebase CLI & Log In
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Link Your Firebase Project
```bash
# Set your Firebase project ID (replace with your console project ID)
firebase use --add
```
Or edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### Step 3: Populate Web Credentials
Open `apps/web/src/js/firebase-init.js` and paste your web app credentials copied from **Firebase Console > Project Settings > Your Apps**:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### Step 4: Deploy to Production
```bash
# Deploy everything in a single command
firebase deploy
```

---

## Core Engineering Features

* **Sub-Second Canvas Animation**: 240 compressed frames scrubbed at 60fps/120fps with linear interpolation (`lerp`) and zero composite stalls.
* **Sticky Stacking Cards**: Built with 100% GPU-composited CSS transforms and opacity shading (`.project-card-shade`), eliminating layout thrashing and multi-pass blur overhead.
* **Lenis Smooth Inertia**: Integrated modern smooth momentum scrolling with modal pause-resume guards.
* **Firebase-Ready Backend**: Structured for serverless Google Cloud Functions with built-in CORS, Firestore document persistence, and Mailofly webhook / email dispatch.
