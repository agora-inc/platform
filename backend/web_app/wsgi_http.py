from app import app, db
from OpenSSL import SSL

if __name__ == "__main__":
    app.run(port=8000)
