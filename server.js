// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

// Configuration

mongoose.connect('mongodb://127.0.0.1/demoCheck');
 
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
// Models
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
},{ collection : 'route' });
 var Route = mongoose.model("Route", RouteSchema);

 var StationSchema= new mongoose.Schema({
    station_name:String,
    coordinates: [Number]
 },{collection:'stations'});
 var Station= mongoose.model("Station",StationSchema);
 

// Routes


 app.get('/api/routes', function(req, res) {

        // use mongoose to get all todos in the database
        Route.find(function(err,routes) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(routes); // return all routes in JSON format
        });
    });

 // temporary route for search for bus routes in a starion=====================
app.post('/api/station_routes',(req,res)=>{
    Station.aggregate([
    {
        $match:{'path':'Fort'}
    }
    ],(err,routes)=>{
        if(err)
            res.send(err);
        res.json(routes);
    });
});
    
app.post('/api/routes',function(req,res){
    Route.find({
        name:req.body.name
    },function(err,route){
        if(err){
            res.send(err);
        }else{
            res.json(route);
            
        }
    });
});

// get or post (need to think again)
app.get('/api/stations/:station_id',function(req,res){
    
        Station.findById(req.params.station_id,function(err,station){
            if(err){
                res.send(err);
            }else{
                res.json(station);
            }
        })

});



app.get('/api/stations',(req,res)=>{
    Station.find((err,stations)=>{
        if(err){
            res.send(err);
        }else{
            res.send(stations);
        }
    })
})

app.post('/api/bus_routes',function(req,res){
    Route.find({
        $and:[{path:req.body.p1},{path:req.body.p2}]
    },function(err,route){
        if(err){
            res.send(err);
        }else{
            //console.log(typeof(route[0]))
            if(typeof(route[0])==="undefined"){
                Route.find({
                    $or:[{path:req.body.p1},{path:req.body.p2}]
                },function(err,route){
                    if(err){
                        res.send(err);
                    }else{
                        route.push({"type":"connected"});
                        res.send(route);
                    }
                })
            }else{
                route.push({"type":"direct"});
                res.send(route);
            }
        }
        
    });
});     

app.post('/api/reviews',(req,res)=>{
    Route.update({name:req.body.routeNo},

    {$push:{"reviews":
        {
            description:req.body.description,
            rating:req.body.rating,
            user:req.body.user
        }
    }},
    {safe:true,new:true},
    (err,route)=>{
        if(err)
            res.send(err)
        res.send({message:"review updated succesfully"});
        
    }
    )
});

app.get('/api/reviews/:route_no',(req,res)=>{
    Route.find({name:req.params.route_no},'reviews',(err,reviews)=>{
        if(err)
            res.send(err);
        res.send(reviews);
    })
});

/*var willGetSingleBus= new Promise(function(){
    Route.find({
        $and:[{path:req.body.p1},{path:req.body.p2}]
    },function(err,route){
        if(route[0]==='undefined'){
        var reason = new Error('No results found');  
        reject(reason);
    }else{
        resolve(route);
    }  
})
    
});
*/



/*app.post('/api/route',function(req,res){
    var route = new Route(); // createa new review instance
    route.name=req.body.name;

    route.save(function(err){
        if(err)
            res.send(err);
    });
});*/

/*    app.post('/api/rooms', function(req, res) {
 
        Room.find({
            type: req.body.roomType,
            beds: req.body.beds,
            max_occupancy: {$gt: req.body.guests},
            cost_per_night: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
            reserved: { 
 
                //Check if any of the dates the room has been reserved for overlap with the requsted dates
                $not: {
                    $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
                }
 
            }
        }, function(err, rooms){
            if(err){
                res.send(err);
            } else {
                res.json(rooms);
            }
        });
 
    });*/
 
    /*app.post('/api/rooms/reserve', function(req, res) {
 
        console.log(req.body._id);
 
        Room.findByIdAndUpdate(req.body._id, {
            $push: {"reserved": {from: req.body.from, to: req.body.to}}
        }, {
            safe: true,
            new: true
        }, function(err, room){
            if(err){
                res.send(err);
            } else {
                res.json(room);
            }
        });
 
    });*/
 
// listen
app.listen(8080);
console.log("App listening on port 8080");