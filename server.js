//when doing the node server.js, then the listener will wait for a request. When someone go to the url, then it will
//send back the information


const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();



// indicate that like header, footer will be repeated to be used in different html pages, so
// no need to have the header, footer in every html pages
hbs.registerPartials(__dirname + '/views/partials')

// This is using the template method to build a static page, it is using the hbs package
app.set('view engine', 'hbs');

// Handlerbars Helpers - can register the function to run, for example, the current year in this example
// each html will pass the current year, so we can define a function so that hadlebars template to call
hbs.registerHelper('getCurrYear', () => {    //1st parameter, the name, 2nd is the function
  return new Date().getFullYear() // new Date().getFullYear() is a java script constructor to get the year.
});

hbs.registerHelper('uCase', (text) => {
  return text.toUpperCase();
})

// the use function takes 3 argruments, request, response, and next
// next means the middleware is not going to move on until we call next
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} - ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log')
    }
  });

  // now if we missing this statement, all the below pages will not work
  next();
});

// If doing this then the program will only show up the maintenance page, and not able to go other pages
// as it doesn't have the next()
//app.use((req, res, next) => {
//  res.render('maintenance.hbs');
//});

app.get('/about', (req, res) => {
  res.render('about.hbs', {             // We can pass an object in the 2nd parameter, to pass the value to the hbs template
    pageTitle: 'About Page',
  });
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    welcomeMessage: 'Welcome to my website',
    pageTitle: 'Home Page',
  });
});




// in order to make a static page, we can use this, so no need to use the app.get(like below)
// it will look up the page in the public folder.
// app.use is used to register the express middleware
app.use(express.static(__dirname + '/public'));  // it takes a function


// setting up the HTTP route handlers, can send back like json file or html page. So .get() used to setup the handler
// It has 2 arguments, 1st is the URL, 2nd is a function to run, that tell express what to send back to the person
// who made the request
app.get('/hobbies', (req, res) => {  // This function is taking 2 arguments, 1st one is request, and 2nd is response
  res.send({                         // when define as an object, express will use the json to view
    name:'Elise',
    hobbies: [
      'Biking',
      'Cooking',
      'Reading book'
    ]
  });
});

app.get('/about2', (req, res) => {        // This function is taking 2 arguments, 1st one is request, and 2nd is response
  res.send('<h1>About page</h1>');       // can be a html
});



// It is used to bind the applicatiion to the port
app.listen(3000, () => {
  console.log('Server is up running on port 3000');
});
