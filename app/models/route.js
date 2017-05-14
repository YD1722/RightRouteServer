var mongoose= require('mongoose');

var RouteSchema=  new mongoose.Schema({
    name:{
      type:String,
      unique: true,
      required: true
    },
    start:{
      type:String,
      required: true
    },
    end:{
      type:String,
      required: true
    },
    path:{
      type:[String],
      required: true
    },
    kml_path:{
      type:String,
      required: true
    },
    reviews:[
    {
      description:String,
      rating:Number,
      user:String,
      created_at:{type: Date, required: true, default: Date.now}
    }
    ]
},{timestamps:true});

module.exports=mongoose.model('Route', RouteSchema);