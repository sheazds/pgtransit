angular.module('starter.controllers').controller('HomeCtrl', function ($scope, $state, $http, $ionicLoading, $ionicHistory, favouritesService)
{
  mixpanel.track("Home", {"home": 'HomeCtrl'});

  var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  $scope.getIconUrl = function (iconId)
  {
    return 'http://openweathermap.org/img/w/' + iconId + '.png';
  };

  $ionicLoading.show();

  //Initialize weather object
  $scope.weather = {
    "weather": [{"main": "", "description": "", "icon": ""}],
    "main": {"temp": ""},
    "wind": {"speed": "", "deg": ""}
  };

  //check if weather data doesn't exist or is outdated
  $scope.checkWeather = function ()
  {
    favouritesService.loadFavs();

    if (localStorage.getItem('loadToken') == null)
    {
      $ionicHistory.nextViewOptions(
        {
          disableBack: true
        });
      $state.go('app.welcome');
    }

    //If no time data exists or is more then 30 minutes out of date get new data
    if (sessionStorage.getItem('weatherTime') == null || ((new Date().getTime()) - sessionStorage.getItem('weatherTime')) > 900000)
    {
      //Get new weatherdata and store
      console.log("Getting new Weather Data");
      $http.get('http://api.openweathermap.org/data/2.5/weather?id=6113365&units=metric&appid=3d958a8a15a4158a118d8769e70c5461').success(function (response)
      {
        $scope.weather = response;
        sessionStorage.setItem('weatherIcon', $scope.weather.weather[0].icon);
        sessionStorage.setItem('weatherMain', $scope.weather.weather[0].main);
        sessionStorage.setItem('weatherDescription', $scope.weather.weather[0].description);
        sessionStorage.setItem('weatherTemp', $scope.weather.main.temp);
        sessionStorage.setItem('weatherSpeed', $scope.weather.wind.speed);
        sessionStorage.setItem('weatherDeg', $scope.weather.wind.deg);
        sessionStorage.setItem('weatherTime', new Date().getTime());
        $ionicLoading.hide();
      }).error(function (err)
      {
        $ionicLoading.show(
          {
            template: 'Could not load weather. Please try again later.',
            duration: 2000
          });
      });
    }
    else
    {
      console.log("Weather Data up to date");
      $scope.weather.weather[0].icon = sessionStorage.getItem('weatherIcon');
      $scope.weather.weather[0].main = sessionStorage.getItem('weatherMain');
      $scope.weather.weather[0].description = sessionStorage.getItem('weatherDescription');
      $scope.weather.main.temp = sessionStorage.getItem('weatherTemp');
      $scope.weather.wind.speed = sessionStorage.getItem('weatherSpeed');
      $scope.weather.wind.deg = sessionStorage.getItem('weatherDeg');
      $ionicLoading.hide();
    }
  }

  $scope.getDirection = function (degree)
  {
    if (degree > 338)
    {
      degree = 360 - degree;
    }
    var index = Math.floor((degree + 22) / 45);
    return directions[index];
  };
});