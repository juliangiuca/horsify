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
docker run -it -p 80:3000 juliangiuca/horsify
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
The MIT License (MIT)

Copyright (c) 2015 Julian Giuca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
