// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

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

      .state('app.map',
      {
        url: '/map',
        views: {
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
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html'

          }
        }
      })
      .state('app.playlists',
        {
        url: '/playlists',
        views:
        {
          'menuContent':
          {
            templateUrl: 'templates/settings.html'
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
        views: {
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

      .state('app.currentLocation',
        {
        url: '/currentLocation',
        views:
        {
          'menuContent':
          {
            templateUrl: 'templates/currentLocation.html',
            controller: 'CurrentLocationCtrl'
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
    ;


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/welcome');
  })
;
