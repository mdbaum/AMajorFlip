import flask
import pymongo
import bson.binary
from cStringIO import StringIO
app = flask.Flask(__name__)
app.debug = True
db = pymongo.MongoClient('localhost', 27017).test
def save_file(f):
  content = StringIO(f.read())
  c = dict(content=bson.binary.Binary(content.getvalue()))
  db.files.save(c)
  return c['_id']

@app.route('/f/<fid>')
def serve_file(fid):
  f = db.files.find_one(bson.objectid.ObjectId(fid))
  return f['content']

@app.route('/upload', methods=['POST'])
def upload():
  f = flask.request.files['uploaded_file']
  fid = save_file(f)
  return flask.redirect( '/f/' + str(fid))

@app.route('/')
def index():
  return '''
  <!doctype html>
  <html>
  <body>
  <form action='/upload' method='post' enctype='multipart/form-data'>
     <input type='file' name='uploaded_file'>
     <input type='submit' value='Upload'>
  </form>
  '''
if __name__ == '__main__':
  app.run(port=7777)


