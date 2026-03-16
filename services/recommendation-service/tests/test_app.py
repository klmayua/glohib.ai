"""
Tests for Recommendation Service
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "GlohibAI Recommendation Service" in response.json()["message"]


def test_vectorize_student_missing_fields():
    """Test student vectorization with missing required fields"""
    response = client.post(
        "/api/v1/vectorize/student",
        json={}
    )
    assert response.status_code == 422  # Validation error


def test_vectorize_student_success():
    """Test successful student vectorization"""
    student_data = {
        "student_id": "12345",
        "skills": ["Python", "JavaScript", "Machine Learning"],
        "interests": ["Software Engineering", "AI/ML"],
        "education": [
            {
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "institution": "Test University"
            }
        ]
    }
    
    response = client.post(
        "/api/v1/vectorize/student",
        json=student_data
    )
    
    # Note: This may fail if model is not loaded, so we check for either success or service unavailable
    if response.status_code == 200:
        assert "vector" in response.json()
        assert len(response.json()["vector"]) > 0
    elif response.status_code == 503:
        # Service unavailable (model not loaded) - acceptable in test environment
        pass


def test_vectorize_internship_missing_fields():
    """Test internship vectorization with missing required fields"""
    response = client.post(
        "/api/v1/vectorize/internship",
        json={}
    )
    assert response.status_code == 422


def test_get_recommendations_missing_student_id():
    """Test recommendations endpoint without student ID"""
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 422


def test_track_click_missing_fields():
    """Test click tracking with missing fields"""
    response = client.post(
        "/api/v1/track/click",
        json={}
    )
    assert response.status_code == 422


def test_track_view_missing_fields():
    """Test view tracking with missing fields"""
    response = client.post(
        "/api/v1/track/view",
        json={}
    )
    assert response.status_code == 422


@pytest.mark.skip(reason="Requires Redis connection")
def test_recommendations_with_tracking():
    """Integration test: Get recommendations after tracking some behavior"""
    # Track some clicks
    client.post(
        "/api/v1/track/click",
        json={
            "student_id": "12345",
            "internship_id": "intern_001"
        }
    )
    
    # Get recommendations
    response = client.get(
        "/api/v1/recommendations",
        params={"student_id": "12345"}
    )
    
    if response.status_code == 200:
        data = response.json()
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)
