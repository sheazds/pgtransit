// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

  .service("stopNearMeService", function ($http, $q)
  {
    var deferred = $q.defer();
    $http.get('resource/Stops.json').then(function (data)
    {
      deferred.resolve(data);
    });

    this.getCo = function ()
    {
      return deferred.promise;
    }
  })

  .service('locationService', function()
  {
    this.getLat = function()
    {
      return this.lat;
    }
    this.getLong = function()
    {
      return this.long;
    }
    this.setLat = function(lat)
    {
      this.lat = lat;
    }
    this.setLong = function(long)
    {
      this.long = long;
    }
  })

  .service("routeService", function ($http, $q)
  {
    var deferred = $q.defer();
    $http.get('resource/Routes.json').then(function (data)
    {
      deferred.resolve(data);
    });

    this.getRoutes = function ()
    {
      return deferred.promise;
    }
  })

  .service("stopService", function ($http, $q)
  {
    var deferred = $q.defer();
    $http.get('resource/newStop.json').then(function (data)
    {
      deferred.resolve(data);
    });

    this.getNewstop = function ()
    {
      return deferred.promise;
    }
  })

  .service("stopService1", function ($http, $q)
  {
    var deferred = $q.defer();
    $http.get('resource/Stops.json').then(function (data)
    {
      deferred.resolve(data);
    });

    this.getCo = function ()
    {
      return deferred.promise;
    }
  })

  .service("shareService", function () {
  var _routeID;

  // moving { to newline breaks app
  return {
      getRouteName: function ()
      {
        return _routeID;
      },
      setRouteName: function (id)
      {
        _routeID = id;
      }
    };
  })

  .service("favouritesService", function() {
    var favouritesService = this;
    favouritesService.favRoutes = [];

    return {
        getFavourites: function()
        {
            return favouritesService.favRoutes;
        },

        setFavourite: function(value)
        {
            favouritesService.favRoutes.push(value);
        },

        removeItem: function(value)
        {
            favouritesService.favRoutes.splice(favouritesService.favRoutes.indexOf(value), 1);
        },

        hasItem: function(value)
        {
            if (favouritesService.favRoutes.indexOf(value) > -1)
                return true;
            else
                return false;
        },

        saveFavs: function()
        {
            localStorage.setItem("favourites", JSON.stringify(favouritesService.favRoutes));
        },

        loadFavs: function()
        {
            if(localStorage.getItem("favourites")!==null)
            {
                favouritesService.favRoutes = JSON.parse(localStorage.getItem("favourites"));
            }
        }
    };

  })

  .run(function ($ionicPlatform, $cordovaSQLite)
  {
    $ionicPlatform.ready(function ()
    {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard)
      {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar)
      {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      // creating DB here
      db = $cordovaSQLite.openDB("name.db");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    });
  })

  .config(function ($stateProvider, $urlRouterProvider)
  {
    $stateProvider

      .state('app',
        {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
        })

	.state('app.mapLoad',
	{
	  url: '/mapLoad',
	  views:
	  {
      'menuContent':
      {
        templateUrl: 'templates/mapLoad.html',
        controller: 'MapLoadCtrl'
      }
	  }
	})

  .state('app.map',
  {
    url: '/map',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.settings',
    {
      url: '/settings',
      views:
      {
        'menuContent':
        {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })

  .state('app.contact',
  {
    url: '/contact',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/contact.html',
        controller: 'ContactCtrl'
      }
    }
  })

  .state('app.weather',
  {
    url: '/weather',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/weather.html',
        controller: 'WeatherCtrl'
      }
    }
  })

  .state('app.about',
  {
    url: '/about',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.nearMeLoad',
  {
    url: '/nearMeLoad',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/nearMeLoad.html',
        controller: 'NearMeLoadCtrl'
      }
    }
  })

  .state('app.nearMe',
  {
    url: '/nearMe',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/nearMe.html',
        controller: 'NearMeMapCtrl'
      }
    }
  })
  .state('app.nearMeMap',
  {
    url: '/nearMeMap',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/nearMeMap.html',
        controller: 'NearMeMapCtrl'
      }
    }
  })

  .state('app.schedule',
  {
    url: '/schedule',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/schedule.html'
      }
    }
  })

  .state('app.welcome',
  {
    url: '/welcome',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
      }
    }
  })

  .state('app.route',
  {
    url: '/route',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/route.html',
        controller: 'routeCtrl'
      }
    }
  })

  .state('app.route1',
  {
    url: '/route1',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/route1.html',
        controller: 'stopListCtrl'
      }
    }
  })

  .state('app.routeMap',
  {
    url: '/routeMap',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/routeMap.html',
        controller: 'RouteMapCtrl'
      }
    }
  })

  .state('app.favourites',
  {
    url: '/favourites',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/favourites.html',
        controller: 'favouritesCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
})
;
