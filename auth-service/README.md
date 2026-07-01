### Funzioni del microservizio

- firma JWT con private key RSA
- espone public key via /.well-known/jwks.json
- genera token con sub = userId
- inserisce email e roles nei claim
- valida localmente con Resource Server quando serve