GapiClientSecret=$(aws kms decrypt --ciphertext-blob fileb://resources/GapiClientSecret.txt --output text --query Plaintext | base64 --decode) \
JwtSecret=$(aws kms decrypt --ciphertext-blob fileb://resources/JwtSecret.txt --output text --query Plaintext | base64 --decode) \
sam local start-api --port=3001 --env-vars sam-local-env.json --template api.template.yml