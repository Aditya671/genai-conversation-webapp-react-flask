from flask import Flask
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_caching import Cache
from flask_talisman import Talisman
from flask_restx import Api
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies
)
from datetime import timedelta
from os import getenv
load_dotenv()
from config import constants
from config.cache_config import cache_config

app = Flask(__name__)


cors = CORS(app=app, supports_credentials=True, \
    resources={\
        r"/api/*": {
        "origins": constants.allowed_origins,
        "methods": constants.allowed_methods,
        "allow_headers": ["Content-Type", "Authorization"],
        'max_age': constants.allowed_max_age
    } }
)

# Configure Flask-Limiter
limiter = Limiter(
    app=app,
    key_func=lambda: getenv("LIMITER_KEY"),  # Example key function (customize as needed)
    default_limits=["200 per hour", "50 per minute"],  # Example default limits
    storage_uri="memory://",  # Specify the storage backend (e.g., Redis or in-memory)
    headers_enabled=True,  # Add headers to responses to indicate rate-limiting status
    strategy="fixed-window",  # Rate-limiting strategy (e.g., "fixed-window", "moving-window")
    in_memory_fallback_enabled=True  # Fallback to in-memory storage if primary backend fails
)

# Configure Flask-Caching

cache = Cache(
    app=app,
    config=cache_config
)

# Configure Flask-Talisman
talisman = Talisman(
    app,
    content_security_policy={
        "default-src": "'self'",
        "script-src": "'self' 'unsafe-inline'",
        "img-src": "'self' data:",
        "style-src": "'self' 'unsafe-inline'",
    },
    content_security_policy_report_uri="/csp-violation",  # Optional reporting endpoint
    frame_options="DENY",  # Control the use of iframes
    force_https=True,  # Redirect HTTP to HTTPS
    strict_transport_security=True,  # Enable HSTS
    strict_transport_security_max_age=31536000,  # HSTS max age in seconds
    session_cookie_secure=True,  # Secure cookies
    referrer_policy="strict-origin-when-cross-origin"  # Referrer policy
)
# Step 1: JWT Configuration Settings
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Replace with a secure key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)  # Access token expiry
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)  # Refresh token expiry
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]  # Where tokens are stored
app.config["JWT_COOKIE_SECURE"] = True  # Use secure cookies in production
app.config["JWT_COOKIE_CSRF_PROTECT"] = True  # Enable CSRF protection for cookies
app.config["JWT_CSRF_IN_COOKIES"] = True  # Store CSRF tokens in cookies

# Step 2: Initialize JWTManager
jwt = JWTManager(app)
# Configure Flask-RESTx API
api = Api(app, version="1.0", title="My API", description="A fully configured API")

# Example of adding a namespace
from flask_restx import Resource, Namespace

example_ns = Namespace("example", description="Example operations")

@api.route("/example")
class ExampleResource(Resource):
    def get(self):
        return {"message": "Example GET endpoint"}

api.add_namespace(example_ns, path="/api/example")

@app.route('/')
def hello():
    return "Hello, World!"
# Create login endpoint
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    # Validate username & password (replace with your auth logic)
    if username == "test" and password == "test123":
        # Create tokens
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        response = jsonify({"login": True})
        # Set tokens in cookies
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response
    return jsonify({"login": False}), 401

# Refresh endpoint
@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Protect this route with refresh token
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = jsonify({"refresh": True})
    set_access_cookies(response, access_token)
    return response

# Protected endpoint
@app.route("/protected", methods=["GET"])
@jwt_required()  # Protect this route with access token
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)

# Logout endpoint
@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"logout": True})
    # Unset cookies
    response.delete_cookie("access_token_cookie")
    response.delete_cookie("refresh_token_cookie")
    return response

if __name__ == '__main__':
    app.run(debug=constants.application_debug_state)
