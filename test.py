import os
from PIL import Image
import numpy
from math import trunc
def splitimage(src, rowrate, dstpath):
    img = Image.open(src)
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
    img = Image.open(src)
    grayImg = img.convert('L')
    matrix = numpy.asarray(grayImg)
    h,w = matrix.shape
    whiteSum = 0
    ratio=[0]
    for i in range(h):
        for j in range(w):
            if(matrix[i,j]==255):
                whiteSum+=1
        if (whiteSum==w):
            ratioFound = (i+0.0)/h
            if(ratioFound<0.1):
                continue
            if(ratioFound<ratio[len(ratio)-1]+0.1):
                continue
            ratio.append(ratioFound)
        whiteSum=0
    ratio.append(1)
    return ratio

src = '0.png'
if os.path.isfile(src):
    dstpath = ''
    if (dstpath == '') or os.path.exists(dstpath):
	rowlist = analyzeSheetMusic(src)
        splitimage(src, rowlist, dstpath)
else:
    print('notexist')
