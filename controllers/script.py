from config import *
from utility import check_image_extension
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode
#coding:utf-8
from wand.image import Image
import os

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
				filename = str(upload.filename)
				upload.save('./'+filename)
				if filename == '':
					raise RuntimeError('Empty file is not allowed')
				sheetid = request.form['label1']
				upload.close()
				if database.check_sheetmusic(username, sheetid)>0:
					raise RuntimeError('Duplicate sheetmusic uploaded')				
				image_pdf = Image(filename=filename,resolution=300)
				image_jpeg = image_pdf.convert('jpg')
				req_image = []
				for img in image_jpeg.sequence:
					img_page = Image(image=img)
					req_image.append(img_page.make_blob('jpg'))
				i = 0
				database.add_sheetmusic(username, sheetid)
				for img in req_image:
					ff = open(str(i)+'.jpg','wb')
					ff.write(img)
					ff.close()
					image_data = file(str(i)+'.jpg').read()
					image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
					database.add_image(username, image_data, sheetid, i, image_id)
					os.remove(str(i)+'.jpg')
					i += 1
				os.remove(filename)
			elif request.form['op'] == 'delete_image':
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
		return render_template('script.html', **options)
	except Exception as e:
		print str(e)
		options['sheetmusics'] = database.get_sheetmusics(username);
		options['pictures'] = database.get_images(username)
		return render_template('script.html', **options)
