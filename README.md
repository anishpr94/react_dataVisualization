Steps to install

In DataVisualization Directory

npm install
npm start

then
cd server

pip install -r requirements.txt
python server.py

In case of issue pip install --upgrade --force-reinstall pymongo


Mongo.py is used to add the data to the database
Server.py is where all the rest endpoints are present
App.js in react is the home page/controller
DataBase is hosted in mLab hosting ( MongoDB)
Front end is react
Backend is python flask
Caching in browser side is using LocalStorage
Can be scaled to thousands of requests using gunicorn in combination with nginx/apache server ( which cannot be demoed as tester needs to set up additional environment)