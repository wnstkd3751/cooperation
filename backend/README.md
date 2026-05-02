# FastAPI Project - Backend

## 기술 스택

- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB Atlas (Motor + Beanie)
- **Auth**: JWT (PyJWT + pwdlib)
- **LLM**: Anthropic Claude API
- **Package Manager**: uv

## 요구사항

- [Docker](https://www.docker.com/)
- [uv](https://docs.astral.sh/uv/)

## 로컬 개발 환경 설정

### 1. 의존성 설치

```console
$ cd backend
$ uv sync
$ source .venv/bin/activate
```

### 2. 환경변수 설정

```console
$ cp ../.env.example ../.env
```

### 3. 서버 실행

```console
$ fastapi run --reload app/main.py
```

## 테스트

```console
$ bash scripts/test.sh
```

테스트는 `mongomock-motor`를 사용해 실제 MongoDB 연결 없이 인메모리로 실행됩니다.

## 코드 품질

```console
$ bash scripts/lint.sh    # 검사
$ bash scripts/format.sh  # 자동 포맷
```

## 폴더 구조

```
app/
├── core/       # 설정, DB 연결, JWT
├── api/        # FastAPI 라우터
├── services/   # 비즈니스 로직 (LLM, 추천)
├── models.py   # Beanie Document
├── crud.py     # DB CRUD 함수
└── decay.py    # 유통기한 가중치 계산
```

## 담당 영역

| 파일 | 담당 |
|---|---|
| `api/routes/login.py`, `users.py` | 팀원 |
| `api/routes/recommend.py` | AI 담당 |
| `services/llm_service.py` | AI 담당 |
| `services/recommend_service.py` | AI 담당 |
| `decay.py` | AI 담당 |
| `models.py` | 공동 (변경 시 사전 합의) |
