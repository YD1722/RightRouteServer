var Station= require('../models/station');

exports.getStations= function(req,res,next){
	Station.find((err,stations)=>{
        if(err){
            res.send(err);
        }else{
            res.json(stations);  // make a change send==>json 
        }
    });
}

exports.getStation= function(req,res,next){	
    Station.findById(req.params.station_id,function(err,station){
        if(err){
            res.send(err);
        }else{
            res.json(station);
        }
    });
}

// find station by name 
exports.getStationByName= function(req,res,next){
    Station.find({station_name:req.params.station_name},(err,station)=>{
         if(err){
            res.send(err);
        }else{
            res.json(station);
        }
    });
}

//after add a new station all the stations are loaded or
//this is an administrator level route and need to be authenticate
exports.addStation= function(req,res,next){
	Station.create({
		station_name:req.body.station_name,
		coordinates:req.body.coordinates
	},(err,station)=>{
		if(err)
			res.send(err)
		Station.find((err,stations)=>{  // return all station
			if(err)
				res.send(err)
			res.json(stations);
		});
	});
}

exports.deleteStation=function(req,res){
     Station.remove({_id:req.params._id},(err)=>{
        if(err)
            res.send(err)
        res.json({message:"station deleted!!"});
    });
}
//xmlHttp request?? need attention here :\
exports.typeaheadStations=function(req,res,next){
	Station.find(
		{station_name:{$regex: req.body.var, $options:"i"}},(err,station)=>{
        if (err)
                res.send(err)

            res.json(station);
    }/*,(err,station)=>{
        if(err)
            res.send(err)
    }*/);
}