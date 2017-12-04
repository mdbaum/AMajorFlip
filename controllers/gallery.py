from config import *
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode
#coding:utf-8
from wand.image import Image

gallery = Blueprint('gallery', __name__, template_folder='templates')

@gallery.route('/gallery', methods = ['GET', 'POST'])
def gallery_route():
	options = {}
	username = 'admin'
	try:
		if request.method == 'POST':
			if 'op' not in request.form:
				raise RuntimeError('Did you click the button?')
			# if op is add image

			if request.form['op'] == 'delete_image':
				sheetmusic = request.form['sheetmusic']
				# Delete the image from the database.
				database.delete_image(username, sheetmusic)
			elif request.form['op'] == 'open_image':
				# image_id = request.form['image_id']
				print ('halo')
				#print image_id
		elif request.method == 'GET':
			pass
		options['sheetmusics'] = database.get_sheetmusics(username);
		options['pictures'] = database.get_images(username)
		return render_template('gallery.html', **options)
	except Exception as e:
		print str(e)
		options['sheetmusics'] = database.get_sheetmusics(username);
		options['pictures'] = database.get_images(username)
		return render_template('gallery.html', **options)
