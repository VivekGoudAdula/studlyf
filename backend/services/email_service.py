import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load env from root
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(root_env)

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("email_service")

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Studlyf Notifications")

import asyncio

async def send_notification_email(to_email: str, subject: str, body_html: str):
    """
    Sends an email notification using SMTP_SSL (Port 465) for maximum compatibility.
    """
    # Dynamically read env vars to ensure we catch any dashboard updates
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    email_from = os.getenv("EMAIL_FROM_NAME", "Studlyf Notifications")

    if not smtp_user or not smtp_pass:
        logger.error("[EMAIL ERROR] SMTP_USER or SMTP_PASSWORD is not set in environment variables.")
        return False

    def send_sync_email():
        try:
            logger.info(f"[EMAIL] Attempting to send to {to_email} via {smtp_server}:{smtp_port}")
            
            msg = MIMEMultipart()
            msg['From'] = f"{email_from} <{smtp_user}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body_html, 'html'))

            # Force SSL for 465, else use STARTTLS
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=15)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, timeout=15)
                server.starttls()
                
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            logger.info(f"[EMAIL SUCCESS] Email delivered to {to_email}")
            return True
        except Exception as e:
            logger.error(f"[EMAIL ERROR] {str(e)}")
            if "Network is unreachable" in str(e) and smtp_port != 465:
                logger.warning("[EMAIL TIP] Port 587 is blocked. Please change SMTP_PORT to 465 in Render settings.")
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
