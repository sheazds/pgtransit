angular.module('starter.controllers').controller('WeatherCtrl', function ($scope, $http, $ionicLoading)
{
    mixpanel.track("Weather", {"weather": 'WeatherCtrl'});
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
    $scope.forecast = {
        "list": [{
            "weather": [{"main": "", "description": "", "icon": ""}],
            "main": {"temp": ""},
            "wind": {"speed": "", "deg": ""}
        }]
    }

    //check if weather data doesn't exist or is outdated
    $scope.checkWeather = function ()
    {
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
            //Get Forcast
            $http.get('http://api.openweathermap.org/data/2.5/forecast?id=6113365&units=metric&appid=3d958a8a15a4158a118d8769e70c5461').success(function (response)
            {
                $scope.forecast = response;
                sessionStorage.setItem('forecastIcon', $scope.forecast.list[0].weather[0].icon);
                sessionStorage.setItem('forecastMain', $scope.forecast.list[0].weather[0].main);
                sessionStorage.setItem('forecastDescription', $scope.forecast.list[0].weather[0].description);
                sessionStorage.setItem('forecastTemp', $scope.forecast.list[0].main.temp);
                sessionStorage.setItem('forecastSpeed', $scope.forecast.list[0].wind.speed);
                sessionStorage.setItem('forecastDeg', $scope.forecast.list[0].wind.deg);
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
            $scope.forecast.list[0].weather[0].icon = sessionStorage.getItem('forecastIcon');
            $scope.forecast.list[0].weather[0].main = sessionStorage.getItem('forecastMain');
            $scope.forecast.list[0].weather[0].description = sessionStorage.getItem('forecastDescription');
            $scope.forecast.list[0].main.temp = sessionStorage.getItem('forecastTemp');
            $scope.forecast.list[0].wind.speed = sessionStorage.getItem('forecastSpeed');
            $scope.forecast.list[0].wind.deg = sessionStorage.getItem('forecastDeg');
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