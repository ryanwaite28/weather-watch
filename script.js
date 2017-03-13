var map;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-div'), {
    center: {lat: 39.173303, lng: -77.177274},
    scrollwheel: false,
    zoom: 6
  });
  
  var infowindow = new google.maps.InfoWindow();
  
};


// Main Angular Application
var App = angular.module("myApp", []);
  
// Master Angular Controller
App.controller('masterCtrl', function($scope) {

	$scope.getGEO = function(){
		navigator.geolocation.getCurrentPosition(function(e){
			// console.log(e);
			var latlng_string = e.coords.latitude + ',' + e.coords.longitude;
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng_string + '&key=AIzaSyCSHPWjouiZzdAI_EhWkuuLsFMEGTgyYWE';
			$.get(url, function(data){
				// console.log(data);
				$scope.loadWeather(e, data);
			});
		});
	}

	$scope.loadWeather = function(e, data) {
		console.log('Loading Weather...');
		
		var locale = data.results[0].formatted_address;
		
		var weatherTimeout = setTimeout(function() {
			$('#message').text("Weather did not load successfully. Perhaps API has reached max usage or invalid search. Retry search or return in 24 hours.");
		}, 4000);
		
		// User Inputs
		var City = $('#city').val();
		var State = $('#state').val();
		
		
		var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + locale + '';
		$('body').append('<img class="bgimg" src="' + streetViewURL + '">');
		
		// AJAX for Weather Conditions 
		var conditionsAPI = 'https://api.wunderground.com/api/f44023fc37c557d4/conditions/q/' + locale + '.json';
		console.log(conditionsAPI);
		
		$.getJSON(conditionsAPI, function(data){
			console.log(data);
			
			var weather = data.current_observation;
			
			var latitude = weather.display_location.latitude;
			var longitude = weather.display_location.longitude;
			
			map = new google.maps.Map(document.getElementById('map-div'), {
				center: {lat: parseInt(latitude), lng: parseInt(longitude)},
				scrollwheel: false,
				zoom: 6
			});
		
			var marker = new google.maps.Marker({
				map: map,
				position: {lat: parseInt(latitude), lng: parseInt(longitude)},
				animation: google.maps.Animation.DROP,
			});
			
			var infoBox = '<div>' + '<h3>' + 'Display Location' + '</h3>' + '<p>' + locale + '</p>' + '</div>';
			
			var infowindow = new google.maps.InfoWindow();
			
			google.maps.event.addListener(marker, 'click', function() {
                console.log('click function working');
                infowindow.setContent(infoBox);
                map.setCenter(marker.position);
                infowindow.open(map, marker);
            });
			
			var iconURL = data.current_observation.icon_url;
			$('#img-icon').src = iconURL;
			$('#icon-img').src = iconURL;
			
			
			$scope.imgURL = iconURL;
			
			$scope.uv = weather.UV;
			$scope.dewpoint_string = weather.dewpoint_string;
			$scope.location = weather.display_location.full; console.log($scope.location);
			$scope.zip = weather.display_location.zip;
			$scope.elevation = weather.display_location.elevation;
			$scope.wmo = weather.display_location.wmo;
			$scope.country = weather.display_location.country;
			$scope.feelslike_string = weather.feelslike_string;
			$scope.forecastURL = weather.forecast_url;
			$scope.historyURL = weather.history_url;
			$scope.heat_index_string = weather.heat_index_string;
			$scope.icon = weather.icon;
			$scope.local_time = weather.local_time_rfc822;
			$scope.local_tz_long = weather.local_tz_long;
			$scope.local_tz_offset = weather.local_tz_offset;
			$scope.local_tz_short = weather.local_tz_short;
			$scope.obsLocFull = weather.observation_location.full;
			$scope.obsLocCountry = weather.observation_location.country;
			$scope.obsLocElevation = weather.observation_location.elevation;
			$scope.obsTime = weather.observation_time;
			$scope.precipHourString = weather.precip_1hr_string;
			$scope.precipDayString = weather.precip_today_string;
			$scope.pressureIN = + weather.pressure_in;
			$scope.pressureMB = weather.pressure_mb;
			$scope.pressureTrend = weather.pressure_trend;
			$scope.humidity = weather.relative_humidity;
			$scope.station = weather.station_id;
			$scope.temperatureString = weather.temperature_string;
			$scope.visionKM = weather.visibility_km;
			$scope.visionMI = weather.visibility_mi;
			$scope.weather = weather.weather;
			$scope.windDegrees = weather.wind_degrees;
			$scope.windDirection = weather.wind_dir;
			$scope.windGustKPH = weather.wind_gust_kph;
			$scope.windGustMPH = weather.wind_gust_mph;
			$scope.windGust = $scope.windGustKPH + '(KPH)' + ' | ' + $scope.windGustMPH + '(MPH) ' + 'Direction: ' + $scope.windDirection;
			$scope.windChill = weather.windchill_string;
			$scope.windString = weather.wind_string;
			
			$scope.forcastText = 'Click For Forcast';
			$scope.historyText = 'Click For History';
			
			$scope.logoImg = weather.image.url;
			
			$scope.$apply(function () {
				console.log("Done");
			});
			
			if($scope.location != '') {
				clearTimeout(weatherTimeout);
			}
			
		});
		
		// AJAX for Weather Alerts
		var alertsAPI = 'https://api.wunderground.com/api/f44023fc37c557d4/alerts/q/' + locale + '.json';
		
		$scope.alerts = [];
		
		$scope.alertInfo = '';
		
		$.getJSON(alertsAPI,function(data) {
			console.log(data);
			
			$scope.alertCount = data.alerts.length;
			
			for(var i = 0; i < data.alerts.length; i++) {
				
				var alert = data.alerts[i];
				
				var alertDate = alert.date;
				var alertDescription = alert.description;
				var alertMessage = alert.message;
				var alertExpires = alert.expires;
				
				$scope.queryZone = data.query_zone;
				
				$scope.alerts.push({
					date: alertDate,
					description: alertDescription,
					message: alertMessage,
					expires: alertExpires,
				});
				
			}
			
			if($scope.alertCount == 0) {
				$scope.alertInfo = "No Current Alerts";
			}
			
			$scope.$apply(function () {
				console.log($scope.alerts);
			});
			
		});
		
		// AJAX for Weather Astronomy
		var astronomyAPI = 'https://api.wunderground.com/api/f44023fc37c557d4/astronomy/q/' + locale + '.json';
		
		$.getJSON(astronomyAPI, function(data) {
			console.log(data);
			
			$scope.sunRise = data.sun_phase.sunrise.hour + ' : ' + data.sun_phase.sunrise.minute;
			$scope.sunSet = data.sun_phase.sunset.hour + ' : ' + data.sun_phase.sunset.minute;
			
			$scope.moonAge = data.moon_phase.ageOfMoon;
			$scope.currentTime = data.moon_phase.current_time.hour + ' : ' + data.moon_phase.current_time.minute;
			$scope.hemisphere = data.moon_phase.hemisphere;
			$scope.moonRise = data.moon_phase.moonrise.hour + ' : ' + data.moon_phase.moonrise.minute;
			$scope.moonSet = data.moon_phase.moonset.hour + ' : ' + data.moon_phase.moonset.minute;
			$scope.percentIlluminated = data.moon_phase.percentIlluminated;
			$scope.moonPhase = data.moon_phase.phaseofMoon;
			
		});
		
		//AJAX for Weather ForeCasts
		var foreCastAPI = 'https://api.wunderground.com/api/f44023fc37c557d4/forecast/q/' + locale + '.json';
		
		$.getJSON(foreCastAPI, function(data) {
			console.log(data);
			
			var len = data.forecast.txt_forecast.forecastday.length;
			
			$scope.forCasts = [];
			
			for(var i = 0; i < len; i++) {
				
				var foreCast = data.forecast.txt_forecast.forecastday[i];
				
				var forecastMessage = foreCast.fcttext;
				var forecastIcon = foreCast.icon;
				var forecastImg = foreCast.icon_url; 
				console.log(forecastImg);
				var forecastPeriod = foreCast.period;
				var forecastPop = foreCast.pop;
				var forecastDay = foreCast.title;
				
				$scope.forCasts.push({
					message: forecastMessage,
					icon: forecastIcon,
					img: forecastImg,
					period: forecastPeriod,
					pop: forecastPop,
					day: forecastDay,
				});
				
			}
			
			$scope.$apply(function () {
				console.log($scope.forCasts);
			});
			
		});
		
		//AJAX for Weather Satellite Images
		var satelliteAPI = 'https://api.wunderground.com/api/f44023fc37c557d4/satellite/q/' + locale + '.json';
		
		$.getJSON(satelliteAPI, function(data) {
			console.log(data);
			
			$scope.imgOne = data.satellite.image_url;
			$scope.imgTwo = data.satellite.image_url_vis;
			
			$scope.$apply(function () {
				console.log("Done");
			});
			
		});
		
		$scope.motionRadar = 'https://api.wunderground.com/api/f44023fc37c557d4/animatedradar/q/' + locale + '.gif?newmaps=1&timelabel=1&timelabel.y=10&num=5&delay=50';
		$scope.motionSatellite = 'https://api.wunderground.com/api/f44023fc37c557d4/animatedradar/animatedsatellite/q/' + locale + '.gif?num=6&delay=50&interval=30';
		
		//var webCamAPI = 'http://api.wunderground.com/api/f44023fc37c557d4/webcams/q/' + State + '/' + City + '.json';
	
	
	}
	
})
