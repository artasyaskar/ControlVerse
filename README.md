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
-   Docker (for backend deployment)
-   A Supabase account
-   A Fly.io account
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
    cd backend
    uvicorn main:app --reload
    ```

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
    -   `VITE_BACKEND_URL`: The URL of your deployed backend (e.g., `https://controlverse-backend.fly.dev`)
    -   `VITE_SUPABASE_URL`: Your Supabase project URL.
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.

### Backend (Fly.io)

1.  Install the Fly.io CLI: `curl -L https://fly.io/install.sh | sh`
2.  Log in to Fly.io: `fly auth login`.
3.  Launch the app: `fly launch --no-deploy`. This will create a `fly.toml` file.
4.  Deploy the app: `fly deploy`.
5.  Set secrets:
    ```bash
    fly secrets set \
      GEMINI_API_KEY=your-key \
      SUPABASE_URL=your-supabase-url \
      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
