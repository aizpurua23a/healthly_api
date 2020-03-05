//Models
var Day = require('../models/day');

//requirements
var moment = require('moment');

//Requirements for execution
var async = require('async');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify','false');

//validationResult
const { sanitizeBody, body, validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  //We count the ammount of days of which we've got data
    Day.countDocuments({})
    .exec(function(err, days_in_db) {
      res.render('index', { title: 'Local Registry Home', error: err, days_total: days_in_db });
  });
};

//Days
exports.day_list = function (req,res,next){
  Day.find({})
  .exec(function(err, days_in_db){
    res.render('day_list', {title: 'Day List', days: days_in_db});
  });
};

exports.day_details = function (req,res,next){
  Day.findById(req.params.id)
  .exec( function (err, day_content ){
    res.render('day_details',{title: 'Day Details', day: day_content});
  });
};

//GET DAY CREATE MODULE
exports.day_create_get = function(req,res,next){
  res.render('day_form',{title: 'Start Day', date: moment().format('YYYY-MM-DD')});
};

//POST DAY CREATE MODULE
exports.day_create_post = [

  //validate fields
  body('date', 'Date must be a valid date.').isISO8601().trim(),
  body('weight', 'Weight must be provided.').exists().trim(),
  body('food','What did you eat today?').isString().trim(),

  //Sanitize body
  sanitizeBody('*').escape(),


  (req,res,next) => {
    //error get
    const errors = validationResult(req);

    //day declaration
    var day = new Day({
      date: req.body.date,
      weight: req.body.weight,
      food: req.body.food,
    });

    //day saving
    if (!errors.isEmpty()){return next(err);}
    day.save(function(err){
      if (err){return next(err)}
      res.redirect(day.url);
    })

  }
];


//GET DAY UPDATE MODULE
exports.day_update_get = function(req,res,next){
  Day.findById(req.params.id)
  .exec( function (err, day_content ){
    res.render('day_form',{title: 'Update Day', date: day_content.date_display, day: day_content});
  });
};

//POST DAY UPDATE MODULE
exports.day_update_post = [
   //validate fields
   body('date', 'Date must be a valid date.').isISO8601().trim(),
   body('weight', 'Weight must be provided.').exists().trim(),
   body('food','What did you eat today?').isString().trim(),
 
   //Sanitize body
   sanitizeBody('*').escape(),
 
 
   (req,res,next) => {
     //error get
     const errors = validationResult(req);

     //day declaration
     var day = new Day({
       date: req.body.date,
       weight: req.body.weight,
       food: req.body.food,
       _id: req.params.id,
     });
 
     //day saving
     if (!errors.isEmpty()){return next(err);}
     mongoose.set('useFindAndModify','false');
     Day.findByIdAndUpdate(req.params.id, day, {}, function(err,day){
      if (err){return next(err);}
      res.redirect(day.url);
    });
 
   }
];
