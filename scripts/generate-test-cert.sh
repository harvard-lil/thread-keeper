# [TESTS ONLY] Generates a local key pair that can be used for signing PDFs. 
# Will be saved under ../fixtures/certs.
openssl req -x509 -newkey rsa:4096 -keyout ../fixtures/certs/key.pem -out ../fixtures/certs/cert.pem -days 3650 -nodes -subj /CN="thread-keeper TESTS ONLY KEY";