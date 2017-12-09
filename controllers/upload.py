from config import *
from flask import *
from database import database
import hashlib, datetime
from base64 import b64encode
#coding:utf-8
from wand.image import Image
import os
from PIL import Image as PILImage
import numpy
from math import trunc
def splitimage(src, rowrate, dstpath):
    img = PILImage.open(src)
    w, h = img.size
 
    print('Original image info: %sx%s, %s, %s' % (w, h, img.format, img.mode))
    s = os.path.split(src)
    if dstpath == '':
        dstpath = s[0]
    fn = s[1].split('.')
    basename = fn[0]
    ext = fn[-1]
    num = 0
    #rowheight = h // rownum
    colwidth = w
    for i in range(len(rowrate)-1):
            box = (0, rowrate[i] * h, colwidth, rowrate[i + 1] * h)
            img.crop(box).save(os.path.join(dstpath, basename + '_' + str(num) + '.' + ext), ext)
            num = num + 1

def analyzeSheetMusic(src):
    img = PILImage.open(src)
    grayImg = img.convert('L')
    matrix = numpy.asarray(grayImg)
    h,w = matrix.shape
    whiteSum = 0
    ratio=[0]
    print("size")
    print (matrix.size)
    for i in range(h):
        for j in range(w):
            if(matrix[i,j]>200):
                whiteSum+=1
        if (whiteSum==w):
            ratioFound = (i+0.0)/h
            if(ratioFound<0.2 or ratioFound>0.8):
                continue
            if(ratioFound<ratio[len(ratio)-1]+0.1):
                continue
            ratio.append(ratioFound)
        whiteSum=0
    ratio.append(1)
    if (len(ratio)>4):
        newratio = []
	i = 0
	while(i<len(ratio)):
	    newratio.append(ratio[i])
	    i = i +2
        newratio.append(1)
        return newratio
    return ratio


upload = Blueprint('upload', __name__, template_folder='templates')

@upload.route('/upload', methods = ['GET', 'POST'])
def upload_route():
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
				image_jpeg = image_pdf.convert('png')
				req_image = []
				for img in image_jpeg.sequence:
					img_page = Image(image=img)
					req_image.append(img_page.make_blob('png'))
				i = 1
				database.add_sheetmusic(username, sheetid)
				isCoverPage = 1
				for img in req_image:
					ff = open(str(i)+'.png','wb')
					ff.write(img)
					ff.close()
					image_data = file(str(i) + '.png').read()
					image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
					if(isCoverPage==1):
						database.add_image(username, image_data, sheetid, 0, image_id);
						isCoverPage = 0;
					src = str(i)+'.png'
					rowlist = analyzeSheetMusic(src)
					splitimage(src, rowlist, '')
					j = 0
					for imgi in range(len(rowlist)-1):
						image_data = file(str(i) + '_' + str(imgi) + '.png').read()
						image_id = hashlib.md5(username+str(datetime.datetime.now())).hexdigest()
						database.add_image(username, image_data, sheetid, i+j, image_id)
						j+=1
						os.remove(str(i) + '_' + str(imgi) + '.png')
					os.remove(str(i)+'.png')
					i = i+j
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
		return render_template('upload.html', **options)
	except Exception as e:
		print str(e)
		options['sheetmusics'] = database.get_sheetmusics(username);
		options['pictures'] = database.get_images(username)
		return render_template('upload.html', **options)
