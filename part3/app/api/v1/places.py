"""Place endpoints: /api/v1/places/"""
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade

api = Namespace('places', description='Place operations')

place_model = api.model('Place', {
    'title': fields.String(required=True, description='Title of the place'),
    'description': fields.String(description='Description of the place'),
    'price': fields.Float(required=True, description='Price per night'),
    'latitude': fields.Float(required=True, description='Latitude of the place'),
    'longitude': fields.Float(required=True, description='Longitude of the place'),
    'amenities': fields.List(fields.String, description="List of amenity IDs"),
    'image_url': fields.String(description='URL of the place image')
})


def serialize_place_full(place):
    owner_data = None
    if place.user:
        owner_data = {
            'id': place.user.id,
            'first_name': place.user.first_name,
            'last_name': place.user.last_name,
            'email': place.user.email
        }

    return {
        'id': place.id,
        'title': place.title,
        'description': place.description,
        'price': place.price,
        'latitude': place.latitude,
        'longitude': place.longitude,
        'image_url': place.image_url,
        'owner': owner_data,
        'amenities': [{'id': a.id, 'name': a.name} for a in place.amenities],
        'reviews': [
            {
                'id': r.id,
                'text': r.text,
                'rating': r.rating
            }
            for r in place.reviews
        ]
    }


def serialize_place_summary(place):
    return {
        'id': place.id,
        'title': place.title,
        'price': place.price,
        'latitude': place.latitude,
        'longitude': place.longitude,
        'image_url': place.image_url
    }


@api.route('/')
class PlaceList(Resource):
    @jwt_required()
    @api.expect(place_model)
    @api.response(201, 'Place successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Create a new place (authenticated users only)"""
        current_user = get_jwt_identity()
        place_data = api.payload
        place_data['user_id'] = current_user

        try:
            new_place = facade.create_place(place_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return serialize_place_summary(new_place), 201

    @api.response(200, 'List of places retrieved successfully')
    def get(self):
        """Retrieve a list of all places (public endpoint)"""
        places = facade.get_all_places()
        return [serialize_place_summary(place) for place in places], 200


@api.route('/<place_id>')
class PlaceResource(Resource):
    @api.response(200, 'Place details retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Get place details by ID (public endpoint)"""
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404
        return serialize_place_full(place), 200

    @jwt_required()
    @api.expect(place_model)
    @api.response(200, 'Place updated successfully')
    @api.response(403, 'Unauthorized action')
    @api.response(404, 'Place not found')
    def put(self, place_id):
        """Update a place's information (owner or admin)"""
        current_user = get_jwt_identity()
        claims = get_jwt()
        place_data = api.payload

        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        if not claims.get('is_admin') and place.user_id != current_user:
            return {'error': 'Unauthorized action'}, 403

        try:
            facade.update_place(place_id, place_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return {'message': 'Place updated successfully'}, 200

    @jwt_required()
    @api.response(200, 'Place deleted successfully')
    @api.response(403, 'Unauthorized action')
    @api.response(404, 'Place not found')
    def delete(self, place_id):
        """Delete a place (owner or admin)"""
        current_user = get_jwt_identity()
        claims = get_jwt()

        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        if not claims.get('is_admin') and place.user_id != current_user:
            return {'error': 'Unauthorized action'}, 403

        facade.place_repo.delete(place_id)
        return {'message': 'Place deleted successfully'}, 200


@api.route('/<place_id>/reviews')
class PlaceReviewList(Resource):
    @api.response(200, 'List of reviews for the place retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Get all reviews for a specific place (public endpoint)"""
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        return [
            {
                'id': r.id,
                'text': r.text,
                'rating': r.rating
            }
            for r in place.reviews
        ], 200
