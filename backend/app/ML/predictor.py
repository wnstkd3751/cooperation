import pickle
import app.utils.features as features

# 서버 시작할 때 pkl 한 번만 로딩
with open("app/ml/model/model.pkl", "rb") as f:
    model = pickle.load(f)

def predict(ingredient):
    # 1. 피처 추출
    vector = features.extract_features(ingredient)

    # 2. 예측 (2차원 리스트로 감싸야 함)
    score = model.predict_proba([vector])[0][1]

    return score