var mongoose= require('mongoose');

var RouteSchema=  new mongoose.Schema({
    name:String,
    path:[String],
    kml_path:String,
    reviews:[
    {
      description:String,
      rating:Number,
      user:String
    }
    ]
});

module.exports=mongoose.model('Route', RouteSchema);