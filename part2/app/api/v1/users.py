#!/usr/bin/env python3
"""User endpoints: /api/v1/users/"""

from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace("users", description="User operations")

user_model = api.model("User", {
    "first_name": fields.String(required=True, description="First name of the user"),
    "last_name": fields.String(required=True, description="Last name of the user"),
    "email": fields.String(required=True, description="Email of the user"),
    "password": fields.String(required=False, description="Password of the user"),
})


def user_to_dict(user):
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    }


@api.route("/")
class UserList(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, "User successfully created")
    @api.response(400, "Email already registered or invalid input data")
    def post(self):
        """Register a new user"""
        data = api.payload
        try:
            user = facade.create_user(data)
        except ValueError as e:
            return {"error": str(e)}, 400
        return user_to_dict(user), 201

    @api.response(200, "List of users retrieved successfully")
    def get(self):
        """Retrieve the list of all users"""
        users = facade.get_all_users()
        return [user_to_dict(u) for u in users], 200


@api.route("/<string:user_id>")
class UserResource(Resource):
    @api.response(200, "User details retrieved successfully")
    @api.response(404, "User not found")
    def get(self, user_id):
        """Get user details by ID"""
        user = facade.get_user(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return user_to_dict(user), 200

    @api.expect(user_model, validate=True)
    @api.response(200, "User updated successfully")
    @api.response(404, "User not found")
    @api.response(400, "Invalid input data")
    def put(self, user_id):
        """Update a user's information"""
        try:
            user = facade.update_user(user_id, api.payload)
        except ValueError as e:
            return {"error": str(e)}, 400
        if not user:
            return {"error": "User not found"}, 404
        return user_to_dict(user), 200
