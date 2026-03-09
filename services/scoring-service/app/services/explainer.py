import shap
import pandas as pd
from app.models.score import ExplainResponse
from app.services.model_registry import ModelRegistry
from app.services.features import FeatureExtractor
from app.models.features import FEATURE_COLS

class Explainer:
    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        self.extractor = FeatureExtractor()
        self._explainer = None

    async def explain(self, application_id: str) -> ExplainResponse:
        dummy_student = None
        dummy_internship = None
        features = await self.extractor.extract(dummy_student, dummy_internship)
        X = pd.DataFrame([features])
        clf = self.registry.classifier
        if self._explainer is None:
            self._explainer = shap.TreeExplainer(clf)
        shap_values = self._explainer.shap_values(X)[1]
        expected_value = float(self._explainer.expected_value[1])
        shap_dict = dict(zip(FEATURE_COLS, shap_values[0]))
        top = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:5]
        return ExplainResponse(
            application_id=application_id,
            shap_values=shap_dict,
            expected_value=expected_value,
            top_features=[k for k, _ in top],
        )
