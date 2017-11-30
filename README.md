# AMajorFlip

## Prerequisite

### MongoDB

- To start A Major Flip, first install mongodb. Below is a simple tutorial for Mac OS
```
brew update
brew install mongodb
sudo mkdir -p /data/db
mongod
```
`mongod` will run in the background.
Open another terminal and test if the `mongo` command is valid.

### Virtualenv
- Then install `virtualenv`.
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
### ImageMagick
- For ubuntu users: 
```
sudo apt-get install imagemagick
```
- For Mac users, it might be a little weird because imagemagick 7 seems not well supported, so we change to imagemagick@6: 
```
brew update && brew install imagemagick
brew install imagemagick@6
export MAGICK_HOME=/usr/local/opt/imagemagick@6
```
See https://stackoverflow.com/questions/7053996/how-do-i-install-imagemagick-with-homebrew for detail.

## Run our project
- You can run A Major Flip using this command
```
python app.py
```
And then navigate in a browser to `localhost:3000`.

### Upload sheetmusic
- You can upload your own sheet music using the upload function. After uploading it, your sheetmusic will appear in the gallery.

### Delete sheetmusic
- You can easily delete the unused sheetmusic by clicking the delete button next to the sheetmusic.


- Contact mdbaum@umich.edu with any questions 

