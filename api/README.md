# Kazkazi Chat API

This is the backend API for the Kazkazi Chat application, built with FastAPI and SQLite.

## Features
- User session management
- Chat endpoint with assistant responses
- JWT-based authentication
- SQLite database via SQLAlchemy

## Requirements
- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (for dependency management and running scripts)

## Installation

1. **Install dependencies** (if not already):
   ```sh
   uv sync
   ```

2. **Set up the database** (the database will be created automatically on first run).

## Running in Development Mode

To start the FastAPI development server, run:

```sh
uv run fastapi dev
```

This will launch the API at [http://127.0.0.1:8000](http://127.0.0.1:8000).

- The main FastAPI app is located in `app/main.py`.
- API endpoints are available under `/chat`.

## Project Structure

- `app/` - Main application code
  - `main.py` - FastAPI app entrypoint
  - `routes/` - API route definitions
  - `models.py` - SQLAlchemy models
  - `schemas.py` - Pydantic schemas
  - `auth.py` - Authentication utilities
  - `db.py` - Database setup
- `chat.db` - SQLite database file
- `pyproject.toml` - Project dependencies and metadata
- `uv.lock` - Lockfile for reproducible installs

## License
MIT
