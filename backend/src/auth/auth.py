
# Configure JWTManager
# class Settings(BaseModel):
#     authjwt_secret_key: str = "your-secret-key"

# @AuthJWT.load_config
# def get_config():
#     return Settings()

# # Example Model
# class User(BaseModel):
#     username: str
#     password: str

# @app.post('/login')
# def login(user: User, Authorize: AuthJWT = Depends()):
#     # Validate username & password (replace with your auth logic)
#     if user.username == "test" and user.password == "test123":
#         # Create tokens
#         access_token = Authorize.create_access_token(subject=user.username)
#         refresh_token = Authorize.create_refresh_token(subject=user.username)
#         Authorize.set_access_cookies(access_token)
#         Authorize.set_refresh_cookies(refresh_token)
#         return {"login": True}
#     raise HTTPException(status_code=401, detail="Invalid username or password")

# @app.post('/refresh')
# def refresh(Authorize: AuthJWT = Depends()):
#     Authorize.jwt_refresh_token_required()
#     current_user = Authorize.get_jwt_subject()
#     new_access_token = Authorize.create_access_token(subject=current_user)
#     Authorize.set_access_cookies(new_access_token)
#     return {"refresh": True}

# @app.get('/protected')
# def protected(Authorize: AuthJWT = Depends()):
#     Authorize.jwt_required()
#     current_user = Authorize.get_jwt_subject()
#     return {"logged_in_as": current_user}

# @app.post('/logout')
# def logout(Authorize: AuthJWT = Depends()):
#     Authorize.unset_jwt_cookies()
#     return {"logout": True}