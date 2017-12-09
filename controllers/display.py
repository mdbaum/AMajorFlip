from config import *
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode

display = Blueprint('display', __name__, template_folder='templates')

@display.route('/display', methods = ['GET'])
def display_route():
	options = {}
	username = 'admin'
	try:
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
				if newlist[i]['page'] > 1:
					options['before'] = newlist[i-1]['image_id']
				if newlist[i]['page'] != totalpage-1:
					options['next'] = newlist[i+1]['image_id']
		print options['picid']
		return render_template('display.html', **options)
	except Exception as e:
		return str(e)

