##Express Reservation Server

Using Express Node Module to serve pages and handle data requests.


###Setup

 Install Node.js and npm as downloaded here: http://nodejs.org/
 Install MongoDB as instructed here: http://docs.mongodb.org/manual/installation/



 Copy Repo

```
git clone https://github.com/paulb896/Angular_Reservations.git
```

  Install Dependencies

```
npm install
```


  Set Configuration Parameters

```
cp config.js.dist config.js
```

And set mongo db host information, as well as google api developer key.

``` config.js
..
// REPLACE VALUES BELOW WITH CUSTOM CONFIGURATIONS

config.dbHost = "mongodb://192.168.1.1:3001/reservation_system"; // Use your host and database name here
config.developerKey = "###########################"; // Google api developer key
..
```


###Run Server

```
node server
```

##Database

###Starting the Database

```
sudo mongod -port 3001
```

###Connect to Database

```
mongo -host 127.0.0.1:3001
```

###View Reservations

```
use reservation_system;
db.reservation.find();
```

Example to find reservations on Halloween

```
db.reservation.find({day:"31", month:"11", "year":"2013"});
```

```
var reservation = {
 "company" : "", "address" : "123 Street name", "month" : 5,
 "day" : 29, "date" : "2013-06-29T22:53:00.000Z", "year" : 2013,
 "status" : "maybe", "duration_minutes" : 0,
 "_id" : ObjectId("51f751d7d0fda46a65000007")
}
```
