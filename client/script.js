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
// ******************CREATE A TIME DIRECTIVE************************************
myApp.directive("myCurrentTime", function(dateFilter){
    return function(scope, element, attrs){
        var format;
        scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
        });
        
        function updateTime(){
            var dt = dateFilter(new Date(), format);
            element.text(dt);
        }
        
        function updateLater() {
            setTimeout(function() {
              updateTime(); // update DOM
              updateLater(); // schedule another update
            }, 1000);
        }
        
        updateLater();
    }
});
//****************** Factory for all Controllers *********************
myApp.factory('mirrorFactory', function($http){
	var factory={};
	var name;
	factory.getWeather = function(callback){
		$http.get('http://api.apixu.com/v1/forecast.json?key=7b67e669b24a4e699f9173147151908&q=San_Jose&days=2').success(function(res){
			callback(res);
		})
	}
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
myApp.controller('mirrorController',function($scope,mirrorFactory,$interval){
	$scope.format = 'h:mm a';
	var updateWeather = function()
	{
		mirrorFactory.getWeather(function(data){
		$scope.weather = data
		console.log("we refreshed weather",$scope.weather)
//****************************************************************************************	
	// Set up date format for the mirror
	//Retrieve current date from weather API 
		var date = $scope.weather.forecast.forecastday[0].date;
	//Transform month from number to string
		if(date[5] == 0){
			var month = monthNames[date[6]-1];
		}
		else{
			var month = monthNames[date[5]+date[6]];
		}
		//send the formatted date for display
	$scope.dateFormatted = date[date.length-2]+date[date.length-1]+' '+month+' '+date.substring(0,4);
//*******************************************************************************************
		//Format Weather Information
		//Select Icon
		var code = $scope.weather.current.condition;
		var icon_name;
		var timeCheck = $scope.weather.current.last_updated;
		var timeLogic = timeCheck.substring(10,13);
		var checkTime = function(time)
		{
			if(time>20 || time<6)
			{
				return "night"
			}
			else{
				return "day"
			}
		}
		var timeOfDay = checkTime(timeLogic);
		if(code.code == 1000 && timeOfDay == "day")
		{
			$scope.icon_name = "wi wi-day-sunny"
		}
		else if(code.code == 1000 && timeOfDay == "night")
		{
			$scope.icon_name = "wi wi-night-clear"
		}
		else if((code.code == 1003 || code.code == 1006) && timeOfDay == "day")
		{
			$scope.icon_name = "wi wi-day-cloudy"
		}
		else if((code.code == 1003 || code.code == 1006) && timeOfDay == "night")
		{
			$scope.icon_name = "wi wi-night-alt-cloudy"
		}
		else
		{
			$scope.icon_name = "wi wi-hail"
		}
		});	
	}
	updateWeather();
	$interval(updateWeather,1200000);
	})
// ************************Login Controller ********************************
myApp.controller('loginController',function($scope,mirrorFactory){
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