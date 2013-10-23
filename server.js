

var config = require('./config'),
  MongoClient = require('mongodb').MongoClient,
  express = require('express'),
  app = express();

app.set('view engine', 'html');
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

/**
 * Respond with reservations for given date input
 */
app.get('/reservations', function(req, res){
    MongoClient.connect(config.dbHost, function(err, db) {
        if(err) {
            res.end(JSON.stringify({}));
            return;
        }

        var collection = db.collection('reservation');
        collection.find(
            {
                day: parseInt(req.query.day),
                month: parseInt(req.query.month),
                year: parseInt(req.query.year)
            }
        ).toArray(function(err, results) {
                console.dir(results);
                res.end(JSON.stringify(results));
                // Let's close the db
                db.close();
            });
    });
});

/**
 * Respond with places matching query
 */
app.get('/places', function(req, res){
    var request = require('request');
    var requestUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.248869,-122.973796&radius=5000&types="
        + req.query.category + "&name=" + req.query.searchText + "&sensor=false&key=" + config.developerKey;
    request(requestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
            MongoClient.connect(config.dbHost, function(err, db) {
                var collection = db.collection('places');

                collection.insert(JSON.parse(body), function(err, docs) {
                    db.close();
                    if (err) {
                        console.log("Error saving place details to db");
                    }
                });
            });
            res.end(body);
        }
    })
});

/**
 * Respond with details about a given place
 */
app.get('/place-details', function(req, res){
    var request = require('request');
    var requestUrl = "https://maps.googleapis.com/maps/api/place/details/json?sensor=true&reference=" + req.query.reference + "&sensor=true&key=" + config.developerKey;
    console.log("ATTEMPTING TO HIT " + requestUrl + " FOR PLACE DETAILS")
    request(requestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            MongoClient.connect(config.dbHost, function(err, db) {
                var collection = db.collection('placeDetails');

                collection.insert(JSON.parse(body), function(err, docs) {
                    if (err) {
                        return;
                    }
                    db.close();
                });
            });
            res.end(body);
            console.log(body) // Print the google web page.
            res.end(body);
        }
    })
});

/**
 * Attempt to save a reservation to the database.
 */
app.post('/reserve', function(req, res){

    // Add authentication check here

    var authUrl = "https://accounts.google.com/o/oauth2/auth?redirect_uri=https%3A%2F%2Freservethetime.com" +
        "&response_type=code&client_id=reservethetime.com" +
        "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&approval_prompt=force&access_type=offline";

    MongoClient.connect(config.dbHost, function(err, db) {
        if(err || !req.body) return false;

        var collection = db.collection('reservation');

        //console.log(JSON.parse(req.body));
        collection.insert(JSON.parse(req.body), function(err, docs) {
            db.close();
            if (err) {
                res.send('Unable to save event properly');
                console.log("Unable to save reservation properly");
                return;
            }
            res.send('Event Saved');
            console.log("Reservation successfully saved");
        });
    });

    res.send('Event Saved');
});


app.listen(config.serverPort);
console.log('Listening on port ' + config.serverPort);

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});
