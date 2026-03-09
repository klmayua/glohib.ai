from typing import List
import numpy as np
from app.models.score import (
    ApplicationScoreRequest,
    ApplicationScoreResponse,
    BatchScoreRequest,
    BatchScoreResponse,
    Score,
)
from app.services.features import FeatureExtractor
from app.services.model_registry import ModelRegistry
import pandas as pd

class Scorer:
    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        self.extractor = FeatureExtractor()

    async def score(self, req: ApplicationScoreRequest) -> ApplicationScoreResponse:
        features = await self.extractor.extract(req.student, req.internship)
        X = pd.DataFrame([features])
        pass_prob = self.registry.classifier.predict_proba(X)[:, 1][0]
        score_val = self.registry.regressor.predict(X)[0]
        score_val = np.clip(score_val, 0, 100)
        return ApplicationScoreResponse(
            application_id=req.application_id,
            score=Score(pass_prob=float(pass_prob), score=float(score_val)),
            model_version=await self.registry.current_version(),
        )

    async def score_batch(self, req: BatchScoreRequest) -> BatchScoreResponse:
        results = []
        for app in req.applications:
            results.append(await self.score(app))
        return BatchScoreResponse(results=results)
