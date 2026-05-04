#! /usr/bin/env bash
set -e
set -x

# MongoDB 연결 대기
python app/backend_pre_start.py

# 초기 데이터 생성
python app/initial_data.py
