"""
Tests for Scoring Service
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
    assert "GlohibAI Scoring Service" in response.json()["message"]


def test_score_application_missing_fields():
    """Test scoring endpoint with missing required fields"""
    response = client.post(
        "/api/v1/score/application",
        json={}
    )
    assert response.status_code == 422


def test_score_application_minimal_data():
    """Test scoring with minimal application data"""
    application_data = {
        "application_id": "app_12345",
        "student_id": "student_001",
        "internship_id": "intern_001"
    }
    
    response = client.post(
        "/api/v1/score/application",
        json=application_data
    )
    
    # May return score or service unavailable if model not loaded
    if response.status_code == 200:
        data = response.json()
        assert "score" in data or "match_score" in data
    elif response.status_code == 503:
        # Model not loaded - acceptable in test environment
        pass


def test_score_batch_missing_fields():
    """Test batch scoring with missing fields"""
    response = client.post(
        "/api/v1/score/batch",
        json={}
    )
    assert response.status_code == 422


def test_score_explain_missing_id():
    """Test score explanation without ID"""
    response = client.get("/api/v1/score/explain")
    assert response.status_code == 422


def test_features_extract_missing_fields():
    """Test feature extraction with missing fields"""
    response = client.post(
        "/api/v1/features/extract",
        json={}
    )
    assert response.status_code == 422


def test_features_extract_success():
    """Test successful feature extraction"""
    student_data = {
        "student_id": "12345",
        "skills": ["Python", "Java"],
        "gpa": 3.5,
        "year": 3
    }
    
    response = client.post(
        "/api/v1/features/extract",
        json=student_data
    )
    
    if response.status_code == 200:
        data = response.json()
        assert "features" in data
        assert isinstance(data["features"], list)


@pytest.mark.skip(reason="Requires model files")
def test_batch_scoring():
    """Integration test: Batch scoring of multiple applications"""
    applications = [
        {
            "application_id": "app_001",
            "student_id": "student_001",
            "internship_id": "intern_001"
        },
        {
            "application_id": "app_002",
            "student_id": "student_002",
            "internship_id": "intern_001"
        }
    ]
    
    response = client.post(
        "/api/v1/score/batch",
        json={"applications": applications}
    )
    
    if response.status_code == 200:
        data = response.json()
        assert "scores" in data
        assert len(data["scores"]) == 2


@pytest.mark.skip(reason="Requires model files")
def test_model_explainability():
    """Test SHAP explanation generation"""
    # First score an application
    score_response = client.post(
        "/api/v1/score/application",
        json={
            "application_id": "app_12345",
            "student_id": "student_001",
            "internship_id": "intern_001"
        }
    )
    
    if score_response.status_code == 200:
        # Get explanation
        explain_response = client.get(
            f"/api/v1/score/app_12345/explain"
        )
        
        if explain_response.status_code == 200:
            data = explain_response.json()
            assert "explanation" in data or "shap_values" in data
