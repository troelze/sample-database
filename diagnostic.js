var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 6530);
app.set('mysql', mysql);




app.use('/', require('./home.js'));

app.use('/players', require('./players.js'));

app.use('/teams', require('./teams.js'));

app.use('/stadiums', require('./stadiums.js'));

app.use('/positions', require('./positions.js'));

app.use('/divisions', require('./divisions.js'));

app.use('/highlights', require('./highlights.js'));

app.use('/championships', require('./championships.js'));

app.use('/uniforms', require('./uniforms.js'));






app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
