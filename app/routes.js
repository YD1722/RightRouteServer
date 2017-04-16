var RouteController = require('./controllers/routes'),  
    StationController = require('./controllers/stations'),  
    express = require('express');

module.exports= function(app){
	 var apiRoutes = express.Router(),
        stationRoutes = express.Router(),
        pathRoutes = express.Router();

    // code here

    stationRoutes.post('/stationtest',StationController.typeaheadStations); //typeahaed
    stationRoutes.post('/station',StationController.addStation); // create a new station
    stationRoutes.get('/stations/:station_id',StationController.getStation);// get a single station :D
    stationRoutes.get('/stations',StationController.getStations);

    pathRoutes.get('/routes',RouteController.getRoutes);
    pathRoutes.post('/routes',RouteController.getRoute);
    pathRoutes.post('/bus_routes',RouteController.getPath); // return connected or directed bus routes :D
    pathRoutes.post('/reviews',RouteController.addReview);
    pathRoutes.get('/reviews/:route_no',RouteController.getReviews); 
    // this one should be updated to return as chunks 
    
    app.use('/api',stationRoutes);
    app.use('/api',pathRoutes);
        
}