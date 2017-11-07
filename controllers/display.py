from config import *
from utility import check_image_extension
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode

display = Blueprint('display', __name__, template_folder='templates')

@display.route('/display', methods = ['GET', 'POST'])
def display_route():
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
				print 'halo'
				#print image_id
		elif request.method == 'GET':
			pass
		cur_picid = request.args.get('picid')
		pictures_list = database.get_images(username)
		cursheet = ''
		for pictures in pictures_list:
			if pictures['image_id'] == cur_picid:
				cursheet = pictures['sheetmusic']
				break
		curlist = []
		for pictures in pictures_list:
			if pictures['sheetmusic'] == cursheet:
				curlist.append(pictures)
		newlist = sorted(curlist, key=lambda k: k['page']) 
		options['pictures'] = newlist
		options['picid'] = cur_picid
		totalpage = len(newlist)
		for i in range(totalpage):
			if newlist[i]['image_id'] == cur_picid:
				if newlist[i]['page'] != 0:
					options['before'] = newlist[i-1]['image_id']
				if newlist[i]['page'] != totalpage-1:
					options['next'] = newlist[i+1]['image_id']
		print options['picid']
		return render_template('display.html', **options)
	except Exception as e:
		return str(e)

