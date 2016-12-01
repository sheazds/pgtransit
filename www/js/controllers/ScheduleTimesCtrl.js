angular.module('starter.controllers').controller("ScheduleTimesCtrl", function ($scope, $state, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate, $ionicPlatform, shareService, favouritesService, stopService, timeService, shapeService, scheduleService, notificationService, $ionicPopup)
{
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.gotoRoute = function()
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.routeStops');
  }
  $scope.gotoMap = function()
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.routeMap');
  }

  $scope.setWeekend = function(type)
  {
    if(type != null) $scope.routeType = $scope.routeShort + type
    else $scope.routeType = $scope.routeShort
    shareService.setRouteType($scope.routeType);
    mixpanel.track("RouteType", {"Route Type":$scope.routeType});

    $ionicHistory.clearCache([$state.current.name]).then(function()
    {
      $state.reload();
    });
  };

  $scope.setReverse = function(type)
  {
    $scope.routeShort = type
    shareService.setRouteShort($scope.routeShort);
    mixpanel.track("RouteName", {"Route Name":$scope.routeShort});

    $ionicHistory.clearCache([$state.current.name]).then(function()
    {
      //$state.go('app.scheduleTimes');
      $state.reload();
    });
  };

  $scope.fullStops = [];
  $scope.stops = [];
  $scope.times = [];
  $scope.schedule = [];
  $scope.routeName = shareService.getRouteName();
  $scope.routeShort = shareService.getRouteShort();
  $scope.routeLong = shareService.getRouteLong();
  $scope.routeType = shareService.getRouteType();

  //Indicates which route has what types of stops
  var routeTypesIndex = [1, 5, 11, 15, "15-rev", 16, 17, 18, 46, 47, 55, 88, 89, 91, "91-rev", 96, 97];
  $scope.routeTypes = [/*1*/[11,"rv","sa","su"], /*5*/[55,"rv","sa"], /*11*/[1,"rv","sa","su"],
                      /*15*/["15-rev","rv","sa","su"], /*15-rev*/[15,"rv","sa","su"], /*16*/["sa","su"], /*17*/[18,"rv"],
                      /*18*/[17,"rv"], /*46*/[47,"rv","sa","su"], /*47*/[46,"rv"],
                      /*55*/[5,"rv","sa","su"], /*88*/[89,"rv","sa","su"], /*89*/[88,"rv","sa","su"],
                       /*91*/["91-rev","rv","sa","su"], /*91-rev*/[91,"rv","sa","su"], /*96*/[], /*97*/[]];

  $scope.ri = routeTypesIndex.indexOf($scope.routeShort);

  //If page is blank go home
  if($scope.routeName == null)
  {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.home');
  }

  $ionicPlatform.ready(function () {
    var promise1 = stopService.getNewstop($scope.routeShort);
    promise1.then(function (data1)
    {
      $scope.fullStops = data1.data;
      for (var i=0; i < $scope.fullStops.length; i++)
      {
        if($scope.fullStops[i].location_type == 1)
        {
          $scope.stops.push($scope.fullStops[i]);
        }
      }
    });

    var promise2 = timeService.getNewstop($scope.routeShort);
    promise2.then(function (data2)
    {
      $scope.times = data2.data;
    });

    var promise4 = scheduleService.getSchedule($scope.routeType);
    promise4.then(function (data4)
    {
      $scope.schedule = data4.data;
    })

    var promise3 = shapeService.getShapes($scope.routeShort);
    promise3.then(function (data3)
    {
      $scope.shapes = data3.data;
    })

    .then(function()
    {
      var lat = 0;
      var lon = 0;
      for (var i=0; i < $scope.stops.length; i++)
      {
        lat = lat + $scope.stops[i].stop_lat;
        lon = lon + $scope.stops[i].stop_lon;
      }
      lat = lat / $scope.stops.length;
      lon = lon / $scope.stops.length;

      var latLon = new google.maps.LatLng(lat, lon);

      var mapOptions =
      {
        center: latLon,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        liteMode: true,
        disableDefaultUI: true
      }

      var map = new google.maps.Map(document.getElementById("schedulemap"), mapOptions);

      //Add other Bus Stop Markers
      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (info)
      {
        var marker = new google.maps.Marker(
        {
          position: new google.maps.LatLng(info.stop_lat, info.stop_lon),
          map: map,
          animation: google.maps.Animation.DROP,
          title: info.stop_name + " " + info.stop_code,
          //title: info.stop_name,
          icon: 'http://maps.google.com/mapfiles/ms/micons/bus.png',
          optimized: false
        });
        google.maps.event.addListener(marker, 'click', function()
        {
          infoWindow.setContent(marker.title);
          infoWindow.open($scope.map, marker)
        });
      }
      //Get stops from Json
      for (var i=0; i < $scope.stops.length; i++)
      {
        createMarker($scope.stops[i]);
      }

      var poly = new google.maps.Polyline(
      {
        path: $scope.shapes,
        strokeColor: '#387ef5',
        strokeOpacity: 0.6,
        strokeWeight: 2
      }).setMap(map)
    })
  })

  $scope.editFavourite = function(stop)//Adds/removes favourite route.
  {
    if (favouritesService.hasItem(stop))
    {
      favouritesService.removeItem(stop);
      favouritesService.saveFavs();
      $ionicLoading.show(
      {
        template: stop.stop_name + ' removed from favourites.',
        duration: 1000
      })
    }
    else
    {
      favouritesService.setFavourite(stop);
      favouritesService.saveFavs();
      $ionicLoading.show(
      {
        template: stop.stop_name + ' added to favourites.',
        duration: 1000
      });
    }
  };

  $scope.addNotification = function(time)
  {
    if (!time.includes('--')) //Make sure we received a valid time.
    {
        var hms = time.split(/:| |F|U|V/); //5 Deliminators, : & " " & F & U & V:: Look at P??.

        //This filters out empty strings from our time.
        function checkArray(value) {
            if (value != "")
            return value;
        }
        //Filter the array.
        hms = hms.filter(checkArray);

        var timePrompt = hms.join(":"); //This is just to make the time appear without commas or any of the deliminators in the following popup.

        var popUp = $ionicPopup.confirm({

              title: 'Add a notification',
              //HTML Template for notification popup.
              template: '<center>Would you like to be reminded about the arrival of the<BR/>'
               + $scope.routeName + '<BR/> <select id="notifyReminder"><option>5</option><option>10</option><option selected>15</option><option>20</option><option>25</option><option>30</option></select>'
               + ' minutes before: ' + timePrompt + '<BR/><BR/>You can edit notification properties in the settings.</center>',
            })

        popUp.then(function (result) {
            if (result) //Add notification
            {
                if (notificationService.checkNotifications())
                {
                    var reminderTime = document.getElementById("notifyReminder").value;

                    //Convert to 24 hour format.
                    if (hms[hms.length -1] == "PM" && hms[0] != 12)
                        hms[0] = parseInt(hms[0]) + 12; //Add 12 to turn into 24 hour format.
                    else if (hms[hms.length -1] == "AM" && hms[0] == 12)
                        hms[0] = parseInt(hms[0]) - 12; //Subtract 12 to turn into 24 hour format.

                    //Create a new Date object for our notification.
                    var notifyDate = new Date();
                    notifyDate.setHours(hms[0]);
                    notifyDate.setMinutes(hms[1] - reminderTime);
                    notifyDate.setSeconds(0); //Reset seconds to correct notification timer.
                    console.log(notifyDate);

                    notificationService.scheduleNotificationLater('PG Buses', $scope.routeName + ' is due to arrive soon!', notifyDate, 1);
                }
                else //Cancels prompt.
                {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Notifications are disabled',
                        template: '<center>Notifications have been disabled in the application settings. Please enable them to add a notification.</center>'
                    });

                    alertPopup.then(function(res) {
                        console.log("Notifications are not enabled.");
                        $state.go('app.settings');
                    });
                }
            }
        })
    }
  }
});