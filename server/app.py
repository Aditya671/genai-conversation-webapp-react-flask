from flask import Flask
from dotenv import loadenv
from flask_limiter import Limiter
from flask_caching import Cache
from flask_talisman import Talisman
from flask_restx import Api
from flask_cors import CORS
from os import getenv
app = Flask(__name__)

loadenv()
from server.config import constants
cors = CORS(app=app, supports_credentials=True, \
    resources={\
        r"/api/*": {
        "origins": constants.origin,
        "methods": constants.allowed_methods,
        "allow_headers": ["Content-Type", "Authorization"],
        'max_age': constants.allowed_max_age
    } }
)

@app.route('/')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=constants.application_debug_state)
