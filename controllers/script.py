from config import *
from utility import check_image_extension
from flask import *

script = Blueprint('script', __name__, template_folder='templates')

@script.route('/script')
def script_route():
	options = {}
	if 'file' in request.files:
		upload = request.files[files]
	if request.method == 'POST':
		if upload.filename != '':
			check_image_extension(upload)
	return render_template('script.html')

'''
store the upload image
'''