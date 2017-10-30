import PythonMagick
import pyPdf
filename = 'sheetmusic.pdf'
print file(filename).name
pdf_im = pyPdf.PdfFileReader(file(filename,"rb"))
npage = pdf_im.getNumPages()
for p in range(npage):
	im = PythonMagick.Image(filename+'[' + str(p) + ']')
	im.write('file_out-' + str(p)+'.png')
