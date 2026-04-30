import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load env from root
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(root_env)

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Studlyf Notifications")

import asyncio

async def send_notification_email(to_email: str, subject: str, body_html: str):
    """
    Sends a professional HTML email notification using a non-blocking thread.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        print("[EMAIL ERROR] SMTP credentials not found in .env")
        return False

    def send_sync_email():
        try:
            msg = MIMEMultipart()
            msg['From'] = f"{EMAIL_FROM_NAME} <{SMTP_USER}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body_html, 'html'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"[EMAIL ERROR] Failed to send email: {e}")
            return False

    return await asyncio.to_thread(send_sync_email)

def get_registration_template(user_name: str, event_name: str, custom_message: str = ""):
    message_html = f"<p>{custom_message}</p><br>" if custom_message else ""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #6C3BFF;">Registration Confirmed!</h2>
                <p>Hello <strong>{user_name}</strong>,</p>
                <p>You have successfully registered for <strong>{event_name}</strong>.</p>
                {message_html}
                <p>We are excited to see what you build! Stay tuned for further updates regarding the schedule and submission guidelines.</p>
                <br>
                <p>Best Regards,<br>Studlyf Institution Network</p>
            </div>
        </body>
    </html>
    """
