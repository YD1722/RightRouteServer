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

exports.addReview=function(req,res){
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