from config import *
from utility import check_image_extension
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode

script = Blueprint('script', __name__, template_folder='templates')

@script.route('/script', methods = ['GET', 'POST'])
def script_route():
	options = {}
	username = 'admin'
	try:
		if request.method == 'POST':
			if 'op' not in request.form:
				raise RuntimeError('Did you click the button?')
			# if op is add image
			if request.form['op'] == 'add_image':
				upload = request.files['file']
				if upload.filename == '':
					raise RuntimeError('Empty file is not allowed')
				label = request.form['label']
				check_image_extension(upload)
				image_data = upload.read()
				image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
				upload.close()
				database.add_image(username, image_data, label, image_id)
			elif request.form['op'] == 'delete_image':
				image_id = request.form['image_id']
				# Delete the image from the database.
				database.delete_image(username, image_id)
			elif request.form['op'] == 'open_image':
				# image_id = request.form['image_id']
				print ('halo')
				#print image_id
		elif request.method == 'GET':
			pass
		options['pictures'] = database.get_images(username)
		return render_template('script.html', **options)
	except Exception as e:
		return str(e)

