import smtplib

from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

SMTP_USER = "ggs2026@gmail.com"
SMTP_PASSWORD = "junsang123"

def send_email(email: str, code: str):

    msg = MIMEText(
        f"인증번호 : {code}"
    )

    msg["Subject"] = "냉장고 앱 인증번호"

    msg["From"] = SMTP_USER
    msg["To"] = email

    server = smtplib.SMTP(
        SMTP_SERVER,
        SMTP_PORT
    )

    server.starttls()

    server.login(
        SMTP_USER,
        SMTP_PASSWORD
    )

    server.send_message(msg)

    server.quit()