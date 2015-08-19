//our model for the Customers 
//require Mongosse
var mongoose = require('mongoose');
//the schema for the customers
var ItemSchema = new mongoose.Schema({
	name: String,
	title: String,
	description: String,
	status: String,
	sendTo: String,
	created_at: String
});
//associate Customer with the schema
mongoose.model('Item', ItemSchema);