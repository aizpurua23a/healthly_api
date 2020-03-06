var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var DaySchema = new Schema(
  {
    date: {type: Date, required: true},
    weight: {type: Number},
    food: [{type: String}]
  }
);

// Virtual for day's URL
DaySchema
.virtual('url')
.get(function () {
  return '/registry/day/' + moment(this.date).format('YYYY-MM-DD');
});

//Virtual for date_day
DaySchema
.virtual('date_day')
.get(function(){
  return (this.date? moment(this.date).format('DD/MM/YYYY'):"");
});

//Virtual for date update
DaySchema
.virtual('date_display')
.get(function(){
  return (this.date? moment(this.date).format('YYYY-MM-DD'):"");
});

//Export model
module.exports = mongoose.model('Day', DaySchema);
