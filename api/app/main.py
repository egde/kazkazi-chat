import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.routes import chat
from app.db import Base, engine
from logging.config import dictConfig

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
logger = logging.getLogger(__name__)
logger.info("Logging is configured.")
logger.info("Starting Kazkazi Chat API... with root path: %s", os.getenv("ENV"))
app = FastAPI(root_path="/api" if os.getenv("ENV") == "production" else "", 
              docs_url="/docs",
              openapi_url="/api/openapi.json" if os.getenv("ENV") == "production" else "/openapi.json",
              title="Kazkazi Chat API", 
              version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(chat.router)
