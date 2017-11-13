import hashlib, uuid
from pymongo import MongoClient
import pymongo
from base64 import b64encode
import os

class Database(object):

	# Constructor.
	def __init__(self):
		self.db = MongoClient().amajorflip

	def get_sheetmusic_collection(self, username):
		sheetmusic_collection = 'sheetmusic_'+username
		return self.db[sheetmusic_collection]

	# Returns the image collection of the user.
	def get_image_collection(self, username):
		images_collection = 'images_' + username
		return self.db[images_collection]

	def get_sheetmusics(self,username):
		print 'Loading sheetmusics from user ' + username
		return [sheetmusic for sheetmusic in self.get_sheetmusic_collection(username).find({}, { '_id': 0 })]

	def check_sheetmusic(self, username, sheetmusic):
		return self.get_sheetmusic_collection(username).find({'name':sheetmusic}).count()
	
	def add_sheetmusic(self, username, sheetmusic):
		print self.check_sheetmusic(username, sheetmusic) 
		if (self.check_sheetmusic(username, sheetmusic) == 0):
			print 'sheetmusic added:' + sheetmusic
			self.get_sheetmusic_collection(username).insert_one({'name': sheetmusic})

	# Adds the uploaded image.
	def add_image(self, username, image_data, sheetmusic, page, image_id):
		self.get_image_collection(username).insert_one({'data': b64encode(image_data),'sheetmusic': sheetmusic,'page': page,'image_id': image_id})

	# Returns all the images by username.
	def get_images(self, username):
		print 'Loading images from user ' + username
		return [image for image in self.get_image_collection(username).find({}, { '_id': 0 })]

	# Deletes the specified image.
	def delete_image(self, username, sheetmusic):
		self.get_image_collection(username).remove({'sheetmusic': sheetmusic})
		self.get_sheetmusic_collection(username).remove({'name':sheetmusic})

database = Database()
