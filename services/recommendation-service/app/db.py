import os
from sqlalchemy import create_engine

POSTGRES_DSN = os.getenv("POSTGRES_DSN", "postgresql+psycopg2://glohib:changeme@postgres:5432/glohib_db")
engine = create_engine(POSTGRES_DSN, pool_pre_ping=True)
