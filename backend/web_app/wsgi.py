from app import app, db
from OpenSSL import SSL

if __name__ == "__main__":
    key_loc = '/etc/nginx/conf.d/ssl-files/ssl_csr.key'
    cert_loc = '/etc/nginx/conf.d/ssl-files/www_agora_stream.crt'
    context = (cert_loc, key_loc)
    try:
        app.run(host="0.0.0.0", port=8000)
        #app.run(ssl_context=context)
    except:
        app.run(t=8000)
