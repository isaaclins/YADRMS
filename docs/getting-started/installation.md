---
id: installation
title: Installation Guide
description: Step-by-step installation of YADRMS.
---

# Installation

Follow these steps to install YADRMS:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/isaaclins/YADRMS.git
   cd YADRMS
   ```

2. **Backend Setup:**
   - Ensure you have Python 3.8+ installed.
   - Create a virtual environment and install dependencies:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     pip install -r backend/requirements.txt
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install Node dependencies:
     ```bash
     npm install
     ```

4. **Configuration:**
   - See [Configuration](./configuration.md) for details on setting environment variables and API keys.

5. **Run the Application:**
   - Start the backend:
     ```bash
     python backend/main.py
     ```
   - In a separate terminal, start the frontend:
     ```bash
     npm run dev
     ```

You should now have YADRMS running locally.

