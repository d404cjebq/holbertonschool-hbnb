"""User endpoints: /api/v1/users/"""
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade

api = Namespace('users', description='User operations')

user_model = api.model('User', {
    'first_name': fields.String(required=True, description='First name of the user'),
    'last_name': fields.String(required=True, description='Last name of the user'),
    'email': fields.String(required=True, description='Email of the user'),
    'password': fields.String(required=True, description='Password of the user')
})

update_model = api.model('UserUpdate', {
    'first_name': fields.String(description='First name of the user'),
    'last_name': fields.String(description='Last name of the user'),
    'email': fields.String(description='Email of the user'),
    'password': fields.String(description='Password of the user')
})


def serialize_user(user):
    """Return user data without the password"""
    return {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_active': user.is_active
    }


@api.route('/')
class UserList(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new user (public endpoint)"""
        user_data = api.payload
        existing_user = facade.get_user_by_email(user_data['email'])
        if existing_user:
            return {'error': 'Email already registered'}, 400
        try:
            new_user = facade.create_user(user_data)
        except ValueError as e:
            return {'error': str(e)}, 400
        return {'id': new_user.id, 'message': 'User successfully created'}, 201

    @api.response(200, 'List of users retrieved successfully')
    def get(self):
        """Get the list of all users (public endpoint)"""
        users = facade.get_all_users()
        return [serialize_user(user) for user in users], 200


@api.route('/<user_id>')
class UserResource(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user details by ID (public endpoint)"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return serialize_user(user), 200

    @jwt_required()
    @api.expect(update_model)
    @api.response(200, 'User successfully updated')
    @api.response(403, 'Unauthorized action')
    @api.response(400, 'You cannot modify email or password')
    @api.response(400, 'Email already registered')
    @api.response(404, 'User not found')
    def put(self, user_id):
        """Update user information (admin can update anyone; users can update themselves excluding email/password)"""
        current_user = get_jwt_identity()
        claims = get_jwt()
        is_admin = claims.get('is_admin', False)

        if not is_admin and user_id != current_user:
            return {'error': 'Unauthorized action'}, 403

        user_data = api.payload

        if not is_admin and ('email' in user_data or 'password' in user_data):
            return {'error': 'You cannot modify email or password'}, 400

        if 'email' in user_data:
            existing_user = facade.get_user_by_email(user_data['email'])
            if existing_user and existing_user.id != user_id:
                return {'error': 'Email already registered'}, 400

        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        try:
            updated_user = facade.update_user(user_id, user_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return serialize_user(updated_user), 200