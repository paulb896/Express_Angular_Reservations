/**
 * Reserve the Time
 * ---------------
 * Application and api servers
 * containing login, session management, and google
 * search logic.
 */



/**
 * Initialize configurations and external
 * dependencies.
 */
var config = require('./config'),
  MongoClient = require('mongodb').MongoClient,
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  googleapis = require('./node_modules/googleapis/lib/googleapis.js');
  cookieParser = require('cookie-parser'),
  favicon = require('serve-favicon'),
  OAuth2 = googleapis.auth.OAuth2,
  oauth2Client = new OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUrl
  ),
  loginUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    login_hint: config.loginHint,
    scope: 'https://www.googleapis.com/auth/plus.me'
  }),
  crypto = require('crypto');

/**
 * Configure express server
 */
app.use(bodyParser());
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public/'));
app.set('partials', __dirname + '/public/partials');
app.set('views', __dirname + '/public/partials');

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(cookieParser(config.cookieSecret));

// Not proud of this... fix this later
app.get('/index', function(req, res){
    res.render('reserve', {
        title: "Reserve the Time",
        header: "Reservation System",
        loginUrl: loginUrl
    });
});

app.get('/index.html', function(req, res){
    res.render('reserve', {
        title: "Reserve the Time",
        header: "Reservation System",
        loginUrl: loginUrl
    });
});

app.get('/', function(req, res){
    res.render('reserve', {
        title: "Reserve the Time",
        header: "Reservation System",
        loginUrl: loginUrl
    });
});

/**
 * Respond with reservations for given date input
 */
app.get('/login', function(req, res){
  if (req.query.code) {
    oauth2Client.getToken(req.query.code, function(err, tokens) {
      oauth2Client.setCredentials(tokens);
      googleapis
        .discover('plus', 'v1')
        .execute(function(err, client) {
          client
            .plus.people.get({ userId: 'me' })
            .withAuthClient(oauth2Client)
            .execute(function(err, profile) {
              if (err) {
                console.log('An error occured', err);
                return;
              }
              console.log(profile.displayName, ':', profile.image.url);

              var hashKey = crypto.createHash(config.hashMethod);
              hashKey.update(config.mySecretKey);
              hashKey.update(profile.id);
              var sessionId = hashKey.digest('base64');
              var sessionData = {
                sessionId: sessionId,
                userProfile:profile
              };

              // Insert session into mongodb
              MongoClient.connect(config.dbHost, function(err, db) {
                if (!db) {
                  return;
                }
                var collection = db.collection('UserSessions');
                collection.insert(sessionData, function(err, docs) {
                  if (err) {
                    res.code(500).end("Could not save user session");
                    console.log("Unable to save user session");
                    return;
                  }

                  // Session usable for a week
                  res.cookie('sessionId', sessionId,  { maxAge: 604800000, httpOnly: false, signed:true });
                  res.redirect('..');
                });
              });
            });
        });
    });
  } else {
    res.render('login', {
      loginUrl: loginUrl
    });
  }
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Unexpected exception caught");
});

app.put('/session', function(req, res) {
    console.log("Attempting to save session");

    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
        res.status(401).end("Missing sessionId");
        return;
    }

    console.log("Session data", req.body);
    MongoClient.connect(config.dbHost, function(err, db) {
        if(err) {
            res.end(JSON.stringify({}));
            return;
        }

        var collection = db.collection('UserSessions');
        collection.update({sessionId: sessionId}, {$set: {session:req.body}}, {w:1}, function(err) {
            if (err) {
                console.log("Could not save session");
                return;
            }

            console.log("session updated");
        });
    });
});

/**
 * Check for session information, and send back
 * found session data.
 */
app.get('/session', function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    res.status(401).end("Missing sessionId");
    return;
  }

  MongoClient.connect(config.dbHost, function(err, db) {
    if(err) {
      res.end(JSON.stringify({}));
      return;
    }

    var collection = db.collection('UserSessions');
    collection.find(
      {
        sessionId:sessionId
      }
    ).toArray(function(err, results) {
        console.dir(results);
        res.end(JSON.stringify(results));
        // Let's close the db
        db.close();
      });
  });
})


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
  var request = require('request'),
      latitude = "49.248869",
      longitude = "-122.973796";

  if (req.query.hasOwnProperty("latitude")) {
      latitude = req.query.latitude;
  }

  if (req.query.hasOwnProperty("longitude")) {
      longitude = req.query.longitude;
  }

  var requestUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude
      +"," + longitude + "&radius=5000&types="
      + req.query.category + "&name=" + req.query.searchText + "&sensor=false&key=" + config.developerKey;

  request(requestUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the google web page.
      MongoClient.connect(config.dbHost, function(err, db) {
        if (!db) {
          return;
        }
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
        if (!db) {
          return;
        }
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
 * City or region search
 */
app.get('/location', function(req, res){
    var request = require('request'),
        latitude = "49.248869",
        longitude = "-122.973796";

    if (req.query.hasOwnProperty("latitude")) {
        latitude = req.query.latitude;
    }

    if (req.query.hasOwnProperty("longitude")) {
        longitude = req.query.longitude;
    }

    var requestUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + req.query.address
        + "&sensor=false&key=" + config.developerKey;

    request(requestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.end(body);
        }
    })
});


/**
 * Attempt to save a reservation to the database.
 */
app.post('/reserve', function(req, res){

//
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
      res.status(401).end("Missing sessionId");
      return;
  }

  MongoClient.connect(config.dbHost, function(err, db) {
    if (!db) {
        return false;
    }

    var collection = db.collection('reservation');

    //console.log(JSON.parse(req.body));
    console.log("THIS IS THE BODY: ");
    console.log(req.body);
    console.log("<--HERE");
    var event = req.body;
    event.sessionId = sessionId;
    collection.insert(JSON.parse(event), function(err, docs) {
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


