var mongoose= require('mongoose');

var StationSchema= new mongoose.Schema({
    station_name:String,
    coordinates: [Number]
 });

 module.exports=mongoose.model('Station', StationSchema);