# AMajorFlip

## Prerequisite

### MongoDB

- To start our project, first install mongodb. Here is a simple tutorial for Mac OS
```
brew update
brew install mongodb
sudo mkdir -p /data/db
mongod
```
Then close that terminal. It seems that `mongod` will always run on background.
Now open another terminal to test if `mongo` command is valid.

### Virtualenv
- Then install `virtualenv`. Here is the code that works for me. Perhaps `pip2` is already installed on your machine
```
sudo brew install python
```
```
sudo pip2 install virtualenv
```
Then create a new virtual environment directory
```
virtualenv venv
```
Then active `virtualenv`
```
. venv/bin/activate
```
After activation, install requirements.
```
sudo pip install -r requirements.txt
```

## Run our project
- You can run our project using thie command
```
python app.py
```
And then go to `localhost:3000`. You can see the UI. 

### Upload sheetmusic
- You can upload your own sheet music using the upload function. After uploading it, you can see your sheetmusic in the gallery.

### Delete sheetmusic
- You can easily delete the unused sheetmusic by clicking the delete button next to the sheetmusic.


- Inform me if any steps stucks or get errors.

