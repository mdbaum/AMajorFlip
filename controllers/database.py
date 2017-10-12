import hashlib, uuid
from pymongo import MongoClient
from base64 import b64encode
import os

class Database(object):

	# Constructor.
	def __init__(self):
		self.db = MongoClient().amajorflip

	# Returns the image collection of the user.
	def get_image_collection(self, username):
		images_collection = 'images_' + username
		return self.db[images_collection]

	# Adds the uploaded image.
	def add_image(self, username, image_data, label, image_id):
		self.get_image_collection(username).insert_one({'label': label, 'data': b64encode(image_data),'image_id': image_id})

	# Returns all the images by username.
	def get_images(self, username):
		print 'Loading images from user ' + username
		return [image for image in self.get_image_collection(username).find({}, { '_id': 0 })]

	# Deletes the specified image.
	def delete_image(self, username, image_id):
		self.get_image_collection(username).remove({'image_id': image_id})

database = Database()