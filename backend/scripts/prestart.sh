#! /usr/bin/env bash
set -e
set -x

# MongoDB 연결 대기
python app/backend_pre_start.py

# MongoDB는 마이그레이션 불필요 (Beanie가 인덱스 자동 생성)

# 초기 데이터 생성
python app/initial_data.py
