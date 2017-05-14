// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');


var databaseConfig = require('./config/database');
var router = require('./app/routes');

mongoose.connect(databaseConfig.url);

app.listen(process.env.PORT || 8080); 
console.log("App listening on port 8080");

/*// Configuration

mongoose.connect('mongodb://127.0.0.1/demoCheck');*/
/*app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());*/

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());

router(app);



/*// Models
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

//  using xmlHttp bestter or worst or what ?? need attention here :/
//done
 app.post('/api/stationtest',(req,res)=>{
    Station.find({station_name:{$regex: req.body.var, $options: 'i' }},(err,station)=>{
        if (err)
                res.send(err)

            res.json(station);
    },(err,station)=>{
        if(err)
            res.send(err)
    });
 });

 //this is a administrator level route, should be authenticated
//done
 app.post('/api/station',(req,res)=>{
    let station= new Station();
    station.station_name= req.body.station_name;
    station.coordinates=req.body.coordinates;
    station.save(err=>{
        if(err)
            res.send(err);
        res.json({message:'Station added succesfully'});
    });
 });

//done
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

//done
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
//done
app.get('/api/stations/:station_id',function(req,res){
    
        Station.findById(req.params.station_id,function(err,station){
            if(err){
                res.send(err);
            }else{
                res.json(station);
            }
        })

});


//done
app.get('/api/stations',(req,res)=>{
    Station.find((err,stations)=>{
        if(err){
            res.send(err);
        }else{
            res.send(stations);
        }
    })
})

//done
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

//done
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

//done
app.get('/api/reviews/:route_no',(req,res)=>{
    Route.find({name:req.params.route_no},'reviews',(err,reviews)=>{
        if(err)
            res.send(err);
        res.send(reviews);
    })
});


// listen
app.listen(8080);
console.log("App listening on port 8080");*/