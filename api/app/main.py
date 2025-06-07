from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.routes import chat
from app.db import Base, engine
from logging.config import dictConfig
import os

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "default",
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "app": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}

# Apply the configuration
dictConfig(log_config)

# Determine if we should use a prefix (e.g., in production)
API_PREFIX = "/api" if os.getenv("KAZKAZI_ENV") == "production" else ""

app = FastAPI(root_path=API_PREFIX)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(chat.router, prefix=API_PREFIX)
