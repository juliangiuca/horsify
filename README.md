# Horse as a service

### What is it?
Horse as a service. This app runs Open CV's Haar Cascades face detection, and puts a horses mask over their face.

This app is meant entirely as a joke. If you do no find it funny, please fork and delete the repo.

### Dependencies
You can either run this app manually, or using docker.

Docker:
* [Docker](https://www.docker.com/)

Or, manually install dependencies:
* [Open CV](http://opencv.org/)
* [Imagemagick](http://www.imagemagick.org/)  


### Install: Docker
```
docker run -p 80:3000 juliangiuca/horsify
```

### Install: Without Docker
```
npm install
```  

#### Running
```
npm start
```
Alternatively `iojs server.js` or `node server.js` will work too.


### License
MIT license
