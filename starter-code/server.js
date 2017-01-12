'use strict';
// DONE: Install and require the node postgres package into your server.js, and ensure that it's now a new dependency in your package.json

const pg = require('pg');

const express = require('express');
// REVIEW: Require in body-parser for post requests in our server
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
// REVIEW: Create a connection string for the url that will connect to our local postgres database
const conString = process.env.DATABASE_URL || 'postgres://localhost:5432';  //5432 is the default PORT for working with postgres

// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));  //line 15 and 16 taking data from a HTTP post request and taking that data and attaching it to the body
app.use(express.static('./public'));


// NOTE: Routes for requesting HTML resources
app.get('/', function(request, response) {
  response.sendFile('index.html', {root: '.'});
});

app.get('/new', function(request, response) {
  response.sendFile('new.html', {root: '.'});
});



// NOTE: Routes for making API calls to enact CRUD Operations on our database
app.get('/articles/all', function(request, response) {
  let client = new pg.Client(conString); // Pass the conString to pg, which creates a new client object

  client.connect(function(err) { // Use the client object to connect to our DB.
    if (err) console.error(err);
    client.query('SELECT * FROM articles', function(err, result) { // Make a request to the DB
      if (err) console.error(err);
      response.send(result);
      client.end();
    });
  })
});

app.post('/articles/insert', function(request, response) {
  console.log(request.body.article);
  let client = new pg.Client(conString) // create clien

  client.connect(function(err) {  // connect client
    if (err) console.error(err);

    // TODO: Write the SQL query to insert a new record
    client.query (`INSERT INTO articles(id PRIMARY KEY, title, author, "authorUrl", category, "publishedOn", body) VALUES($1, $2, $3, $4, $5, $6)`, // query client
    // TODO: Get each value from the request's body . see line 46 console.log above to see what is inside the body
      [
        request.body.title,
        request.body.author,
        request.body.authorUrl,
        request.body.category,
        request.body.publishedOn,
        request.body.body,
      ],
      function(err) {
        if (err) console.error(err);
        client.end();
      }
    );
    response.send('insert complete');
  })
});

app.put('/articles/update', function(request, response) {
  let client = new pg.Client(conString);

  client.connect(function(err) {
    if (err) console.error(err);

    // TODO: Write the SQL query to update an existing record
    client.query(`UPDATE articles(id PRIMARY KEY, title, author, "authorUrl", category, "publishedOn", body) SET (title = 'title', author = 'author', "authorUrl" = '"authorUrl"', category = 'category', "publishedOn" = '"publishedOn"', body = 'body') WHERE (id = 'id')`),

      // TODO: Get each value from the request's body
      [
        request.body.title,
        request.body.author,
        request.body.authorUrl,
        request.body.category,
        request.body.publishedOn,
        request.body.body,
      ],
      function(err) {
        if (err) console.error(err);
        client.end();
      }
  })
  response.send('insert complete');
});

app.delete('/articles/delete', function(request, response) {
  let client = new pg.Client(conString);

  client.connect(function(err) {
    if (err) console.error(err);

    // TODO: Write the SQL query to delete a record
    client.query(`DELETE FROM articles WHERE (id = 'id')`),
      function(err) {
        if (err) console.error(err);
        client.end();
      }
  })
  response.send('Delete complete');
});

app.delete('/articles/truncate', function(request, response) {
  let client = new pg.Client(conString);

  client.connect(function(err) {
    if (err) console.error(err);

    // TODO: Write the SQl query to truncate the table
    client.query('TRUNCATE TABLE articles'),
      function(err) {
        if (err) console.error(err);
        client.end();
      }
  })
  response.send('Delete complete');
});

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});
