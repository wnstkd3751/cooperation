import pickle
from sklearn.ensemble import RandomForestClassifier
from db.mongo import db
import app.utils.features as features

def train():
    # DB에서 피드백 데이터 가져오기
    feedbacks = list(db["feedback_log"].find({}))

    X = []  # 입력 벡터
    y = []  # 정답

    for feedback in feedbacks:
        # 재료마다 피처 추출
        for ingredient in feedback["ingredients"]:
            vector = features.extract_features(ingredient)
            X.append(vector)

        # 정답 추가
        y.append(feedback["chosen"])

    # 모델 학습
    model = RandomForestClassifier()
    model.fit(X, y)

    # pkl로 저장
    with open("app/ml/model/model.pkl", "wb") as f:
        pickle.dump(model, f)