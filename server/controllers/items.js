//********************************************************************************
//*************************	CUSTOMERS CONTROLLER  ********************************
//********************************************************************************

//requires express, mongoose, the model

var mongoose = require('mongoose');
var Item = mongoose.model('Item');
/////////////////////////////////////////////////////////////////////////////////
//**we call an immediate function within exports and return our methods**//
module.exports = (function(){
	return {
		//all methods go BELOW from here
		show: function(req,res){
			Item.find({}, function (err, results){
				console.log(results);
				if(err){
					console.log('control fail runs');
					console.log(err);
					res.end();
				}
				else{
					console.log('control success runs');
					res.json(results);
				}
			})
		},
		add: function(req,res){
			var repack = {name: req.body.name, title: req.body.title, 
				description: req.body.description, status: req.body.status, sendTo: req.body.sendTo, created_at: req.body.created_at};
			var item = new Item (repack);
			item.save(repack, function(err,results){
				if(err){
					console.log(err);
					res.end();
				}
				else{
					res.json(results);
				}
			})
		},
		sendTo: function(req,res){
			console.log("we reached sendTo with",req.body);
			res.end();
		},
		changeStatus: function(req,res){
            console.log("change status server side gets",req.params);
            Item.find({_id: req.params.id}, function(err,results){
            	if(err)
            		{
	            		console.log("ERROR: can't find anyone");
	            		console.log(err);
	            		res.end()
            		}
            	else{
	            		if(results[0].status === "notDone")
	            		{
	            			//change it here to Done
	            			Item.update({_id: req.params.id}, {status: "done"}, function(err,results){
	            				results.status='done';
	            				console.log('updated to done');
	            				res.json(results);
	            			})
	            		}
	            		else
	            		{
	            			//change it here to NOT Done
	            			Item.update({_id: req.params.id}, {status: "notDone"}, function(err,results){
	            				results.status='notDone';
	            				console.log('updated to notDone');
	            				res.json(results);
	            			})
	            		}
            		}
            	})
        },
		getItem: function(req,res){
			console.log("getItem (serverside) fetches for ",req.params);
				Item.find({name:req.params.name}, function (err, results){
				console.log(results);
				if(err){
					console.log('control fail runs');
					console.log(err);
					res.end();
				}
				else{
					console.log('control success runs');
					console.log('we return ',results);
					res.json(results);
				}
			})
		}
	}
})();
//!!don't forget about invoking () brackets down here!!!