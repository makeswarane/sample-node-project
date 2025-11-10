from flask import Flask, Response
from prometheus_client import Counter, generate_latest, REGISTRY

app = Flask(__name__)

REQUEST_COUNT = Counter('request_count', 'Total HTTP requests')

@app.route('/')
def home():
    REQUEST_COUNT.inc()
    return "Hello from sample app!"

@app.route('/metrics')
def metrics():
    return Response(generate_latest(REGISTRY), mimetype='text/plain')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
