var Route= require('../models/route');

exports.getRoutes= function(req,res,next){
	Route.find((err,routes)=> {
        if (err)
            res.send(err)

        res.json(routes);
    });
}

exports.getRoute=function(req,res,next){
	 Route.find({
        name:req.body.name
    },(err,route)=>{
        if(err){
            res.send(err);
        }else{
            res.json(route);
            
        }
    });
}

exports.find_busses_from= function(req,res,next){
    Route.find({
        path:req.params.station_name
    },{name:1,start:1,end:1},(err,routes)=>{
        if(err)
            res.send(err);
        res.send(routes);
    });
}

exports.getPath=function(req,res){
	 Route.find({
        $and:[{path:req.body.p1},{path:req.body.p2}]
    },(err,route)=>{
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
                        res.json(route); //send==>json
                    }
                })
            }else{
                route.push({"type":"direct"});
                res.json(route); //send==>json
            }
        }
        
    });
}

exports.addRoute= function(req,res,next){
    Route.create({
        name:req.body.name,
        start:req.body.start,
        end:req.body.end,
        path:req.body.path,
        kml_path:req.body.kml_path
    },(err,route)=>{
        if(err){
            if ( err.code == 11000 ) {
                res.json({message:'station already exists!!!'});
                return next(err);
            }
        return next(err);   
        }
        res.json({message:"succefully added a route"});
    });
}

// need attention here
exports.deleteRoute= function(req,res){
    Route.remove({_id:req.params._id},(err)=>{
        if(err)
            res.send(err)
        res.json({message:"route deleted"});
    });
}



exports.updateRoute= function(req,res,next){
    Route.findByIdAndUpdate(req.params._id,
        { $set: 
            { 
                name: req.body.name,
                kml_path: req.body.kml_path,
                start: req.body.start,
                end: req.body.end,
                path:req.body.path

            }
        },
        { new: true },(err,route)=>{
        if(err){
            res.send(err);    
        }
        res.send(route);
    });
}



exports.addReview=function(req,res){
	Route.update({name:req.body.routeNo},

    {$push:{"reviews":
        {
            description:req.body.description,
            rating:req.body.rating,
            user:req.user.username,
        }
    }},
    {safe:true,new:true},
    (err,route)=>{
        if(err)
            res.send(err)
        res.send({message:"review updated succesfully"});  // need to modify to send all reviews?? or what
        
    }
    )
}

exports.getReviews=function(req,res){
	Route.find({name:req.params.route_no},'reviews',(err,reviews)=>{
        if(err)
            res.send(err);
        res.send(reviews);
    })
}

//delete an inappropriate review by
// authentication: admin only
exports.deleteReview= function(req,res){
    Route.update(
    {name:req.params.route_no},
    {$pull:{"reviews":{_id:req.params.review_id}}},
    (err)=>{
        if(err)
            res.send(err);
        res.json({message:"review deleted!"})
    });
}

//xmlHttp or what ?? need attention here
exports.typeaheadRoutes=function(req,res,next){
    Route.find(
        {name:{$regex: req.body.name, $options: 'i' }},(err,route)=>{
        if (err)
                res.send(err)
            res.json(route);
    });
}