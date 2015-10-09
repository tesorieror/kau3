var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var database = require('./config/database');

var routes = require('./routes/index');
var users = require('./routes/users');

var initialize = require('./routes/initialize');
var tagCategoryName = require('./routes/tag-category/name');
var tagCategory = require('./routes/tag/category');
var indicatorTag = require('./routes/indicator/tag');
var indicatorStudentCommunity = require('./routes/indicator/students/community');
var indicatorStudentCommunityService = require('./routes/indicator/students/community-service');
var indicatorStudentStaff = require('./routes/indicator/students/staff');
var indicatorStudentFreshmenUndergraduate = require('./routes/indicator/students/freshmen-undergraduate');
var indicatorStudentFreshmenIntermediate = require('./routes/indicator/students/freshmen-intermediate');
var indicatorStudentFreshmenPostGraduateCollegeSectionSpecialization = require('./routes/indicator/students/freshmen-post-graduate-college-section-specialization');
var indicatorStudentFreshmenPostIntermediateDiplomaCollegeSectionSpecialization = require('./routes/indicator/students/freshmen-intermediate-diploma-college-section-specialization');
var countIndicatorStudentFreshmenPostIntermediateDiplomaCollegeSectionSpecialization = require('./routes/indicator/students/freshmen-intermediate-diploma-college-section-specialization_count');

var app = express();

// Database conneciton
mongoose.connect(database.url);
var db = mongoose.connection;
// app.set('db', db);
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/initialize', initialize);
app.use('/tagCategory/name', tagCategoryName);
app.use('/tag/category', tagCategory);
app.use('/indicator/tag', indicatorTag);
app.use('/data/students/community', indicatorStudentCommunity);
app.use('/data/students/community-service', indicatorStudentCommunityService);
app.use('/data/students/staff', indicatorStudentStaff);
app.use('/data/students/freshmen-undergraduate/', indicatorStudentFreshmenUndergraduate);
app.use('/data/students/freshmen-intermediate/', indicatorStudentFreshmenIntermediate);
app.use('/data/students/freshmen-post-graduate-college-section-specialization/',
		indicatorStudentFreshmenPostGraduateCollegeSectionSpecialization);
app.use('/data/students/freshmen-intermediate-diploma-college-section-specialization/',
		indicatorStudentFreshmenPostIntermediateDiplomaCollegeSectionSpecialization);
app.use('/data/students/freshmen-intermediate-diploma-college-section-specialization_count/',
		countIndicatorStudentFreshmenPostIntermediateDiplomaCollegeSectionSpecialization);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

app.set('env', 'development');

// development error handler
// will print stacktrace
//
// JADE
//
// if (app.get('env') === 'development') {
// app.use(function(err, req, res, next) {
// res.status(err.status || 500);
// res.render('error', {
// message : err.message,
// error : err
// });
// });
// }

// production error handler
// no stacktraces leaked to user
//
// JADE
//
// app.use(function(err, req, res, next) {
// res.status(err.status || 500);
// res.render('error', {
// message : err.message,
// error : {}
// });
// });

// Normal

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		console.error('ERROR', err);
		res.send({
			message : err.message,
			error : err
		});
	});
}

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		message : err.message,
		error : {}
	});
});

module.exports = app;
