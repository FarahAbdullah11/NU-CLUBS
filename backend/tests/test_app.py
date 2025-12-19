# backend/tests/test_app.py

# Test 1: Can we import the app without errors?
def test_imports():
    import app
    import models
    assert app is not None
    assert models is not None