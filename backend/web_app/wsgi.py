from app import app, db
from OpenSSL import SSL

if __name__ == "__main__":
    key_loc = '/etc/nginx/conf.d/ssl-files/ssl_csr.key'
    cert_loc = '/etc/nginx/conf.d/ssl-files/www_agora_stream.crt'
    context = (cert_loc, key_loc)

    try:
        app.run(ssl_context=context)
    except:
        app.run(port=8000)
