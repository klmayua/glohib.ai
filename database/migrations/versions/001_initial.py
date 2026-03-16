"""Initial migration - create all tables

Revision ID: 001
Revises: 
Create Date: 2026-03-10

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgvector"')
    
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('student', 'employer', 'admin', name='userrole'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    op.create_table('student_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=False),
        sa.Column('last_name', sa.String(100), nullable=False),
        sa.Column('university', sa.String(255), nullable=True),
        sa.Column('degree', sa.String(255), nullable=True),
        sa.Column('skills', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    )
    
    op.create_table('employer_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('organization_name', sa.String(255), nullable=False),
        sa.Column('industry', sa.String(100), nullable=True),
        sa.Column('website', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    )
    
    op.create_table('internships',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('employer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('location', sa.String(255), nullable=True),
        sa.Column('remote', sa.Boolean(), nullable=True),
        sa.Column('skills_required', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['employer_id'], ['employer_profiles.id']),
    )
    
    op.create_table('applications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('internship_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.Enum('submitted', 'reviewed', 'shortlisted', 'rejected', 'accepted', name='applicationstatus'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['student_profiles.id']),
        sa.ForeignKeyConstraint(['internship_id'], ['internships.id']),
    )
    
    op.create_table('assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('score', sa.Integer(), nullable=True),
        sa.Column('results', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['student_profiles.id']),
    )
    
    op.create_table('scores',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('internship_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('match_score', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['student_profiles.id']),
        sa.ForeignKeyConstraint(['internship_id'], ['internships.id']),
    )


def downgrade() -> None:
    op.drop_table('scores')
    op.drop_table('assessments')
    op.drop_table('applications')
    op.drop_table('internships')
    op.drop_table('employer_profiles')
    op.drop_table('student_profiles')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.execute('DROP TYPE IF EXISTS userrole')
    op.execute('DROP TYPE IF EXISTS applicationstatus')
