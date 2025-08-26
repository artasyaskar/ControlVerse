# ControlVerse

ControlVerse is a real-time control systems simulator and explainer. It allows users to simulate classical control systems like DC motors, inverted pendulums, and RLC circuits, adjust control parameters, and visualize the effects in real-time. An AI assistant is available to explain the behavior of the system.

## Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Plotly.js, React Three Fiber
-   **Backend:** FastAPI, Uvicorn, Python 3.11
-   **Database & Auth:** Supabase
-   **AI:** Google Gemini (or mock)

## Project Structure

```
controlverse/
├── frontend/
├── backend/
└── supabase/
```

## Getting Started

### Prerequisites

-   Node.js and npm
-   Python 3.11+ and pip
-   A Supabase account
-   A Google Gemini API key (optional)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/controlverse.git
    cd controlverse
    ```

2.  **Set up the frontend:**
    ```bash
    cd frontend
    npm install
    cp .env.example .env
    # Add your Supabase URL and anon key to .env
    ```

3.  **Set up the backend:**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    cp .env.example .env
    # Add your Gemini API key and Supabase URL + Service Role Key to .env
    ```

### Development

**Important:** The backend server must be running for the frontend application to function correctly.

1.  **Run the backend:**
    ```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
# Main command to run the backend server
python -m uvicorn main:app --reload    ```

2.  **Run the frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

## Deployment

### Frontend (Vercel)

1.  Connect your GitHub repository to Vercel.
2.  Set the root directory to `frontend`.
3.  Configure the build command: `npm run build`.
4.  Add your environment variables to the Vercel project settings:
    -   `VITE_BACKEND_URL`: The URL of your deployed backend (e.g., `https://your-service.up.railway.app`)
    -   `VITE_SUPABASE_URL`: Your Supabase project URL.
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.

### Backend (Railway)

This repo includes `backend/Procfile` so Railway can run Uvicorn via Nixpacks/Buildpacks.

1.  Create a Railway account and connect your GitHub repo.
2.  New Project → Deploy from GitHub → select this repo.
3.  Set the __Root Directory__ to `backend` (so Railway builds only the backend).
4.  Railway auto-detects Python and the `Procfile`:
    - Start command: `web: uvicorn main:app --host 0.0.0.0 --port ${PORT}`
5.  Set environment variables in the Railway service:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `GEMINI_API_KEY` (if using AI features)
6.  Deploy. Railway assigns a public URL; copy it and set it in Vercel as `VITE_BACKEND_URL`.

Notes:
- Do not commit `.env` with secrets. Keep them local; set them in Railway.
- CORS: if you restrict origins in `backend/main.py`, add your Vercel domain.

Optional:
- Docker is not required for Railway, but a `backend/Dockerfile` exists if you ever choose Docker-based hosting.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
