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
      this.getNewstop = function (stopRouteID)
      {
        var deferred = $q.defer();
        $http.get('resource/FilteredData/' + stopRouteID + '-PrinceGeorgeStops.json').then(function (data)
        {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
  })


  .service("timeService", function ($http, $q)
  {
    this.getNewstop = function (stopRouteID)
    {
      var deferred = $q.defer();
      $http.get('resource/FilteredData/' + stopRouteID + '-PrinceGeorgeStopTimes.json').then(function (data)
      {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  })

  .service("shapeService", function ($http, $q)
  {
    this.getShapes = function (ID)
    {
      var deferred = $q.defer();
      $http.get('resource/FilteredData/' + ID + '-Shapes.json').then(function (data)
      {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  })

  .service("scheduleService", function ($http, $q)
  {
    this.getSchedule = function (ID)
    {
      var deferred = $q.defer();
      $http.get('resource/FilteredData/' + ID + '-Schedule.json').then(function (data)
      {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  })


  .service("filteredStopService", function ($http, $q)
  {
    var getFilteredStops = function(route_id)
    {
      return $http.get('resource/FilteredData/' + route_id + 'Stops.json')
    }
    return {
      getFilteredStops: getFilteredStops
    }
  })

  .service("timesService", function ($http, $q)
  {
    var getTimes = function(route_id)
    {
      return $http.get('resource/FilteredData/' + route_id + 'StopTimes.json')
    }
    return {
      getTimes: getTimes
    }
  })

  .service("shareService", function ()
  {
    var _routeID;
    var _routeShort
    var _routeLong
    var _routeType
    var _stopID;


    // moving { to newline breaks app
    return {
      getRouteName: function ()
      {
        return _routeID;
      },
      setRouteName: function (id)
      {
        _routeID = id;
      },
      getRouteShort: function ()
      {
        return _routeShort;
      },
      setRouteShort: function (shortName)
      {
        _routeShort = shortName;
        _routeType = _routeShort;
      },
      getRouteType: function ()
      {
        return _routeType;
      },
      setRouteType: function (type)
      {
        _routeType = type;
      },
      getRouteLong: function ()
      {
        return _routeLong;
      },
      setRouteLong: function (longName)
      {
        _routeLong = longName;
      },
      getStopID: function() {
       return _stopID;
      },
      setStopID: function (id) {
        _stopID = id;
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
      for (i= 0; i < favouritesService.favRoutes.length; i++)
      {
        if (favouritesService.favRoutes[i].route_short_name === value.route_short_name)
          favouritesService.favRoutes.splice(i, 1);
      }
    },

    hasItem: function(value)
    {
      for (i= 0; i < favouritesService.favRoutes.length; i++)
      {
        if (favouritesService.favRoutes[i].route_short_name === value.route_short_name)
          return true;
      }
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

   //Notification service to to handle generic notifications from anywhere in the app. Can also schedule timed notifications.
  .service("notificationService", function($cordovaLocalNotification, $ionicPlatform, $state) {

    var notificationService = this;
    notificationService.notifyIcon = "";
    //notificationService.routes = []; //For keeping track of timed notifications should the user temporarily disable notifications.

    //Test to see if notifications are enabled.
    notificationService.checkNotifications = function()
    {
        if (JSON.parse(localStorage.getItem("Notifications")) == true) //Has the user enabled notifications in the settings?
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //Instant notification.
    notificationService.scheduleNotificationNow = function(header, message)
    {
        $ionicPlatform.ready(function ()
        {
            $cordovaLocalNotification.schedule(
            {
                id: 1, //ID doesn't matter because we won't be cancelling an instant notification.
                title: header,
                text: message,
                icon: notificationService.notifyIcon
            }).then(function (result) {
                console.log('Notification triggered');
            })
        })
    }

    //Timed notification.
    notificationService.scheduleNotificationLater = function(header, message, time, id, repeating)
    {
        var repeat;
        if (repeating)
            repeat = 'day';
        else
            repeat = 0; //System triggers notification only once.

        $ionicPlatform.ready(function ()
        {
            $cordovaLocalNotification.schedule(
            {
                id: id, //Important for unique, rescheduling notifications.
                title: header,
                text: message,
                at: time,
                every: repeat, //Repeat daily unless disabled.
                icon: notificationService.notifyIcon
            }).then(function (result) {
                console.log('Timed notification set for: ' + time + " Repeating daily = " + repeating);
            })
        })
    }

    //Cancel all queued notifications
    notificationService.cancelNotifications = function(id)
    {
        $cordovaLocalNotification.cancelAll(function () {
            alert("done");
        }).then(function (result) {
            console.log("Active notifications canceled.");
        })
    }

    notificationService.Initialize = function()
    {
        //First set the notification icon the app will use. Based on android OS version. (5+ turns icons into white only, so we need a fully transparent icon.
        console.log("Running android version: " + ionic.Platform.version());
        if (ionic.Platform.version() < 5)
            notificationService.notifyIcon = "notifyicon_4x.png";
        else
            notificationService.notifyIcon = "notifyicon.png";

        //Loads existing notification data into the app.
        //Currently not used.
        //if(localStorage.getItem("notifications")!==null)
        //{
        //    notificationService.routes = JSON.parse(localStorage.getItem("notifications"));
        //}
    }

    //The remainder functions are implemented for a master notification list should we add a display tab similar to favourites.
    /*
    notificationService.saveNotifications = function()
    {
        localStorage.setItem("notifications", JSON.stringify(notificationService.routes));
    }

    notificationService.removeItem = function(value)
    {
        for (i= 0; i < notificationService.routes.length; i++)
        {
            if (notificationService.routes[i].arrival_time === value.arrival_time)
                notificationService.routes.splice(i, 1);
        }
    }

    notificationService.hasItem = function(value)
    {
        for (i= 0; i < notificationService.routes.length; i++)
        {
            if (notificationService.routes[i].arrival_time === value.arrival_time)
                return true;
        }

        return false;
    }

    notificationService.getNotifications = function()
    {
       return notificationService.routes;
    }

    notificationService.setNotification = function(value)
    {
       notificationService.routes.push(value);
    }
    */

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
      //db = $cordovaSQLite.openDB("name.db");
      //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
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

  .state('app.home',
  {
    url: '/home',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
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
  .state('app.fares',
  {
    url: '/fares',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/fares.html'
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

  .state('app.routeStops',
  {
    url: '/routeStops',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/routeStops.html',
        controller: 'RouteStopsCtrl'
      }
    }
  })

  .state('app.stop',
  {
    url: '/stop',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/stop.html',
        controller: 'timesCtrl'
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

  .state('app.schedule',
  {
    url: '/schedule',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/schedule.html',
        controller: 'ScheduleCtrl'
      }
    }
  })

  .state('app.scheduleTimes',
  {
    url: '/scheduleTimes',
    views:
    {
      'menuContent':
      {
        templateUrl: 'templates/scheduleTimes.html',
        controller: 'ScheduleTimesCtrl'
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
  })

  .state('app.credits',
    {
      url: '/credits',
      views:
      {
        'menuContent':
        {
          templateUrl: 'templates/credits.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})
;
