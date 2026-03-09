import os
import joblib
import uuid
from typing import Dict, Any, Optional
import xgboost as xgb
import pandas as pd
from datetime import datetime
import structlog

logger = structlog.get_logger()

class ModelRegistry:
    def __init__(self, base_path: str):
        self.base = base_path
        os.makedirs(self.base, exist_ok=True)
        self._clf: Optional[xgb.XGBClassifier] = None
        self._reg: Optional[xgb.XGBRegressor] = None
        self._version: str = ""

    async def load_model(self, version: str):
        clf_path = os.path.join(self.base, f"{version}_clf.json")
        reg_path = os.path.join(self.base, f"{version}_reg.json")
        if not (os.path.exists(clf_path) and os.path.exists(reg_path)):
            raise FileNotFoundError(f"model {version} not found")
        self._clf = xgb.XGBClassifier()
        self._clf.load_model(clf_path)
        self._reg = xgb.XGBRegressor()
        self._reg.load_model(reg_path)
        self._version = version
        logger.info("model_loaded", version=version)

    @property
    def classifier(self):
        if not self._clf:
            raise RuntimeError("model not loaded")
        return self._clf

    @property
    def regressor(self):
        if not self._reg:
            raise RuntimeError("model not loaded")
        return self._reg

    async def current_version(self) -> str:
        return self._version

    async def train_and_register(self, req) -> str:
        version = datetime.utcnow().strftime("v%Y%m%d%H%M%S")
        df = pd.read_parquet(req.dataset_path)
        X = df.drop(columns=["pass", "score"])
        y_clf = df["pass"]
        y_reg = df["score"]

        clf = xgb.XGBClassifier(
            objective="binary:logistic",
            eval_metric="auc",
            n_estimators=300,
            learning_rate=0.1,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            **(req.params or {}),
        )
        clf.fit(X, y_clf)
        clf_path = os.path.join(self.base, f"{version}_clf.json")
        clf.save_model(clf_path)

        reg = xgb.XGBRegressor(
            objective="reg:squarederror",
            eval_metric="rmse",
            n_estimators=300,
            learning_rate=0.1,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            **(req.params or {}),
        )
        reg.fit(X, y_reg)
        reg_path = os.path.join(self.base, f"{version}_reg.json")
        reg.save_model(reg_path)

        logger.info("model_trained", version=version)
        await self.load_model(version)
        return version
