from config import *
from utility import check_image_extension
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode
import PythonMagick
import pyPdf
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
				filename = str(upload.filename		)
				upload.save('./'+filename)
				if filename == '':
					raise RuntimeError('Empty file is not allowed')
				sheetid = request.form['label1']
				upload.close()
				pdf_im = pyPdf.PdfFileReader(file(filename,"rb"))
				npage = pdf_im.getNumPages()
				for p in range(npage):
					im = PythonMagick.Image(filename+'[' + str(p) + ']')
					im.write('file_out-' + str(p)+'.png')
					image_data = file('file_out-' + str(p)+'.png').read()
					image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
					database.add_sheetmusic(username, sheetid)
					database.add_image(username, image_data, sheetid, p, image_id)
					os.remove('file_out-' + str(p)+'.png')
				os.remove(filename)
				'''
				upload = request.files['file']
				if upload.filename == '':
					raise RuntimeError('Empty file is not allowed')
				sheetid = request.form['label1']
				page = request.form['label2']
				check_image_extension(upload)
				image_data = upload.read()
				image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
				upload.close()
				print 'here'
				database.add_sheetmusic(username, sheetid)
				database.add_image(username, image_data, sheetid, page, image_id)
			'''
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
		options['sheetmusics'] = database.get_sheetmusics(username);
		options['pictures'] = database.get_images(username)
		return render_template('script.html', **options)
	except Exception as e:
		print str(e)

