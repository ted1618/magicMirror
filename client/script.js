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
		else if((code.code == 1003 || code.code == 1006 || code.code == 1009) && timeOfDay == "day")
		{
			$scope.icon_name = "wi wi-day-cloudy"
		}
		else if((code.code == 1003 || code.code == 1006 || code.code == 1009) && timeOfDay == "night")
		{
			$scope.icon_name = "wi wi-night-alt-cloudy"
		}
		else
		{
			$scope.icon_name = "wi wi-hail"
		}
		//********************** Round down temperature for proper render **************
		$scope.tomorrow_temp_f=Math.floor($scope.weather.forecast.forecastday[1].day.avgtemp_f)
		//*********************** Set Up Sun Alert SUNSCREEN **************************
		if($scope.weather.current.feelslike_f >= 92)
		{
			var div = document.getElementById("sun_alert_div");
			div.innerHTML = "<img src='img/sun_alert.png' id='sun_alert' alt='sun_alert'><h2>Chief, wear sunscreen.</h2>"
		}
		else if($scope.weather.current.feelslike_f < 92)
		{
			var div = document.getElementById("sun_alert_div");
			div.innerHTML = ""
		}
		
		});	
	}
	updateWeather();
	$interval(updateWeather,1200000);
	var mirrorBrain = function()
	{
		//************************************************** THE BRAIN ***************************************
		// This is the "brain" of the magic mirror. It shows content based on a number of external variables
		// such as the time of day, temperature. It renders all sort of content from motivational speeches to 
		// algorithm problems. 
		//****************************************************************************************************
	//Time tracking Variables
		var d = new Date();
		var timeCheck = d.getHours();
	// Declare storing variables
	var greetings=[["Good morning, ninja!","You are awesome. That's all I have to say.","The Dojo welcomes you","Hey handsome, have a good day.","Time to shine, let's get that code going.","Let's work, chief.","Dojo Life Initiatied"],
				  ["Most of the coding is done around now.","Time for Ping Pong!","What's your next big project?","Oh hey there :)","Code like there's no tomorrow."],
				  ["ERR 404: code x3127a; JK. I'm fine.","Give me a smile :)","I've been expecting you.","I dare you to take a selfie.","Did you know I programmed myself in binary?","I was a crazy idea in a student's brain. And now I'm here.","I wish I was a smartwatch."]];
	var algorithms=[];
	var jokes = ["There are only 10 kinds of people in this world: those who know binary and those who don’t.",
					"99 little bugs in the code. 99 bugs in the code. patch one down, compile it around. 117 bugs in the code",
					"A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.",
					"A programmer is heading out to the grocery store, so his wife tells him 'get a gallon of milk, and if they have eggs, get a dozen.' He returns with 13 gallons of milk.",
					"In order to understand recursion you must first understand recursion.",
					"Coding Dojo'); DROP TABLE Students; --",
					"An SEO expert walks into a bar, pub, liquor store, brewery, alcohol, beer, whiskey, vodka",
					"How do you generate a random string? Put a first year CS student in front of VIM and tell him to save and exit.",
					"JavaScript is to Java like car is to carpet",
					"A testing engineer walks into a bar. Runs into a bar. Crawls into a bar. Dances into a bar. Tiptoes into a bar. Rams into a bar.",
					"There’s no place like 127.0.0.1.",
					".titanic { float : none; }",
					"Should array indices start at 0 or 1? My compromise of 0.5 was rejected without, I thought, proper consideration."]; 
	var quotes =["If Internet Explorer is brave enough to ask to be your default browser, you’re brave enough to ask that girl out.",
				 "It's not at all important to get it right the first time. It's vitally important to get it right the last time.",
				 "First, solve the problem. Then, write the code.",
				 "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
				 "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
				 "I don't care if it works on your machine! We are not shipping your machine!",
				 "To iterate is human, to recurse divine.",
				 "Perfection [in design] is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
				 "Talk is cheap. Show me the code.",
				 "Python's a drop-in replacement for BASIC in the sense that Optimus Prime is a drop-in replacement for a truck.",
				 "If you want to set off and go develop some grand new thing, you don't need millions of dollars of capitalization. You need enough pizza and Diet Coke to stick in your refrigerator, a cheap PC to work on and the dedication to go through with it.",
				 "Linux is only free if your time has no value."
				 ];
	//Master Object aka the Memory
	var memory = 
	{
		greeting: greetings,
		algorithm: algorithms,
		joke: jokes,
		quote: quotes
	}
	var randElem = function(arr)
	{
		var elem = arr[Math.floor(Math.random()*(arr.length))];
		return elem
	}
	//**************************************************** Setting Info to Display Based on Time ************************************************************
		console.log('the hour we have is',timeCheck);
		if(timeCheck < 10)
		{
			$scope.ai=randElem(memory.greeting[0]);
		}
		else if(timeCheck >= 18 && timeCheck <=5)
		{
			$scope.ai = randElem(memory.greeting[1]);
		}
		else if(timeCheck >= 10 && timeCheck <13)
		{
			$scope.ai = randElem(memory.quote);
		}
		else if(timeCheck == 13 || timeCheck == 16)
		{
			$scope.ai = randElem(memory.joke);
		}
		else{
			$scope.ai = randElem(memory.greeting[2]);
		}
	//************************** Apply proper sizing based on length of $scope.ai *******************
	var div_bottom = document.getElementById("bottom");
	if($scope.ai.length<=30)
	{
		div_bottom.innerHTML="<h1>"+$scope.ai+"</h1>";
	}
	else if($scope.ai.length<60)
	{
		div_bottom.innerHTML="<h2>"+$scope.ai+"</h2>";
	}
	else{
		div_bottom.innerHTML="<h3>"+$scope.ai+"</h3>";
	}
	}
	mirrorBrain();
	$interval(mirrorBrain,120000);

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