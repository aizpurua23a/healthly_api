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
    Day.find({})
    .exec(function(err, days_in_db) {
      res.json(days_in_db );
  });
};

//GET DAYS
exports.day_list = function (req,res){
  Day.find({})
  .exec(function(err, days_in_db){
    days = []
    for (var i = 0; i < days_in_db.length; i++){
      days[i] = {
        date: days_in_db[i].date.toISOString().slice(0,10),
        food: days_in_db[i].food,
        weight: days_in_db[i].weight
      }
    }
    
    res.json(days);
  });
};

//GET DAY
exports.day_details = function (req,res,next){
  Day.find({date: req.params.date})
  .exec( function (err, day_content ){
    res.json(day_content);
  });
};

//POST DAY DETAILS
exports.day_create_post = [

  //validate fields
  body('date', 'Date must be a valid date.').isISO8601().trim(),
  body('weight', 'Weight must be provided.').exists().trim(),
  body('food','What did you eat today?').isString().trim(),

  //Sanitize body
  sanitizeBody('*').escape(),

  (req,res,next) => {
    //Debugging
    console.log(req.body.date)
    console.log(req.body.food)
    console.log(req.body.weight)

    //error get
    const {errors} = validationResult(req);

    if (errors.length > 0){
      const error = new Error(errors[0].msg);
      error.status = 400;
      return next(error);
    } else {
      Day.find({date: req.params.date})
      .exec(function(err,day){
        //The day exists
        if (day.length != 0) {
          res.send("That day already exists!\nDo you like to update it?")
        } else {
          var day = new Day({
            date: req.body.date,
            weight: req.body.weight,
            food: req.body.food,
          });
      
          //day saving
          day.save(function(err){
            if (err){return next(err)}
            res.status(200).end()
          })
        }
      })
    }
  }
];

//POST DAY UPDATE MODULE
exports.day_update_put = [
   //validate fields
   body('date', 'Date must be a valid date.').isISO8601().trim(),
   body('weight', 'Weight must be provided.').exists().trim(),
   body('food','What did you eat today?').isString().trim(),
 
   //Sanitize body
   sanitizeBody('*').escape(),
 
 
   (req,res,next) => {
     //error get
     const errors = validationResult(req);

     if (errors.length > 0){
      const error = new Error(errors[0].msg);
      error.status = 400;
      return next(error);
    } else {
      Day.find({date: req.body.date})
      .exec(function(err,old_day){
        //The day exists
        if (old_day.length != 0) {
          var day = new Day({
            date: req.body.date,
            weight: req.body.weight,
            food: req.body.food,
            _id: old_day[0]._id
          });

          console.log(day.date);
          console.log(day.weight);
          console.log(day.food);

          console.log(old_day[0]._id)

          Day.findByIdAndUpdate(old_day[0]._id, day, {}, function(err,day){
            if (err){return next(err);}
            res.status(200).end();
          });

        } else {
          res.send("That day doesnt exist!\nDo you want to create it?")
        }
      })
    }
   }
];

//DELETE
exports.day_delete = function (req,res,next){
  Day.deleteOne({date: req.params.date})
  .exec( function (err){
    res.status(200).end();
  });
};
