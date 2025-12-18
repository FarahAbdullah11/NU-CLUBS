# hash_passwords.py
import bcrypt
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

connection = pymysql.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

passwords = {
    'farahghaly@nu.edu.eg': 'nimun123',
    'omarsamir@nu.edu.eg': 'rpm123',
    'omarkhaled@nu.edu.eg': 'icpc123',
    'rofaidaelshobaky@nu.edu.eg': 'ieee123',
    'ginamowafy@nu.edu.eg': 'adminSLO',
    'janayaman@nu.edu.eg': 'adminSU'
}

with connection:
    with connection.cursor() as cursor:
        for email, plain_pw in passwords.items():
            hashed = bcrypt.hashpw(plain_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute("UPDATE users SET password_hash = %s WHERE email = %s", (hashed, email))
    connection.commit()
