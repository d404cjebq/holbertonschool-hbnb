from app.models.user import User


def test_user_creation():
    user = User(first_name="John", last_name="Doe",
                email="john.doe@example.com", password="secret123")
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.is_admin is False
    assert user.is_active is True
    assert user.authenticate("secret123") is True
    assert user.authenticate("wrongpass") is False
    print("User creation test passed!")


def test_user_deactivate():
    user = User(first_name="Jane", last_name="Doe", email="jane.doe@example.com")
    user.deactivate()
    assert user.is_active is False
    print("User deactivate test passed!")


test_user_creation()
test_user_deactivate()