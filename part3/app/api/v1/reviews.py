"""Review endpoints: /api/v1/reviews/"""
from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('reviews', description='Review operations')

review_model = api.model('Review', {
    'text': fields.String(required=True, description='Text of the review'),
    'rating': fields.Integer(required=True, description='Rating of the place (1-5)'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'place_id': fields.String(required=True, description='ID of the place')
})


def serialize_review_full(review):
    """Full review data (used for POST, GET by ID)"""
    return {
        'id': review.id,
        'text': review.comment,
        'rating': review.rating,
        'user_id': review.user_id,
        'place_id': review.place_id
    }


def serialize_review_summary(review):
    """Short review data (used for GET list)"""
    return {
        'id': review.id,
        'text': review.comment,
        'rating': review.rating
    }


@api.route('/')
class ReviewList(Resource):
    @api.expect(review_model)
    @api.response(201, 'Review successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new review"""
        review_data = api.payload

        try:
            new_review = facade.create_review(review_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return serialize_review_full(new_review), 201

    @api.response(200, 'List of reviews retrieved successfully')
    def get(self):
        """Retrieve a list of all reviews"""
        reviews = facade.get_all_reviews()
        return [serialize_review_summary(review) for review in reviews], 200


@api.route('/<review_id>')
class ReviewResource(Resource):
    @api.response(200, 'Review details retrieved successfully')
    @api.response(404, 'Review not found')
    def get(self, review_id):
        """Get review details by ID"""
        review = facade.get_review(review_id)
        if not review:
            return {'error': 'Review not found'}, 404
        return serialize_review_full(review), 200

    @api.expect(review_model)
    @api.response(200, 'Review updated successfully')
    @api.response(404, 'Review not found')
    @api.response(400, 'Invalid input data')
    def put(self, review_id):
        """Update a review's information"""
        review_data = api.payload

        review = facade.get_review(review_id)
        if not review:
            return {'error': 'Review not found'}, 404

        try:
            facade.update_review(review_id, review_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return {'message': 'Review updated successfully'}, 200

    @api.response(200, 'Review deleted successfully')
    @api.response(404, 'Review not found')
    def delete(self, review_id):
        """Delete a review"""
        success = facade.delete_review(review_id)
        if not success:
            return {'error': 'Review not found'}, 404

        return {'message': 'Review deleted successfully'}, 200