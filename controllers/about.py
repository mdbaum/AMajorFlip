from config import *
from flask import *

about = Blueprint('about', __name__, template_folder='templates')

@about.route('/about')
def about_route():
	return render_template('about.html')