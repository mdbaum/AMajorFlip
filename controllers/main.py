from config import *
from flask import *
from database import database

main = Blueprint('main', __name__, template_folder='templates')

@main.route('/')
def main_route():
	options = {}
	username = 'admin'
	options['sheetmusics'] = database.get_sheetmusics(username)
	options['pictures'] = database.get_images(username)
	return render_template('main.html', **options)