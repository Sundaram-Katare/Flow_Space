# FlowSpace - The Ultimate Team Synchronization Platform

![FlowSpace Banner](https://illustrations.popsy.co/teal/working-at-home.svg)

## 🚀 Product Mindset
FlowSpace was built with a **"People-First, Efficiency-Always"** mindset. In an era where teams are fragmented across multiple tools (one for chat, one for tasks, one for docs), FlowSpace aims to be the **Gravity** that pulls these essential workflows into a single, cohesive, and premium experience. We believe that a beautiful interface leads to better work, and a unified workspace leads to faster delivery.

---

## 🎯 Problem It Solves
The "Context Switching Tax" is the biggest killer of modern productivity. Teams lose hours every week switching between Slack for chat, Trello for tasks, and Notion for documentation. This fragmentation leads to:
- **Information Silos**: Critical data hidden in long chat threads.
- **Lost Context**: Tasks that don't link back to the original discussion.
- **App Fatigue**: Too many notifications from too many different sources.
- **Onboarding Friction**: New members struggling to find where "the truth" lives.

## ✨ Our Solution: The FlowSpace Ecosystem
FlowSpace eliminates fragmentation by integrating the three pillars of teamwork into a single workspace:
1.  **Real-Time Conversations**: Channel-based chat with typing indicators and instant updates.
2.  **Agile Task Management**: A high-fidelity Kanban board to track progress from "To Do" to "Done".
3.  **Living Documentation**: Collaborative docs to store knowledge where the team actually works.

---

## 🛠 Tech Stack

### Frontend (The Visual Experience)
- **React.js & Vite**: For a lightning-fast, modern development and runtime experience.
- **Redux Toolkit**: Centralized state management for complex workspace and chat data.
- **Framer Motion**: Powering the premium micro-interactions and smooth page transitions.
- **Tailwind CSS**: A utility-first CSS framework for a bespoke, consistent design system.
- **Lucide React**: A beautiful, consistent icon library.
- **Socket.io-client**: Real-time bidirectional communication.

### Backend (The Engine)
- **Node.js & Express**: A robust and scalable server architecture.
- **PostgreSQL**: Relational database for structured data like users, workspaces, and tasks.
- **Redis**: Powering the real-time message distribution and cross-instance synchronization.
- **Socket.io**: Real-time event handling for chat, typing indicators, and updates.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.

---

## 🏗 Workflow & Architecture

### 1. Workspace Isolation
Users create or join workspaces using unique invite codes. Every workspace is a sandbox, ensuring team privacy and focused environments.

### 2. Real-Time Data Pipeline
When a user sends a message or moves a task:
1.  The client emits a socket event.
2.  The server validates the request and commits the change to **PostgreSQL**.
3.  The server publishes the event to **Redis**.
4.  The **Redis Subscriber** catches the event and broadcasts it to all connected clients in that workspace/channel.

### 3. State Syncing
We use a **Hybrid State Strategy**:
- **Redux** manages the global UI state and active user data.
- **React Context** (in layouts) manages local workspace-specific navigation and sidebar states.
- **URL Parameters** act as the single source of truth for channel and workspace navigation.

---

## 🌟 Key Features

### 💎 Premium Dashboard
- **Glassmorphic UI**: A modern, clean look with teal gradients.
- **Workspace Hub**: Easily manage multiple teams from one central screen.

### 💬 Real-Time Chat
- **Channels**: Organize conversations by topic or project.
- **Typing Indicators**: See when your teammates are responding in real-time.
- **Threaded History**: Instant access to previous conversations.

### 📋 Agile Kanban Board
- **Drag-and-Drop**: Smooth task transitions using Framer Motion.
- **Priority Indicators**: Visual cues for "Urgent", "Medium", and "Low" tasks.
- **Task Modals**: Detailed task views with assignment and description fields.

### 📄 Integrated Docs
- **Knowledge Base**: Create and organize team documentation without leaving the workspace.

---

## 🚥 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis

### Installation
1. **Clone the Repo**
   ```bash
   git clone https://github.com/Sundaram-Katare/Flow_Space.git
   cd Flow_Space
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with your DB and Redis credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create a .env file with VITE_API_URL and VITE_SOCKET_URL
   npm run dev
   ```

---

## 🎨 Design Philosophy
FlowSpace follows a **Teal & Slate** color palette, emphasizing clarity and calmness. We use large border-radii (`32px`), soft shadows, and glassmorphism to create a "Premium SaaS" feel that users actually enjoy looking at all day.

---

Built with ❤️ by the FlowSpace Team.
