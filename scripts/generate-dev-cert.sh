# [DEV ONLY] Generates a local key pair that can be used for signing PDFs. 
# Will be saved under ../app/certs.
openssl req -x509 -newkey rsa:4096 -keyout ../certs/key.pem -out ../certs/cert.pem -days 3650 -nodes -subj /CN="archive.social DEV";