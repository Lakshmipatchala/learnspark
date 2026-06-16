import base64, json, hmac, hashlib

secret = "gzySOxaAwqVtJnMrUY3dBZVLNwzp8Fi0keDpToWxjikT8qFY6uS5J3vjO4pBroezEfI9gBKuUVVVmxVEjWLM5g=="

header = base64.urlsafe_b64encode(json.dumps({"alg":"HS256","typ":"JWT"}).encode()).rstrip(b"=").decode()
payload = base64.urlsafe_b64encode(json.dumps({"role":"anon","iss":"supabase","iat":1700000000,"exp":1900000000}).encode()).rstrip(b"=").decode()
msg = f"{header}.{payload}".encode()
sig = hmac.new(secret.encode(), msg, hashlib.sha256).digest()
sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b"=").decode()
print(f"{header}.{payload}.{sig_b64}")