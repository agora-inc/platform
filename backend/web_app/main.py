from app import app, db

if __name__ == "__main__":
    app.run(ssl_context='adhoc')