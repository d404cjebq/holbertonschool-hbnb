"""Amenity endpoints: /api/v1/amenities/"""
from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('amenities', description='Amenity operations')

amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity'),
    'description': fields.String(required=False, description='Description of the amenity')
})


def serialize_amenity(amenity):
    """Return amenity data"""
    return {
        'id': amenity.id,
        'name': amenity.name,
        'description': amenity.description
    }


@api.route('/')
class AmenityList(Resource):
    @api.expect(amenity_model, validate=True)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new amenity"""
        amenity_data = api.payload

        try:
            new_amenity = facade.create_amenity(amenity_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return serialize_amenity(new_amenity), 201

    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Get the list of all amenities"""
        amenities = facade.get_all_amenities()
        return [serialize_amenity(amenity) for amenity in amenities], 200


@api.route('/<amenity_id>')
class AmenityResource(Resource):
    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        """Get amenity details by ID"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {'error': 'Amenity not found'}, 404
        return serialize_amenity(amenity), 200

    @api.expect(amenity_model, validate=True)
    @api.response(200, 'Amenity successfully updated')
    @api.response(404, 'Amenity not found')
    @api.response(400, 'Invalid input data')
    def put(self, amenity_id):
        """Update amenity information"""
        amenity_data = api.payload

        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {'error': 'Amenity not found'}, 404

        try:
            updated_amenity = facade.update_amenity(amenity_id, amenity_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return serialize_amenity(updated_amenity), 200
