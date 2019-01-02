
## Encrypt Secret 
```
aws kms encrypt \
--key-id 1e7c0a3b-4183-4e22-8364-1532e0741b75 \
--plaintext "" \
--output text \
--query CiphertextBlob | base64 --decode > resources/JwtSecret.txt
```