import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email(to_email: str, code: str):
    subject = "ReciTalk 이메일 인증번호"

    body = f"""
안녕하세요.

인증번호는 아래와 같습니다.

{code}

5분 이내에 입력해주세요.
"""

    message = MIMEMultipart()
    message["From"] = EMAIL_ADDRESS
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.send_message(message)
        server.quit()

        print(f"메일 발송 완료: {to_email}")

    except Exception as e:
        print(f"메일 발송 실패: {e}")
        raise e