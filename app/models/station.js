var mongoose= require('mongoose');

var StationSchema= new mongoose.Schema({
    station_name:{
    	type:String,
    	unique:true, // assume that in colombo have no statins with the same name
    	required:true,
    	lowercase:true,
    },
    coordinates:{
    	type:[Number],
    	required:true,
    }
 },{timestamps:true});

 module.exports=mongoose.model('Station', StationSchema);