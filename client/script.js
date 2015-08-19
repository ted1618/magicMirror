//All my angular factories, controllers and routes
//*********************	Date Format	*******************************************
var monthNames = ["January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"]
        var date = new Date();
        var time = date.getHours() + ':' + date.getMinutes();
//*****************************************************************************
//************************	WELCOME MESSAGE GENERATOR *************************
var greetings = ["Howdy ","Well hello ","Greetings ","How's it going ", "What's up ",
"Why Hello There ","Bonjour ","Gon ni chi wa ","Aloha ", "How goes it "];
var random = Math.floor(Math.random()*greetings.length);
var greeting = greetings[random];

//Create app module
var myApp = angular.module('myApp',['ngRoute']);
//Set up my Angular Routes
myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/login',{
		templateUrl: 'partials/login.html',
		controller: 'loginController'
	}).
	when('/',{
		templateUrl: 'partials/mirror.html',
		controller: 'mirrorController'
	}).
	when('/config',{
		templateUrl: 'partials/config.html',
		controller: 'configController'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);

//****************** Factory for all Controllers *********************
myApp.factory('mirrorFactory', function($http){
	var factory={};
	var name;
	factory.addItem = function(data,callback){
		$http.post('/items/new',data).success(function(res){
			callback(res);
		})
	}
	factory.getItem = function(data,callback){
		$http.get('/item/'+data).success(function(res){
			callback(res);
		})
	}
	factory.getBucketList = function(data,callback){
		$http.get('/item/'+data.name).success(function(res){
			callback(res);
		})

	}
	factory.changeStatus = function(data,callback){
		$http.get('/status/'+data).success(function(res){
			callback(res);
		})
	}
	factory.getItems = function(callback){
		$http.get('/items').success(function(res){
			callback(res);
		})
	}
	factory.setUser = function(user){
		name=user.name;
	}
	factory.getUser = function()
	{
		return name;
	}
	return factory;
})
//******************  Controller for Mirror **********************************************
myApp.controller('mirrorController',function($scope,mirrorFactory){
	$scope.time = time;
	})
// ************************Login Controller ********************************
myApp.controller('loginController',function($scope,mirrorFactory){
	console.log('loginController initialized');
	//Set the user in factory from the login form 
	$scope.setUser = function(){
			mirrorFactory.setUser($scope.newUser);
		}
})

// ************************ Config Controller *******************************
myApp.controller('configController',function($scope,mirrorFactory){
	$scope.name = mirrorFactory.getUser();
	$scope.greeting = greeting;
})


/*

 /$$$$$$$$                 /$$                  /$$$$$$         /$$$$$$                                /$$                    
| $$_____/                | $$                 /$$__  $$       /$$__  $$                              | $$                    
| $$       /$$$$$$$   /$$$$$$$        /$$$$$$ | $$  \__/      | $$  \ $$ /$$$$$$$   /$$$$$$  /$$   /$$| $$  /$$$$$$   /$$$$$$ 
| $$$$$   | $$__  $$ /$$__  $$       /$$__  $$| $$$$          | $$$$$$$$| $$__  $$ /$$__  $$| $$  | $$| $$ |____  $$ /$$__  $$
| $$__/   | $$  \ $$| $$  | $$      | $$  \ $$| $$_/          | $$__  $$| $$  \ $$| $$  \ $$| $$  | $$| $$  /$$$$$$$| $$  \__/
| $$      | $$  | $$| $$  | $$      | $$  | $$| $$            | $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$ /$$__  $$| $$      
| $$$$$$$$| $$  | $$|  $$$$$$$      |  $$$$$$/| $$            | $$  | $$| $$  | $$|  $$$$$$$|  $$$$$$/| $$|  $$$$$$$| $$      
|________/|__/  |__/ \_______/       \______/ |__/            |__/  |__/|__/  |__/ \____  $$ \______/ |__/ \_______/|__/      
                                                                                   /$$  \ $$                                  
                                                                                  |  $$$$$$/                                  
                                                                                   \______/                                   


*/