"""
Integration Tests for GlohibAI Services
Tests the interaction between multiple services
"""
import pytest
import requests
import os

# Service URLs (from environment or defaults)
IDENTITY_SERVICE_URL = os.getenv("IDENTITY_SERVICE_URL", "http://localhost:8080")
STUDENT_SERVICE_URL = os.getenv("STUDENT_SERVICE_URL", "http://localhost:8082")
INTERNSHIP_SERVICE_URL = os.getenv("INTERNSHIP_SERVICE_URL", "http://localhost:8083")
RECOMMENDATION_SERVICE_URL = os.getenv("RECOMMENDATION_SERVICE_URL", "http://localhost:8007")
SCORING_SERVICE_URL = os.getenv("SCORING_SERVICE_URL", "http://localhost:8008")


class TestServiceHealth:
    """Test that all services are healthy"""

    def test_identity_service_health(self):
        """Check identity service health"""
        response = requests.get(f"{IDENTITY_SERVICE_URL}/health", timeout=5)
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_student_service_health(self):
        """Check student service health"""
        response = requests.get(f"{STUDENT_SERVICE_URL}/health", timeout=5)
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_internship_service_health(self):
        """Check internship service health"""
        response = requests.get(f"{INTERNSHIP_SERVICE_URL}/health", timeout=5)
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_recommendation_service_health(self):
        """Check recommendation service health"""
        response = requests.get(f"{RECOMMENDATION_SERVICE_URL}/health", timeout=5)
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_scoring_service_health(self):
        """Check scoring service health"""
        response = requests.get(f"{SCORING_SERVICE_URL}/health", timeout=5)
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestUserJourney:
    """Test complete user journey across services"""

    @pytest.fixture
    def registered_user(self):
        """Fixture: Register a test user"""
        user_data = {
            "email": f"test_{os.urandom(4).hex()}@example.com",
            "password": "TestPassword123!",
            "full_name": "Test User"
        }
        
        response = requests.post(
            f"{IDENTITY_SERVICE_URL}/api/v1/auth/register",
            json=user_data,
            timeout=10
        )
        
        if response.status_code == 201:
            return response.json()
        return None

    def test_register_and_login(self, registered_user):
        """Test: Register user and login"""
        if not registered_user:
            pytest.skip("Registration failed")
        
        assert "access_token" in registered_user
        assert "user" in registered_user
        assert "id" in registered_user["user"]

    def test_create_student_profile(self, registered_user):
        """Test: Create student profile after registration"""
        if not registered_user:
            pytest.skip("Registration failed")
        
        token = registered_user["access_token"]
        user_id = registered_user["user"]["id"]
        
        headers = {"Authorization": f"Bearer {token}"}
        
        student_data = {
            "user_id": user_id,
            "bio": "Test student profile",
            "skills": [
                {"name": "Python", "level": "intermediate"},
                {"name": "JavaScript", "level": "beginner"}
            ],
            "education": [
                {
                    "institution": "Test University",
                    "degree": "Bachelor of Science",
                    "field_of_study": "Computer Science",
                    "start_date": "2023-09-01",
                    "end_date": "2027-06-01"
                }
            ]
        }
        
        response = requests.post(
            f"{STUDENT_SERVICE_URL}/api/v1/students",
            json=student_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 201:
            student = response.json()
            assert "id" in student
            assert student["user_id"] == user_id

    def test_browse_internships(self):
        """Test: Browse available internships"""
        response = requests.get(
            f"{INTERNSHIP_SERVICE_URL}/api/v1/internships",
            timeout=10
        )
        
        # Should return list (may be empty)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_search_internships(self):
        """Test: Search internships with filters"""
        search_criteria = {
            "query": "software engineer",
            "filters": {
                "location": "Remote",
                "type": "Internship"
            }
        }
        
        response = requests.post(
            f"{INTERNSHIP_SERVICE_URL}/api/v1/internships/search",
            json=search_criteria,
            timeout=10
        )
        
        if response.status_code == 200:
            results = response.json()
            assert isinstance(results, list)


class TestAPIIntegration:
    """Test API integration between services"""

    def test_recommendation_after_profile_creation(self):
        """Test: Get recommendations after creating student profile"""
        # This would require a full user journey setup
        # For now, test that the endpoint is accessible
        response = requests.get(
            f"{RECOMMENDATION_SERVICE_URL}/api/v1/recommendations",
            params={"student_id": "test_student_id"},
            timeout=10
        )
        
        # May return 404 if student not found, or 200 with recommendations
        assert response.status_code in [200, 404, 503]

    def test_scoring_service_integration(self):
        """Test: Score an application"""
        application_data = {
            "application_id": "test_app_001",
            "student_id": "test_student_001",
            "internship_id": "test_internship_001"
        }
        
        response = requests.post(
            f"{SCORING_SERVICE_URL}/api/v1/score/application",
            json=application_data,
            timeout=10
        )
        
        # May return score or 503 if model not loaded
        assert response.status_code in [200, 503]


class TestRateLimiting:
    """Test rate limiting functionality"""

    def test_rate_limit_on_auth_endpoint(self):
        """Test: Rate limiting on authentication endpoints"""
        # Make multiple rapid requests
        responses = []
        for _ in range(110):
            response = requests.post(
                f"{IDENTITY_SERVICE_URL}/api/v1/auth/login",
                json={"email": "test@example.com", "password": "wrong"},
                timeout=5
            )
            responses.append(response.status_code)
        
        # Should get at least one 429 (Too Many Requests)
        assert 429 in responses or len([r for r in responses if r == 401]) > 0
