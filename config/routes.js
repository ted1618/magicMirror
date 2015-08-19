//****************************************************************************
//*********************(((((((((ROUTES CONFIG)))))))))************************

//require controllers 
var items = require('../server/controllers/items.js');
//export routes to server
module.exports = function(app){
	//our ROUTES go below
	app.get('/item/:name',function(req,res){
		items.getItem(req,res);
	})
	app.get('/items',function(req,res){
		items.show(req,res);
	});
	app.get('/status/:id',function(req,res){
		items.changeStatus(req,res);
	});
	app.post('/items/new',function(req,res){
		items.add(req,res);
	});
	app.post('/items/sendTo',function(req,res){
		items.sendTo(req,res);
	});
};