    // Apps
    var app = angular.module('app', ['xeditable','ngRoute', 'angularRangeSlider', 'chart.js']);

    app.config(function($routeProvider, $locationProvider, $httpProvider){

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // Cache False
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.withCredentials = false;


        //Chart.defaults.global.defaultFontColor = '#464646';
        Chart.defaults.global.defaultFontColor = '#d2d2d2';
        Chart.defaults.global.defaultFontSize = 8;
        Chart.defaults.global.defaultFontFamily = "HelveticaNeueETPro-Medium"
        Chart.defaults.global.defaultFontStyle = 'normal';

        $routeProvider
            .when('/login',{templateUrl: 'partials/login.html',controller: 'LoginController'})
            .when('/home',{templateUrl: 'partials/home.html',controller: 'newHomeController'})
            .when('/event',{templateUrl: 'partials/event.html',controller: 'EventController'})
            .when('/service', {templateUrl: 'partials/service.html', controller: 'ServiceController'})
            .when('/pdumeteringsettings', {templateUrl: 'partials/PduMeteringSettings.html', controller: 'PduMeteringSettingsController'})
            .when('/about', {templateUrl: 'partials/about.html', controller: 'AboutController'})
            .when('/help', {templateUrl: 'partials/help.html', controller: 'HelpController'})
            .when('/metershome', {templateUrl: 'partials/metersHome.html', controller: 'metersHomeController'})
            .when('/metersbranch', {templateUrl: 'partials/metersBranch.html', controller: 'metersBranchController'})
            .when('/pdumeteringhome', {templateUrl: 'partials/PduMeteringHome.html', controller: 'PduMeteringHomeController'})
            .when('/pdumeteringmeters', {templateUrl: 'partials/PduMeteringMeters.html', controller: 'PduMeteringMetersController'})
            .when('/bcmhome', {templateUrl: 'partials/BcmHome.html', controller: 'BcmHomeController'})
            .when('/bcmmeters', {templateUrl: 'partials/BcmMeters.html', controller: 'BcmMetersController'})
            //.when('/bcmmetersbranchview', {templateUrl: 'partials/BcmMetersBranchView.html', controller: 'BcmMetersBranchViewController'})
            .when('/sfcmhome', {templateUrl: 'partials/SfcmHome.html', controller: 'SfcmHomeController'})
            .when('/sfcmmeters', {templateUrl: 'partials/SfcmMeters.html', controller: 'SfcmMetersController'})
            .otherwise({ redirectTo: '/index' });
        //$locationProvider.html5Mode(true);
    });

    app.run(function (editableOptions) {
        // For Editing the data
        editableOptions.theme = 'bs3';
    });

    // Directive

    app.directive('popOverDirective', function($compile) {
        return {
            restrict: 'EAC',
            template: '<a href="#/event" data-toggle="popover" data-placement="right" data-popover-content="#popOverContentId" data-popover-is-open="isOpen">'+
                        '<i class="fa fa-filter fa-lg" style="font-size: 20px;" aria-hidden="true"></i>'+
                      '</a>',
            link: function(scope, elements, attrs) {

                $("[data-toggle=popover]").popover({
                    'trigger': 'click',
                    'html': true,
                    'container': 'body',
                    content: function() {
                      var content = $(this).attr("data-popover-content");
                      return $compile($(content).children(".popover-body").html())(scope);
                    },
                    title: function() {
                      var title = $(this).attr("data-popover-content");
                      return $(title).children(".popover-heading").html();
                    }
                });	



            }
        }
    });

    app.directive('activeLink', ['$timeout', '$location', '$interval', '$rootScope',
      function($timeout, $location, $interval, $rootScope) {
        return {
          restrict: 'A',
          priority: -1,
          link: function(scope, iElem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var hrefs = ['/#' + $location.path(),
                             '#' + $location.path(), //html5: false
                             $location.path()]; //html5: true
                var hrefContext = 
                angular.forEach(iElem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().removeClass('inactive-link');
                        a.parent().addClass('active-link');
                    } else if(hrefs[2] != '/pdumeteringthermal' && hrefs[2] != '/bcmmetersbranchview' && hrefs[2] != '/pdumeteringhomecb'){
                        a.parent().removeClass('active-link');
                        a.parent().addClass('inactive-link');
                    }

                });

            });
          }
        };
      }
    ]);

    app.directive('bootstrapSwitch', [
        function() {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {

                    element.bootstrapSwitch();

                    element.on('switchChange.bootstrapSwitch', function(event, state) {
                        // To get name of current target of bootstrapSwitch
                        if (ngModel) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });

                    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
    ]);


    // Login Controller
    app.controller('LoginController', function($scope, $http, $timeout, $location, $rootScope, $interval) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        document.getElementById('inputUserId').text = '';
        $rootScope.titleHeader = '';
        $rootScope.titleSubHeader = '';
        $rootScope.titleSubHeaderIcon = '';
        $scope.isChangePassword = false;
        $rootScope.activeEventsDisplay = false;

        $scope.AuthCategory = function(){
                alert('auth');
        }

        $scope.changePasswordScreenOpen = function() {
            $scope.isChangePassword = true;
        }

        $scope.changePasswordScreenClose = function() {
            $scope.isChangePassword = false;
        }
    });

    // Main Controller
    app.controller('MainController', function($scope, $http, $timeout, $location, $rootScope, $interval) {		
        $rootScope.titleHeader = '';
        $rootScope.Day = '';
        $rootScope.Meridiem = '';
        $rootScope.titleSubHeaderIcon = './images/icons/icon-16/UI_Home_16.png';	
        $rootScope.activeEventsDisplay = false;		
        $scope.logo = ABB_LOGO_TYPE;
        $scope.versionNumber = VERSION;
        $scope.buildNumber = BUILDNUMBER;	
        $rootScope.routeFlow = {'home': 'home' , 'meters': '', 'settings': ''};	
        $location.url('/home');
        $rootScope.activeEventsDisplay = false;
        $scope.deviceAvailable = false;
        $scope.showPie = false;
        $rootScope.bgTheme = 'black';

        //service or function to bind the load pie chart and other information like energy, max. demand: START
        $scope.invokeHomeServices = function() {
            // Load Pie Chart Binding 
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
                .success(function(response) {
                    $scope.power = response.Load;
                    $scope.kW = response.kW;
                    $scope.showPie = true;

                    $scope.labelspie = [$scope.power.Total, 100-$scope.power.Total];
                    $scope.datapie = [$scope.power.Total, 100-$scope.power.Total];
                    $scope.colorspie = ["#0b74da", "#272727"];
                    $scope.optionspie = {
                                          responsive: false,
                                          rotation: 1 * (3/4*Math.PI),
                                          circumference: 1 * (3/2*Math.PI),
                                          cutoutPercentage: 86,
                                          elements: { arc: { 
                                                                borderWidth: 0,
                                                                borderColor: '#0b74da'
                                                            } 
                                                    },
                                           animation: false
                                    };
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Energy')
                .success(function(response) {
                    $scope.energy = response;

                }).catch(function (response){
                    $scope.networkFailure=true;
                });
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?ethernet')
                .success(function(response) {
                    $scope.networkDetails = response.Ethernet;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });	
            //MS - to fetch the Audio information - new reqmt to match LCD UI: START
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
                .success(function(response) {
                    $scope.sysConfigDetails = response.Genaral;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
            //MS - to fetch the Audio information - new reqmt to match LCD UI: END
            $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?status')
            .success(function(response) {
                $scope.showSystemState = true;
                $scope.systemState = response.status[0].status;
                switch($scope.systemState)
                {
                    case 'UNKNOWN':
                        $scope.systemStateSource = 'UnknownIcon';
                        break;

                    case 'ALARM':
                        $scope.systemStateSource = 'AlarmIcon';
                        break;

                    case 'WARNING':
                        $scope.systemStateSource = 'WarningIcon';
                        break;

                    case 'NORMAL':
                        $scope.systemStateSource = 'UI_Normal';
                        break;
                }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }
        //service or function to bind the load pie chart and other information like energy, max. demand: END
        // Setting the text for the Load Pie Chart: START
        Chart.pluginService.register({
          beforeDraw: function(chart) {

                // For Pie Chart
                if(chart.config.type == "doughnut" && chart.chart.canvas.id == "pduPieChart"){

                    var width = chart.chart.width,
                        height = chart.chart.height/1.25,
                        ctx = chart.chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#d2d2d2';

                    var fontSize = (height / 57).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Medium";

                    var text = $scope.kW.Total,
                            textX = Math.round((width - ctx.measureText(text).width)/2),
                            textY = height/2*1.5;
                    ctx.fillText(text, textX, textY);

                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    var text = "kW",
                            textX = Math.round((width - ctx.measureText(text).width)/2),
                            textY = height/2*2;
                    ctx.fillText(text, textX, textY);

                    ctx.save();

                }else if(chart.chart.canvas.id == "pduBar1" || chart.chart.canvas.id == "pduBar2"){

                    // Bar Chart Properties

                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 226).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#d2d2d2';


                    var text = "", 
                        textX = Math.round((width - ctx.measureText(text).width)/2)-85,
                        textY = height/2-50;

                    if(ctx.canvas.id == "bar1"){
                        ctx.moveTo(textX+45, textY+10);
                        ctx.lineTo(textX+125, textY+10);
                    }else{
                        ctx.moveTo(textX+45, textY+25);
                        ctx.lineTo(textX+125, textY+25);
                    }

                    ctx.strokeStyle = "#858585";
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    console.log(ctx);
                    if(ctx.canvas.id == "bar1"){
                        ctx.moveTo(textX+45, textY);
                        ctx.lineTo(textX+125, textY);
                    }else{
                        ctx.moveTo(textX+45, textY);
                        ctx.lineTo(textX+125, textY);
                    }
                    ctx.stroke();

                    ctx.fillText(text, textX+180, textY);

                    ctx.save();

                }
            }
        });
        // Setting the text for the Load Pie Chart: END

        $scope.invokeHomeServices();
        $scope.promiseHomeServices = $interval(function(){										
                                            $scope.invokeHomeServices();											
                                        }, DATADELAY);

        $scope.$on('$destroy', function () {
            $rootScope.bgTheme = 'white';
            $interval.cancel($scope.promiseHomeServices);
        });
        $scope.invokeTimeService = function() {
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();

            if(h<10)
              h="0"+h;
            if(m<10)
              m="0"+m;
            if(s<10)
              s="0"+s;
            if(h>12){
                h=h-12;
                $rootScope.Meridiem = 'PM';
            }else{
                $rootScope.Meridiem = 'AM';
            }
            $rootScope.time = h+ ":" + m;		
            var year = d.getFullYear();

            var day = d.getDay();

            switch(day){			
                case 0:
                    $rootScope.Day = 'Sunday';
                    break;
                case 1:
                    $rootScope.Day = 'Monday';
                    break;
                case 2:
                    $rootScope.Day = 'Tuesday';
                    break;
                case 3:
                    $rootScope.Day = 'Wednesday';
                    break;
                case 4:
                    $rootScope.Day = 'Thursday';
                    break;
                case 5:
                    $rootScope.Day = 'Friday';
                    break;
                case 6:
                    $rootScope.Day = 'Saturday';
                    break;

            }

            var d = d.toString();
            $rootScope.customDate=d.slice(0,3)+", "+d.slice(4,7)+" "+d.slice(8,10)+" "+year;
            $rootScope.customDateShort = d.slice(8,10)+" "+d.slice(4,7)+" "+year;
        }
        //MS - API call to fetch the date and time: START
        $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?meters?datetime')
             .success(function(response) {
                $rootScope.dateAndTime = response.DateTime;			
            }).catch(function (response){
                $scope.networkFailure=true;
            });
        //MS - API call to fetch the date and time: END
        $scope.invokeTimeService();
        $interval(function () {
            $scope.invokeTimeService();
        }, TIMEDELAY);

       // Route to Avtive Events Page from Dashboard
       $scope.routeActiveEvents = function(){
           $rootScope.activeEventsDisplay = true;
       }

       // Route to Home Page when the back button is clicked
       $scope.routeHomePage = function(){
           $rootScope.routeFlow = {'home': 'home' , 'meters': '', 'settings': ''};
           $location.url('/home');
       }

       // API call to show number of Active Events
       $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size)
             .success(function(response) {
                $rootScope.eventCounter = response.event[1].Activecnt;
                if($rootScope.eventCounter>0){
                    $("#active-event-counter-id").removeClass("event-notify-hide");
                }else{
                    $("#active-event-counter-id").addClass("event-notify-hide");
                }			
            }).catch(function (response){
                $scope.networkFailure=true;
            });

       $scope.invokeStatusService = function() {
           $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?status')
            .success(function(response) {
                $scope.systemState = response.status[0].status;
                switch($scope.systemState)
                {
                    case 'UNKNOWN':
                        $scope.systemStateSource = 'UnknownIcon';
                        break;

                    case 'ALARM':
                        $scope.systemStateSource = 'AlarmIcon';
                        break;

                    case 'WARNING':
                        $scope.systemStateSource = 'WarningIcon';
                        break;

                    case 'NORMAL':
                        $scope.systemStateSource = 'UI_Normal';
                        break;
                }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?sysInfo')
                .success(function(response) {
                    $scope.aboutInfo = response.info;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?ethernet')
                .success(function(response) {
                    $scope.networkDetails = response.Ethernet;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });	
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
                .success(function(response) {
                    $scope.rating = response.Rating;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }

        $scope.invokeStatusService();
        $interval(function () {
            $scope.invokeStatusService();
        }, DATADELAY);

    });
    //MS - Home Controller: START

    app.controller('newHomeController', function ($scope, $rootScope, $http, $q, $timeout, $location, $interval) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'Power Distribution';
        var sfcmCount = 0;
        var sfCount = 0;
        var bcmCount = 0;
        var deviceStatusObj;
        var objPDU;
        var objBCM;
        var objSFCM;
        var bcmPanelOnArr = [];
        var sfcmPanelOnId;
        var sfcmPanelOnArr = [];
        var subFeedNonZeroId;
        var subfeedNonZeroArr = [];
        var subFeedStatus;
        var SFCMSubfeedStatusArr = [];
        $rootScope.bcmDeviceLabel;
        $rootScope.bcmDeviceLabelArr = [];
        var subfeedNum = 0;
        //subfeed object creation :START
        var subfeeds =   {"Subfeed":[]};
        var subfeedObj = {
		    "panelId": sfcmPanelOnId,
            "finalSubFeed": []
		}
		var subfeedId = {
	      "subFeedId": subFeedNonZeroId,
	      "subFeedStatus": subFeedStatus
	    };
        //subfeed object creation :END
        
        function bcmDeviceLabel(bcmDeviceId, bcmPanelOnId)
        {
            for(var bcmPanelOn = 0;bcmPanelOn < bcmPanelOnArr.length;bcmPanelOn++){
              $rootScope.bcmDeviceLabel = bcmDeviceId + "/" + bcmPanelOnArr[bcmPanelOn];
              console.log("BCM Label:"+$rootScope.bcmDeviceLabel);
              $rootScope.bcmDeviceLabelArr.push($rootScope.bcmDeviceLabel);
              console.log($rootScope.bcmDeviceLabelArr);
          }
        }
        
        $scope.identifyBCM = function(bcmDevice)
        { 
            var defer1 = $q.defer();
            var bcmPanel = [1,2,3,4];
            var bcmPromises = [];
            function pushBcmPanelOn(bcmPanel){
                bcmPanelOnArr.push(bcmPanel);
            }
            bcmPanel.forEach(function(b){
                console.log(b);
                bcmPromises.push($http.get("http://" + HOSTNAME + ":" + PORT + "/getdata.cgi?meters?PanelConfig/submeters/" + parseInt(bcmDevice.Id)+"/"+b))
            });
            var bcmPanelOnCount = $q.all(bcmPromises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var bcmPanelResponse = results[i].data;
                    console.log(bcmPanelResponse);
                    if(bcmPanelResponse.PanelConfig.OnOff === "On"){
                       bcmCount++;
                       pushBcmPanelOn(i+1);
                       console.log(bcmCount);
                    }
                }
                bcmDeviceLabel(bcmDevice.Id,bcmPanelOnArr);
                console.log(bcmCount);
                return bcmCount;
            },function(results) {
              var bcmPanelResponse = results;
          });
          defer1.resolve(bcmPanelOnCount);
         return defer1.promise;
        }
        
        $scope.identifySFCM = function(sfcmDevice) 
        {   
            var defer2 = $q.defer();
            var sfcmPanel = [1,2,3,4];
            var sfcmPromises = [];
            
            function pushSfcmPanelOn(sfcmPanel){
                subfeeds.Subfeed.push(sfcmPanel);
            } 
            sfcmPanel.forEach(function(s){
                console.log(s);
                sfcmPromises.push($http.get("http://" + HOSTNAME + ":" + PORT + "/getdata.cgi?meters?SubfeedSystemData/submeters/" + parseInt(sfcmDevice.Id)+"/"+s))
            });
            var sfcmPanelOnCount = $q.all(sfcmPromises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var sfcmPanelResponse = results[i].data;
                    console.log(sfcmPanelResponse);
                    if(sfcmPanelResponse["Config"]["On-Off"] === "On"){
                       sfcmCount++;
                       var url = results[i].config.url;
                       var arr = url.split("/");
                       var panelOnId = arr.pop();
                        subfeedObj = {
                           "panelId": panelOnId,
                            "finalSubFeed": []
                       }
                       pushSfcmPanelOn(subfeedObj);
                    }
                }
                return sfcmPanelOnArr;
            },function(results) {
              var sfcmPanelResponse = results;
          });
          defer2.resolve(sfcmPanelOnCount);
         return defer2.promise;
        }
        
        var subFeedNumTestArr = [];
        
        $scope.identifySFOnCTScale = function(sfcmDevice,sfcmPanelOnId){
            var defer3 = $q.defer();
            var subfeedNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
            var promises = [];
            //to pass this object - for drawing the SF only 8 per panel
            function pushsubFeedNumTest(sfcmPanel,subfeedNum){
                for(var i = 0;i <= subfeeds.Subfeed.length-1;i++){
                    if(parseInt(sfcmPanel) === parseInt(subfeeds.Subfeed[i].panelId)){
                      subfeeds.Subfeed[i].finalSubFeed.push(subfeedNum);  
                    }
                }
            }
            for(var sfcmPanelOn = 0;sfcmPanelOn <= subfeeds.Subfeed.length-1;sfcmPanelOn++){ 
                subfeedNum.forEach(function(sf){
                    console.log(sf);
                    promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedFactoryConfig/submeters/'+parseInt(sfcmDevice.Id)+'/'+parseInt(subfeeds.Subfeed[sfcmPanelOn].panelId)+'/'+sf))
                });
            }
            var sfCountOnCTScale = $q.all(promises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var sfResponse = results[i].data;
                    //console.log(sfResponse);
                    //console.log('Subfeed value - '+JSON.stringify(results[i].config.url));
                    if(sfResponse.SubfeedFactoryConfig.LineCTScale != 0){
                       var url = results[i].config.url;
                       var arr = url.split("/");
                       var subfeedNonZeroId = arr.pop();
                       var sfcmPanelNum = arr.pop();
                       subfeedId = {
                           "subFeedId": subfeedNonZeroId,
                           "subFeedStatus": subFeedStatus
                       }
                       //subfeedObj.finalSubfeed.push(subfeedId);
                        //subfeeds.Subfeed.push(subfeedObj.finalSubfeed);
                        /*var subfeedIdObj = {
						  "panelId": sfcmPanelNum,
                            "subFeedId": subfeedNonZeroId
						};*/
					   //pushsubFeedNumTest(subfeedIdObj);
                       pushsubFeedNumTest(sfcmPanelNum,subfeedId);
                    }
                }
                console.log(subfeeds);
                return subfeedObj;
            })
            defer3.resolve(sfCountOnCTScale);
            return defer3.promise;
        }
        
        $scope.identifySFStatus = function(sfcmDevice,subfeed){
            var subfeedNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
            var defer4 = $q.defer();
            var promises = [];
            function pushSubFeedStatus(sfcmPanel,subfeedNo,subfeedStat){
                for(var i = 0;i <= subfeeds.Subfeed.length-1;i++){
                    for(var j=0;j <= subfeeds.Subfeed[i].finalSubFeed.length-1;j++){
                        if(parseInt(sfcmPanel) === parseInt(subfeeds.Subfeed[i].panelId) && parseInt(subfeedNo) === parseInt(subfeeds.Subfeed[i].finalSubFeed[j].subFeedId)){
                          subfeeds.Subfeed[i].finalSubFeed[j].subFeedStatus = subfeedStat.subFeedStatus;  
                        }
                    }
                }
            }
              for(var i=0;i <= subfeeds.Subfeed.length-1;i++){
                  for(var j=0;j <= subfeeds.Subfeed[i].finalSubFeed.length-1;j++){ 
                    //console.log('identifySFStatus sf value - '+JSON.stringify(sf));
                    //promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters'+'/'+parseInt(sfcmDevice.Id)+'/'+parseInt(sfcmPanelOnId[sfcmPanelOn])+'/'+sf))
                    promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters'+'/'+parseInt(sfcmDevice.Id)+'/'+parseInt(subfeeds.Subfeed[i].panelId)+'/'+parseInt(subfeeds.Subfeed[i].finalSubFeed[j].subFeedId)))
                  }
                }
            var sfStatus = $q.all(promises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var sfStatusResponse = results[i].data;
                    //console.log(results[i].config.url);
                    //console.log(sfStatusResponse);
                    var url = results[i].config.url;
                    var arr = url.split("/");
                    var subfeedNonZeroId = arr.pop();
                    var sfcmPanelNum = arr.pop();
                    subfeedId = {
                           "subFeedId": subfeedNonZeroId,
                           "subFeedStatus": sfStatusResponse.Others.Status
                       }
                    pushSubFeedStatus(sfcmPanelNum,subfeedNonZeroId,subfeedId);
                }
                /*results.forEach(function(data){
                    var sfStatusResponse = data.data;
                    var url = results[i].config.url;
                    SFCMSubfeedStatusArr.push(sfStatusResponse.Others.Status);
                });*/
                console.log(subfeeds);
                return subfeedId;
            })
            defer4.resolve(sfStatus);
            return defer4.promise;
            
        }
        
        //1. function to get the response of the devices connected: START
        $scope.invokeDeviceStatusService = function() {
               var deferred = $q.defer();
               //var promises = [];
               //promises.push($http.get("http://" + HOSTNAME + ':' + PORT + "/getdata.cgi?devicestatus"));
               var promise = $http.get("http://" + HOSTNAME + ':' + PORT + "/getdata.cgi?devicestatus");
               var deviceStatus = promise.then(function(results){
                   var networkFailure = false;
                  deviceStatusObj = results.data;
                  console.log(results.data);
                  console.log(deviceStatusObj.devicestatus.length);  
                  for(var i = deviceStatusObj.devicestatus.length - 1;i >=0; i--){
                        switch(deviceStatusObj.devicestatus[i].Type)
                        {
                            case "PDU":
                            objPDU = deviceStatusObj.devicestatus[i];
                            break;
                            case "BCM":
                            objBCM = deviceStatusObj.devicestatus[i];
                            break;
                            case "SFCM":
                            objSFCM = deviceStatusObj.devicestatus[i];
                            break;
                        }
                    }
                   return deviceStatusObj;
                   }, function(results) {
                      networkFailure = true;
                      return results.data;
                  });
                  deferred.resolve(deviceStatus);
                 return deferred.promise;
          }
       //1. function to get the response of the devices connected: END
        
        $scope.svg_pduLoad = function(){
                var svg_pdu = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                svg_pdu.setAttribute("viewBox","0 0 210 220");
                svg_pdu.setAttribute("preserveAspectRatio","xMidYMid meet");
                svg_pdu.setAttribute("version","1.1");
                svg_pdu.setAttribute("class","pdu");
                $("#pdu-container").append(svg_pdu);
                //pdu middle lines
                var middleLineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                middleLineGroup.setAttribute("id","pdu-middle-lines"); //Set g's id
                svg_pdu.append(middleLineGroup);
                var middleLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                middleLine1.setAttribute("d","M 44.252753,135.45093 C 164.95305,133.94576 167.4503,134.69835 167.4503,134.69835 h -1.66482"); //Set path's data
                middleLine1.setAttribute("style","fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.84947181;"); //Set path's styles
                var middleLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                middleLine2.setAttribute("d","M 44.045541,139.09776 C 165.15194,137.59445 167.65759,138.3461 167.65759,138.3461 h -1.67043"); //Set path's data
                middleLine2.setAttribute("style","fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.85249639;"); //Set path's styles
                var pduMiddleLinesGroup = document.getElementById("pdu-middle-lines");
                pduMiddleLinesGroup.append(middleLine1);                                        pduMiddleLinesGroup.append(middleLine2);
                /***********pdu top part***********/
                var pduTopGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduTopGroup.setAttribute("id","pdu-top"); //Set g's id
                svg_pdu.append(pduTopGroup);
                //pdu top center line
                var pduTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                pduTopLine.setAttribute("y","27.848412");                   
                pduTopLine.setAttribute("x","105.15416");
                pduTopLine.setAttribute("height","81.10318");                    pduTopLine.setAttribute("width","1.812");
                pduTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                pduTopGroup.append(pduTopLine);
                /***********pdu top left curves***********/
                var pduTopLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduTopLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                svg_pdu.append(pduTopLeftCurveGroup);
                var topLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                topLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var topLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                topLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var topLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                topLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                pduTopLeftCurveGroup.append(topLeftCurve1);                    pduTopLeftCurveGroup.append(topLeftCurve2);
                pduTopLeftCurveGroup.append(topLeftCurve3);
                /***********pdu top right curves***********/
                var pduTopRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduTopRightCurveGroup.setAttribute("id","pdu-top-right-curve"); //Set g's id
                pduTopRightCurveGroup.setAttribute("transform","translate(57.466688,0.87762149)");
                svg_pdu.append(pduTopRightCurveGroup);
                var topRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                topRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var topRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                topRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var topRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                topRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                topRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                pduTopRightCurveGroup.append(topRightCurve1);                    pduTopRightCurveGroup.append(topRightCurve2);
                pduTopRightCurveGroup.append(topRightCurve3);

                /***********pdu bottom part***********/
                var pduBottomGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduBottomGroup.setAttribute("id","pdu-bottom"); //Set g's id
                svg_pdu.append(pduBottomGroup);
                //pdu bottom center line
                var pduBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                pduBottomLine.setAttribute("y","161.75018");                   
                pduBottomLine.setAttribute("x","105.05904");
                pduBottomLine.setAttribute("height","81.10318");                    pduBottomLine.setAttribute("width","1.812");
                pduBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                pduBottomGroup.append(pduBottomLine);
                /***********pdu bottom left curves***********/
                var pduBottomLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduBottomLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                pduBottomLeftCurveGroup.setAttribute("transform","rotate(180,77.216618,134.91208)");
                svg_pdu.append(pduBottomLeftCurveGroup);
                var bottomLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                bottomLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var bottomLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                bottomLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var bottomLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                bottomLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                pduBottomLeftCurveGroup.append(bottomLeftCurve1);                    pduBottomLeftCurveGroup.append(bottomLeftCurve2);
                pduBottomLeftCurveGroup.append(bottomLeftCurve3);
                /***********pdu bottom right curves***********/
                var pduBottomRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                pduBottomRightCurveGroup.setAttribute("id","pdu-bottom-right-curve"); //Set g's id
                pduBottomRightCurveGroup.setAttribute("transform","rotate(180,106.04625,134.91214)");
                svg_pdu.append(pduBottomRightCurveGroup);
                var bottomRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                bottomRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var bottomRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                bottomRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                var bottomRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                bottomRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                bottomRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                pduBottomRightCurveGroup.append(bottomRightCurve1);                    pduBottomRightCurveGroup.append(bottomRightCurve2);
                pduBottomRightCurveGroup.append(bottomRightCurve3);
                //voltage symbol: START
                var pduVoltageSign = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                pduVoltageSign.setAttribute("d","m 61.232141,60.764882 -9.378412,0.122962 4.582717,-8.183423 z");
                pduVoltageSign.setAttribute("style","opacity:1;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.61626506;");
                pduVoltageSign.setAttribute("transform","matrix(1.0118631,0,0,1.2312215,-26.963536,47.692866)");
                svg_pdu.append(pduVoltageSign);
                //voltage symbol : END
                //letter Y : START
                var pduYLetter = document.createElementNS("http://www.w3.org/2000/svg",'text');
                pduYLetter.setAttribute("style","font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
                pduYLetter.setAttribute("transform","scale(1.0028955,0.99711289)");
                pduYLetter.setAttribute("x",'25.997938');
                pduYLetter.setAttribute("y",'163.35176');
                svg_pdu.append(pduYLetter);
                var pduYLetterText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                pduYLetterText.setAttribute("id",'pduLabelText');
                pduYLetter.append(pduYLetterText);
                pduLabelText.textContent = "Y";
                pduYLetterText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke-width:0.40014985");
                //letter Y : END
                return svg_pdu;
            }
        $scope.svg_pduWithLineLoad = function(deviceStatus){
                             var svg_pduWithLine = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                            svg_pduWithLine.setAttribute("viewBox","0 0 210 127");
                            svg_pduWithLine.setAttribute("preserveAspectRatio","xMidYMid meet");
                            svg_pduWithLine.setAttribute("version","1.1");
                            svg_pduWithLine.setAttribute("class","pdu");
                            $("#pdu-container").append(svg_pduWithLine);
                            //pdu middle lines
                            var pduWithLineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                            svg_pduWithLine.append(pduWithLineGroup);
                            var middleLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            middleLine1.setAttribute("d"," M 73.424044,73.59191 C 131.79521,72.875583 133.0029,73.233743 133.0029,73.233743 h -0.80512"); //Set path's data
                            middleLine1.setAttribute("style","stroke:#ffffff;stroke-width:0.84947181;"); //Set path's styles
                            var middleLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            middleLine2.setAttribute("d","m 73.407244,75.819138 c 58.414266,-0.716121 59.622836,-0.358065 59.622836,-0.358065 h -0.80572"); //Set path's data
                            middleLine2.setAttribute("style","stroke:#ffffff;stroke-width:0.85249639;"); //Set path's styles
                            pduWithLineGroup.append(middleLine1);                                        pduWithLineGroup.append(middleLine2);
                            /***********pdu top part***********/
                            var pduTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            pduTopLine.setAttribute("y","23.490372");                   
                            pduTopLine.setAttribute("x","103.16511");
                            pduTopLine.setAttribute("height","37.759335");                    pduTopLine.setAttribute("width","0.99060559");
                            pduTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                            pduWithLineGroup.append(pduTopLine);
                            //pdu bottom center line
                            var pduBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            pduBottomLine.setAttribute("y","86.88958");                   
                            pduBottomLine.setAttribute("x","102.76957");
                            pduBottomLine.setAttribute("height","37.759335");                    pduBottomLine.setAttribute("width","0.99060559");
                            pduBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                            pduWithLineGroup.append(pduBottomLine);
                            /***********pdu top left curves***********/
                            var pduTopLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                            pduTopLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                            pduTopLeftCurveGroup.setAttribute("transform","matrix(0.51306838,0,0,0.46557154,48.989756,9.9957783)");
                            svg_pduWithLine.append(pduTopLeftCurveGroup);
                            var topLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                            topLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var topLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                            topLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var topLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                            topLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            pduTopLeftCurveGroup.append(topLeftCurve1);                    pduTopLeftCurveGroup.append(topLeftCurve2);
                            pduTopLeftCurveGroup.append(topLeftCurve3);
                            /***********pdu top right curves***********/
                            var pduTopRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                            pduTopRightCurveGroup.setAttribute("id","pdu-top-right-curve"); //Set g's id
                            pduTopRightCurveGroup.setAttribute("transform","matrix(0.49276875,0,0,0.46557154,80.046454,9.8752073)");
                            svg_pduWithLine.append(pduTopRightCurveGroup);
                            var topRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                            topRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var topRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                            topRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var topRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            topRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                            topRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            pduTopRightCurveGroup.append(topRightCurve1);                    pduTopRightCurveGroup.append(topRightCurve2);
                            pduTopRightCurveGroup.append(topRightCurve3);

                            /***********pdu bottom part***********/

                            /***********pdu bottom left curves***********/
                            var pduBottomLeftCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                            pduBottomLeftCurveGroup.setAttribute("id","pdu-top-left-curve"); //Set g's id
                            pduBottomLeftCurveGroup.setAttribute("transform","matrix(-0.49953529,0,0,-0.46557154,127.53089,137.73486)");
                            svg_pduWithLine.append(pduBottomLeftCurveGroup);
                            var bottomLeftCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomLeftCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                            bottomLeftCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var bottomLeftCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomLeftCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                            bottomLeftCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var bottomLeftCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomLeftCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                            bottomLeftCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            pduBottomLeftCurveGroup.append(bottomLeftCurve1);                    pduBottomLeftCurveGroup.append(bottomLeftCurve2);
                            pduBottomLeftCurveGroup.append(bottomLeftCurve3);
                            /***********pdu bottom right curves***********/
                            var pduBottomRightCurveGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
                            pduBottomRightCurveGroup.setAttribute("id","pdu-bottom-right-curve"); //Set g's id
                            pduBottomRightCurveGroup.setAttribute("transform","matrix(-0.47698015,0,0,-0.46557154,154.02451,137.73491)");
                            svg_pduWithLine.append(pduBottomRightCurveGroup);
                            var bottomRightCurve1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomRightCurve1.setAttribute("d","m 86.303367,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274541,9.28542 l 0.450124,0.0149 a 8.8974716,11.489009 0 0 0 8.727094,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.315864,11.30576 l -0.529456,-0.0169 a 10.467615,13.495026 0 0 1 -9.786813,-11.28892 z"); //Set path's data
                            bottomRightCurve1.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var bottomRightCurve2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomRightCurve2.setAttribute("d","m 67.260005,108.07398 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274538,9.28542 l 0.45013,0.0149 a 8.8974716,11.489009 0 0 0 8.72709,-9.30021 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31586,11.30576 l -0.52946,-0.0169 a 10.467615,13.495026 0 0 1 -9.786812,-11.28892 z"); //Set path's data
                            bottomRightCurve2.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            var bottomRightCurve3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bottomRightCurve3.setAttribute("d","m 47.687472,108.07397 h 1.591604 a 8.8974716,11.489009 0 0 0 8.274542,9.28542 l 0.45012,0.0149 a 8.8974716,11.489009 0 0 0 8.7271,-9.3002 h 1.58877 a 10.467615,13.495026 0 0 1 -10.31587,11.30576 l -0.52945,-0.0169 a 10.467615,13.495026 0 0 1 -9.786816,-11.28892 z"); //Set path's data
                            bottomRightCurve3.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            pduBottomRightCurveGroup.append(bottomRightCurve1);                    pduBottomRightCurveGroup.append(bottomRightCurve2);
                            pduBottomRightCurveGroup.append(bottomRightCurve3);
                            //voltage and letter Y symbols: START
                            var pduVoltageSign = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            pduVoltageSign.setAttribute("id","pduVoltage");
                            pduVoltageSign.setAttribute("d","m 61.232141,60.764882 -9.378412,0.122962 4.582717,-8.183423 z");
                            pduVoltageSign.setAttribute("style","opacity:1;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.61626506;");
                            pduVoltageSign.setAttribute("transform","matrix(0.6692784,0,0,0.82590072,27.986742,17.654586)");
                            svg_pduWithLine.append(pduVoltageSign);
                            var pduYLetter = document.createElementNS("http://www.w3.org/2000/svg",'text');
                            pduYLetter.setAttribute("style","font-size:8px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
                            pduYLetter.setAttribute("transform","scale(0.94756847,1.0553327)");
                            pduYLetter.setAttribute("x",'66.86174');
                            pduYLetter.setAttribute("y",'84.010979');
                            svg_pduWithLine.append(pduYLetter);
                            var pduYLetterText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                            pduYLetterText.setAttribute("id",'pduLabelText');
                            pduYLetter.append(pduYLetterText);
                            pduYLetterText.textContent = "Y";
                            pduYLetterText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.40014985");
                            //voltage and letter Y symbols: END
                            //connector line
                            var pduConnectorLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            pduConnectorLine.setAttribute("y","124.38097");                   
                            pduConnectorLine.setAttribute("x","-15.493953");
                            pduConnectorLine.setAttribute("height","0.59938949");                    pduConnectorLine.setAttribute("width","500.52371");
                            pduConnectorLine.setAttribute("style","fill:#ffffff;")
                            svg_pduWithLine.append(pduConnectorLine);
                            switch(deviceStatus){
                                case 'ALARM':
                                svg_pduWithLine.setAttribute("style","stroke:red;stroke-width:0.65;");
                                break;
                                case 'WARNING':
                                svg_pduWithLine.setAttribute("style","stroke:orange;stroke-width:0.65;");
                                break;
                                case 'NORMAL':
                                svg_pduWithLine.setAttribute("style","stroke:green;stroke-width:0.65;");
                                break;
                                case 'UNKNOWN':
                                svg_pduWithLine.setAttribute("style","stroke:none;stroke-width:none;");
                                break;     
                            }
                            return svg_pduWithLine;
                        }
        $scope.svg_sfcmLoad = function(deviceStatus,deviceLabel){
                            var svgSFCMWrapper = document.createElement("div");
                           svgSFCMWrapper.setAttribute("class","sfcmWrapper");
                           $("#bs-container").append(svgSFCMWrapper);
                            var svg_sfcm = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                            svg_sfcm.setAttribute("viewBox","0 0 210 227");
                            svg_sfcm.setAttribute("preserveAspectRatio","");
                            svg_sfcm.setAttribute("version","1.1");
                            svg_sfcm.setAttribute("class","sfcm");
                            svgSFCMWrapper.append(svg_sfcm);
                            //sfcm top line
                            var sfcmTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            sfcmTopLine.setAttribute("y","0");                   
                            sfcmTopLine.setAttribute("x","102.76402");
                            sfcmTopLine.setAttribute("height","28.530001");                    sfcmTopLine.setAttribute("width","1.5119047");
                            sfcmTopLine.setAttribute("style","fill:#ffffff;fill-opacity:1;")
                            svg_sfcm.append(sfcmTopLine);
                            //sfcm connector
                            var sfcmConnector = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            sfcmConnector.setAttribute("d","m 102.76392,53.124103 v -2.11646 a 9.950645,11.831466 0 0 0 8.04212,-11.00311 l 0.0129,-0.59855 a 9.950645,11.831466 0 0 0 -8.05492,-11.60491 v -2.11268 a 11.688061,13.919373 0 0 1 9.79194,13.71759 l -0.0146,0.70404 a 11.688061,13.919373 0 0 1 -9.77737,13.01408 z"); //Set path's data
                            sfcmConnector.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            svg_sfcm.append(sfcmConnector);
                            //sfcm bottom line
                            var sfcmBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            sfcmBottomLine.setAttribute("y","52.449112");                   
                            sfcmBottomLine.setAttribute("x","102.76402");
                            sfcmBottomLine.setAttribute("height","101.29762");                    sfcmBottomLine.setAttribute("width","1.5119047");
                            sfcmBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                            svg_sfcm.append(sfcmBottomLine);
                            //sfcm label: START
                            var sfLabel = document.createElementNS("http://www.w3.org/2000/svg",'text');
                            sfLabel.setAttribute("style","font-size:16px;line-height:1.25;fill:#ffffff;fill-opacity:1;display:inline;");
                            sfLabel.setAttribute("x",'92.205734');
                            sfLabel.setAttribute("y",'175.00764');
                            svg_sfcm.append(sfLabel);
                            var sfLabelText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                            sfLabel.append(sfLabelText);
                            sfLabelText.textContent = "SF";
                            sfLabelText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.26458332");
                            var sfcmId = document.createElementNS("http://www.w3.org/2000/svg",'text');
                            sfcmId.setAttribute("style","font-size:16px;line-height:1.25;fill:#ffffff;fill-opacity:1;");
                            sfcmId.setAttribute("x",'94.205734');
                            sfcmId.setAttribute("y",'195.00764');
                            svg_sfcm.append(sfcmId);
                            var sfcmIdText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                            sfcmId.append(sfcmIdText);
                            sfcmIdText.setAttribute("id","sfcmLabelId");
                            sfcmIdText.textContent = deviceLabel;
                            //document.getElementById('bcmLabelId').setText(+$rootScope.bcmDeviceLabel);
                            sfcmIdText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.26458332");
                            //sfcm label: END
                            //to set sf color 
                            switch(deviceStatus){
                                case 'Alarm':
                                svg_sfcm.setAttribute("style","stroke:red;stroke-width:0.65;");
                                break;
                                case 'Warning':
                                svg_sfcm.setAttribute("style","stroke:orange;stroke-width:0.65;");
                                break;
                                case 'Normal':
                                svg_sfcm.setAttribute("style","stroke:green;stroke-width:0.65;");
                                break;
                                case 'Unknown':
                                svg_sfcm.setAttribute("style","stroke:none;stroke-width:none;");
                                break;     
                            }
                        }
        $scope.svg_bcmLoad = function(deviceStatus,deviceLabel){
                           var svgBCMWrapper = document.createElement("div");
                           svgBCMWrapper.setAttribute("class","bcmWrapper");
                           $("#bs-container").append(svgBCMWrapper);
                           var svg_bcm = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
                            svg_bcm.setAttribute("viewBox","0 0 210 227");
                            svg_bcm.setAttribute("preserveAspectRatio","xMidYMid meet");
                            svg_bcm.setAttribute("version","1.1");
                            svg_bcm.setAttribute("class","bcm");
                            svgBCMWrapper.append(svg_bcm);
                            //bcm top line
                            var bcmTopLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            bcmTopLine.setAttribute("y","0");                   
                            bcmTopLine.setAttribute("x","98.273804");
                            bcmTopLine.setAttribute("height","28.530001");                    bcmTopLine.setAttribute("width","1.5119047");
                            bcmTopLine.setAttribute("style","display:inline;fill:#ffffff;")
                            svg_bcm.append(bcmTopLine);
                            //bcm connector
                            var bcmConnector = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bcmConnector.setAttribute("d","m 98.273694,53.388681 v -2.11646 a 9.9506448,11.831466 0 0 0 8.042116,-11.003107 l 0.0129,-0.59855 a 9.9506448,11.831466 0 0 0 -8.054916,-11.60491 v -2.112682 a 11.688061,13.919373 0 0 1 9.791936,13.717592 l -0.0146,0.704038 a 11.688061,13.919373 0 0 1 -9.777368,13.014079 z"); //Set path's data
                            bcmConnector.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            svg_bcm.append(bcmConnector);
                            //bcm bottom line
                            var bcmBottomLine = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                            bcmBottomLine.setAttribute("y","50.830109");                   
                            bcmBottomLine.setAttribute("x","98.273804");
                            bcmBottomLine.setAttribute("height","60.529999");                    
                            bcmBottomLine.setAttribute("width","1.5119047");
                            bcmBottomLine.setAttribute("style","display:inline;fill:#ffffff;")
                            svg_bcm.append(bcmBottomLine);
                            //bcm bottom path 
                            var bcmBottomPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                            bcmBottomPath.setAttribute("d","M 263.11914 514.21094 L 263.11914 802.25586 L 485.45117 802.25586 L 485.45117 514.21094 L 263.11914 514.21094 z M 268.78906 519.88086 L 479.78125 519.88086 L 479.78125 796.58789 L 268.78906 796.58789 L 268.78906 519.88086 z "); //Set path's data
                            bcmBottomPath.setAttribute("style","display:inline;opacity:1;fill:#ffffff;fill-opacity:1;"); //Set path's styles
                            bcmBottomPath.setAttribute("transform","scale(0.26458333) translate(0,-100.87762149)");
                            //bcmBottomPath.setAttribute("transform","translate(57.466688,0.87762149)");
                            svg_bcm.append(bcmBottomPath);
                            //bcm label: START
                            var bcmLabel = document.createElementNS("http://www.w3.org/2000/svg",'text');
                            bcmLabel.setAttribute("style","font-size:16px;line-height:1.25;fill:#ffffff;fill-opacity:1;");
                            bcmLabel.setAttribute("x",'84.221443');
                            bcmLabel.setAttribute("y",'142.40659');
                            bcmLabel.setAttribute("transform","scale(0.96533658,1.0359081)");
                            svg_bcm.append(bcmLabel);
                            var bcmLabelText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                            bcmLabel.append(bcmLabelText);
                            bcmLabelText.textContent = "BCM";
                            bcmLabelText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.26458332");
                            var bcmId = document.createElementNS("http://www.w3.org/2000/svg",'text');
                            bcmId.setAttribute("style","font-size:16px;line-height:1.25;fill:#ffffff;fill-opacity:1;");
                            bcmId.setAttribute("x",'85.836708');
                            bcmId.setAttribute("y",'163.11371');
                            bcmLabel.setAttribute("transform","scale(0.96533658,1.0359081)");
                            svg_bcm.append(bcmId);
                            var bcmIdText = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
                            bcmId.append(bcmIdText);
                            bcmIdText.setAttribute("id","bcmLabelId");
                            bcmIdText.textContent = deviceLabel;
                            //document.getElementById('bcmLabelId').setText(+$rootScope.bcmDeviceLabel);
                            bcmIdText.setAttribute("style","fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.26458332");
                            //bcm label: END
                            switch(deviceStatus){
                                case 'ALARM':
                                svg_bcm.setAttribute("style","stroke:red;stroke-width:0.65;");
                                break;
                                case 'WARNING':
                                svg_bcm.setAttribute("style","stroke:orange;stroke-width:0.65;");
                                break;
                                case 'NORMAL':
                                svg_bcm.setAttribute("style","stroke:green;stroke-width:0.65;");
                                break;
                                case 'UNKNOWN':
                                svg_bcm.setAttribute("style","stroke:none;stroke-width:none;");
                                break;     
                            }

                        }
        
        //to create an array of finalSubfeed with only 8 per panel:START
        
        //to create an array of finalSubfeed with only 8 per panel:END
        
        $scope.drawCircuitBCM = function(){
            for(var b=0;b < bcmCount;b++){
                $scope.svg_bcmLoad(objBCM.devciestatus,$rootScope.bcmDeviceLabelArr[b]);
            }
        }
        
        $scope.editFinalSubfeedArr = function(){
                for(var i=0;i <= subfeeds.Subfeed.length-1;i++){
                    var newFinalSubFeedArr = [];
                    newFinalSubFeedArr = subfeeds.Subfeed[i].finalSubFeed;
                    newFinalSubFeedArr = newFinalSubFeedArr.slice(0,8);
                    console.log("sliced array:" +newFinalSubFeedArr);
                    subfeeds.Subfeed[i].finalSubFeed = newFinalSubFeedArr;
                    console.log(subfeeds.Subfeed[i].finalSubFeed);
                }
                //console.log(subfeeds);
            }
        
        $scope.drawCircuitSFCM = function(){
            $scope.editFinalSubfeedArr();
            for(var sfPanel=0;sfPanel < subfeeds.Subfeed.length;sfPanel++){
                for(var sf = 0;sf < subfeeds.Subfeed[sfPanel].finalSubFeed.length;sf++){
                   $scope.svg_sfcmLoad(subfeeds.Subfeed[sfPanel].finalSubFeed[sf].subFeedStatus,subfeeds.Subfeed[sfPanel].finalSubFeed[sf].subFeedId);
                }
            }
        }
        
        $scope.invokeDeviceStatusService()
            .then(function(data){
            console.log(objPDU);
            console.log(objBCM);
            console.log(objSFCM);
            if(deviceStatusObj.devicestatus.length === 1){
               $scope.svg_pduLoad(); 
            }
            else if(deviceStatusObj.devicestatus.length > 1){
                $scope.svg_pduWithLineLoad(objPDU.devciestatus);
            }
            else{
                $scope.noDeviceConnected = "No Device Connected";
            }
            $scope.identifyBCM(objBCM).then(function(results){
                $scope.drawCircuitBCM();
            }); 
            $scope.identifySFCM(objSFCM).then(function(results){
                $scope.identifySFOnCTScale(objSFCM,subfeeds).then(function(results){
                   $scope.identifySFStatus(objSFCM,subfeeds).then(function(results){
                       $scope.drawCircuitSFCM();
                   });
                });
            });
            
        });/*.then(function(results){
            $scope.resizeBCMandSFCM();
        });*/ //end of invokeDeviceStatusService function call
        
        //to retain the devices eg.,BCM,SFCM to viewable width even if the number is more: START
        /*$scope.resizeBCMandSFCM = function(){
            var totalDevices = bcmCount + sfCount;
            switch(totalDevices){
                case 1:
                    $('.bcmWrapper > svg').setAttribute('style','width:60%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:60%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:20%;');
                    break;
                case 2:
                    $('.bcmWrapper > svg').setAttribute('style','width:75%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:75%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:15%;');
                    break;
                case 3:
                    $('.bcmWrapper > svg').setAttribute('style','width:90%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:90%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:14%;');
                    break;
                case 4:
                    $('.bcmWrapper > svg').setAttribute('style','width:105%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:105%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:13.5%;');
                    break;
                case 5:
                    $('.bcmWrapper > svg').setAttribute('style','width:120%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:120%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:12%;');
                    break;
                case 6:
                    $('.bcmWrapper > svg').setAttribute('style','width:135%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:135%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:11.5%;');
                    break;
                case 7:
                    $('.bcmWrapper > svg').setAttribute('style','width:150%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:150%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:10%;');
                    break;
                case 8:
                    $('.bcmWrapper > svg').setAttribute('style','width:165%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:165%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:7.5%;');
                    break;
                case 8:
                    $('.bcmWrapper > svg').setAttribute('style','width:180%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:180%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:5%;');
                    break;
                case 10:
                    $('.bcmWrapper > svg').setAttribute('style','width:195%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:195%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:2.5%;');
                    break;
                case 11:
                    $('.bcmWrapper > svg').setAttribute('style','width:210%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:210%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:0%;');
                    break;
                case 12:
                    $('.bcmWrapper > svg').setAttribute('style','width:225%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:225%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-1.5%;');
                    break;
                case 13:
                    $('.bcmWrapper > svg').setAttribute('style','width:240%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:240%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-2.5%;');
                    break;
                case 14:
                    $('.bcmWrapper > svg').setAttribute('style','width:255%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:255%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-3.5%;');
                    break;
                case 15:
                    $('.bcmWrapper > svg').setAttribute('style','width:270%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:270%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-4%;');
                    break;
                case 16:
                    $('.bcmWrapper > svg').setAttribute('style','width:285%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:285%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-4%;');
                    break;
                case 17:
                    $('.bcmWrapper > svg').setAttribute('style','width:300%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:300%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-5.5%;');
                    break;
                case 18:
                    $('.bcmWrapper > svg').setAttribute('style','width:320%;');
                    $('.sfcmWrapper > svg').setAttribute('style','width:320%;');
                    $('.bs-columns-container').setAttribute('style','margin-left:-6.5%;');
                    break;
            }
            
        }*/
        
     });
    //MS - Home Controller: END

    app.controller('metersHomeController', function($scope, $http, $q, $timeout, $location, $interval, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'Power Distribution Meters';
        $rootScope.activeEventsDisplay = false;
        $scope.networkFailure=false;
        $scope.deviceAvailable = false;
        $scope.deviceConnected = false;
	    //global variables: START
        $scope.deviceStatusObj;
        $scope.objPDU;
        $scope.objBCM;
        $scope.objSFCM;
        /*var devices = {"Device":[]};
        var deviceType;
        var deviceId;
        var devicePanelOnNum;
        var deviceObj = {
            "deviceType": deviceType,
            "deviceId": deviceId,
            "devicePanelOn": []
        }
        var devicePanelOnId;
        var panelOnId = {
            "PanelOnId": devicePanelOnId
        }*/
        //$scope.devices = {"Device":[]};
        //main object creation: START
        $scope.devices = [];
        $scope.deviceType;
        $scope.deviceId;
        
        $scope.deviceActive;
        $scope.devicePanelOnNum;
        $scope.deviceObj = {
            "deviceType": $scope.deviceType,
            "deviceId": $scope.deviceId,
            "deviceActive": $scope.deviceActive,
            "devicePanelOn": []
        }
        $scope.devicePanelOnId;
        $scope.devicePanelOnData;
        $scope.devicePanelOnStatus;
        $scope.devicePanelStatus;
        $scope.panelOnId = {
            "PanelOnId": $scope.devicePanelOnId,
            "PanelOnLoad": [],
            "PanelOnStatus": [],
            "PanelOverallStatus": $scope.devicePanelStatus
        }
        var loadAvgArr = [];
        //main object creation: END
        //array object to be used to populate cards: START
        $scope.devicesArr = [];
        $scope.devType;
        $scope.devId;
        $scope.devPanelId;
        $scope.devActive;
        //$scope.devStatus;
        $scope.devPanelOnLoadData;
        $scope.deviceObjArr = {
            "deviceType": $scope.devType,
            "deviceId": $scope.devId,
            "devicePanelOn": $scope.devPanelId,
            "deviceActive": $scope.devActive
            //"deviceStatus": $scope.devStatus
        }
        //array object to be used to populate cards: END
        $scope.stringyDevicesArr;
	    //global variables: END
        
        //old invokeDeviceMeters funciton: START
	    /*$scope.invokeDeviceMeters = function(){
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?devicestatus')
			.success(function(response) {
				$scope.networkFailure=false;
				$scope.deviceAvailable=true;
				$scope.totalDevices = response.devicestatus;
				$scope.deviceStatusAll = [];				

				for(i=0; i<$scope.totalDevices.length; i++){

					if($scope.totalDevices[i].Active=='OK')
						$scope.totalDevices[i].Active='UI_Communication_24';
					else
						$scope.totalDevices[i].Active='UI_Lost_24';

					switch($scope.totalDevices[i].devciestatus)
					{
						case 'UNKNOWN':
							$scope.totalDevices[i].devciestatus = 'UnknownIcon';
							break;

						case 'ALARM':
							$scope.totalDevices[i].devciestatus = 'AlarmIcon';
							break;

						case 'WARNING':
							$scope.totalDevices[i].devciestatus = 'WarningIcon';
							break;

						case 'NORMAL':
							$scope.totalDevices[i].devciestatus = 'UI_Normal';
							break;
					}
					
					$scope.deviceStatusAll.push($scope.totalDevices[i]);
                    console.log($scope.deviceStatusAll);
				}		
				
				// Initial Route Flow Settings based on the first device if PDU, BCM or SFCM
				$rootScope.selectedDeviceId = $scope.deviceStatusAll[0].Id;
				switch($scope.deviceStatusAll[0].Type){
					case 'PDU':
						$rootScope.routeFlow = {'home': 'home' , 'meters': 'pdumeteringmeters', 'settings': 'pdumeteringsettings'};
						break;
					case 'BCM':
					case 'RPP':
						$rootScope.routeFlow = {'home': 'home' , 'meters': 'bcmmeters', 'settings': 'pdumeteringsettings'};
						break;
					case 'SFCM':							
						$rootScope.routeFlow = {'home': 'sfcmhome' , 'meters': 'sfcmmeters', 'settings': 'pdumeteringsettings'};
						break;						
				}
				
				// If only one device is connected the page is routed to the dashboard page of that device
				if($scope.deviceStatusAll.length == 1){
					switch($scope.deviceStatusAll[0].Type)
					{
						case 'PDU':
							$rootScope.routeFlow = {'home': 'pdumeteringhome' , 'meters': 'pdumeteringmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/pdumeteringhome');
							break;
						case 'RPP':
						case 'BCM':
							$rootScope.routeFlow = {'home': 'bcmhome' , 'meters': 'bcmmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/bcmhome');
							break;
						case 'SFCM':
							$rootScope.routeFlow = {'home': 'sfcmhome' , 'meters': 'sfcmmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/sfcmhome');
							break;
					}
				}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
	}*/
        //old invokeDeviceMeters funciton: END
        
        $scope.invokeDeviceMetersService = function(){
                var deferred = $q.defer();
               var promise = $http.get("http://" + HOSTNAME + ':' + PORT + "/getdata.cgi?devicestatus");
               var deviceStatus = promise.then(function(results){
                   $scope.deviceConnected = true;
                   var networkFailure = false;
                  $scope.deviceStatusObj = results.data;
                  console.log(results.data);
                  console.log($scope.deviceStatusObj.devicestatus.length);  
                  for(var i = $scope.deviceStatusObj.devicestatus.length - 1;i >=0; i--){
                        switch($scope.deviceStatusObj.devicestatus[i].Type)
                        {
                            case "PDU":
                            $scope.objPDU = $scope.deviceStatusObj.devicestatus[i];
                            break;
                            case "BCM":
                            $scope.objBCM = $scope.deviceStatusObj.devicestatus[i];
                            break;
                            case "SFCM":
                            $scope.objSFCM = $scope.deviceStatusObj.devicestatus[i];
                            break;
                        }
                        $scope.deviceObj = {
                                "deviceType": $scope.deviceStatusObj.devicestatus[i].Type,
                                "deviceId": $scope.deviceStatusObj.devicestatus[i].Id,
                                "deviceActive": $scope.deviceStatusObj.devicestatus[i].Active,
                                "devicePanelOn": []
                            }
                        $scope.devices.push($scope.deviceObj);
                        console.log($scope.devices);
                        //to assign the appropriate icon to show the respective device' status: START
                        
                        switch($scope.deviceStatusObj.devicestatus[i].devciestatus)
                        {
                            case 'UNKNOWN':
                                $scope.deviceStatusObj.devicestatus[i].devciestatus = 'UnknownIcon';
                                break;

                            case 'ALARM':
                                $scope.deviceStatusObj.devicestatus[i].devciestatus = 'AlarmIcon';
                                break;

                            case 'WARNING':
                                $scope.deviceStatusObj.devicestatus[i].devciestatus = 'WarningIcon';
                                break;

                            case 'NORMAL':
                                $scope.deviceStatusObj.devicestatus[i].devciestatus = 'UI_Normal';
                                break;
                        } 
                        //to assign the appropriate icon to show the respective device' status: END
                        if($scope.deviceStatusObj.devicestatus[i].Active=='OK')
                            $scope.deviceStatusObj.devicestatus[i].Active='UI_Communication_24';
                        else
                            $scope.deviceStatusObj.devicestatus[i].Active='UI_Lost_24';
                    }
                   return $scope.deviceStatusObj;
                   }, function(results) {
                      networkFailure = true;
                      return results.data;
                  });
                  deferred.resolve(deviceStatus);
                 return deferred.promise;
        }
        $scope.identifyBCMPanel = function(bcmDevice){
            var defer1 = $q.defer();
            var bcmPanel = [1,2,3,4];
            var bcmPromises = [];
            function pushBcmDevice(deviceId,devicePanel){
                for(var i=0;i <= $scope.devices.length-1;i++){
                    if(parseInt(deviceId) === parseInt($scope.devices[i].deviceId)){
                       $scope.devices[i].devicePanelOn.push(devicePanel);  
                    }
                   
                }
            }
            bcmPanel.forEach(function(b){
                console.log(b);
                bcmPromises.push($http.get("http://" + HOSTNAME + ":" + PORT + "/getdata.cgi?meters?PanelConfig/submeters/" + parseInt(bcmDevice.Id)+"/"+b))
            });
            var bcmPanelOn = $q.all(bcmPromises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var bcmPanelResponse = results[i].data;
                    console.log(bcmPanelResponse);
                    if(bcmPanelResponse.PanelConfig.OnOff === "On"){
                       var url = results[i].config.url;
                       var arr = url.split("/");
                       $scope.panelId = arr.pop();
                        $scope.panelOnId = {
                            "PanelOnId": $scope.panelId,
                            "PanelOnLoad": $scope.devicePanelOnData,
                            "PanelOnStatus": [],
                            "PanelOverallStatus": $scope.devicePanelStatus
                        }
                       pushBcmDevice(bcmDevice.Id,$scope.panelOnId);
                    }
                }
                console.log($scope.devices);
                return $scope.panelOnId;
            },function(results) {
              var bcmPanelResponse = results;
          });
          defer1.resolve(bcmPanelOn);
         return defer1.promise;
        }
        $scope.identifySFCMPanel = function(sfcmDevice){
            var defer1 = $q.defer();
            var sfcmPanel = [1,2,3,4];
            var sfcmPromises = [];
            function pushSfcmDevice(deviceId,devicePanel){
                for(var i=0;i <= $scope.devices.length-1;i++){
                    if(parseInt(deviceId) === parseInt($scope.devices[i].deviceId)){
                       $scope.devices[i].devicePanelOn.push(devicePanel);  
                    }
                   
                }
            }
            sfcmPanel.forEach(function(s){
                console.log(s);
                sfcmPromises.push($http.get("http://" + HOSTNAME + ":" + PORT + "/getdata.cgi?meters?SubfeedSystemData/submeters/" + parseInt(sfcmDevice.Id)+"/"+s))
            });
            var sfcmPanelOn = $q.all(sfcmPromises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var sfcmPanelResponse = results[i].data;
                    console.log(sfcmPanelResponse);
                    if(sfcmPanelResponse["Config"]["On-Off"] === "On"){
                       var url = results[i].config.url;
                       var arr = url.split("/");
                       $scope.panelId = arr.pop();
                        $scope.panelOnId = {
                            "PanelOnId": $scope.panelId,
                            "PanelOnLoad": [],
                            "PanelOnStatus": [],
                            "PanelOverallStatus": $scope.devicePanelStatus
                        }
                       pushSfcmDevice(sfcmDevice.Id,$scope.panelOnId);
                    }
                }
                console.log($scope.devices);
                $scope.createDeviceCardsArr($scope.devices);
                return $scope.devices;
            },function(results) {
              var sfcmPanelResponse = results;
          });
          defer1.resolve(sfcmPanelOn);
         return defer1.promise;
        }
        $scope.identifyDeviceActive = function(devicesFinalArr){
            for(var i=0;i < devicesFinalArr.length;i++){
                if(devicesFinalArr[i].deviceActive==='OK')
                    devicesFinalArr[i].deviceActive='UI_Communication_24';
                else
                    devicesFinalArr[i].deviceActive='UI_Lost_24';
                //devicesFinalArr[i].push(devicesFinalArr[i].deviceActive);
            }
        }
        $scope.createDeviceCardsArr = function(deviceObjects){
            console.log(deviceObjects);
            for(var i=0;i< deviceObjects.length;i++){
                console.log(deviceObjects[i].devicePanelOn.length);
                if(deviceObjects[i].devicePanelOn.length != 0){
                  for(var j=0;j< deviceObjects[i].devicePanelOn.length;j++){
                    $scope.deviceObjArr = {
                        "deviceType": deviceObjects[i].deviceType,
                        "deviceId": deviceObjects[i].deviceId,
                        "devicePanelOn": deviceObjects[i].devicePanelOn[j],
                        "deviceActive": deviceObjects[i].deviceActive
                    }
                    $scope.devicesArr.push($scope.deviceObjArr);
                  }
               }
            }
            //$scope.stringyDevicesArr = JSON.stringify($scope.devicesArr);
            console.log($scope.devicesArr);
            $scope.identifyDeviceActive($scope.devicesArr);
        }
        
        $scope.invokeLoadPieChart = function() {
            // Load Pie Chart Binding 
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
                .success(function(response) {
                    $scope.power = response.Load;
                    $scope.kW = response.kW;
                    $scope.showPie = true;

                    $scope.labelspie = [$scope.power.Total, 100-$scope.power.Total];
                    $scope.datapie = [$scope.power.Total, 100-$scope.power.Total];
                    $scope.colorspie = ["#0b74da", "#272727"];
                    $scope.optionspie = {
                                          responsive: false,
                                          rotation: 1 * (3/4*Math.PI),
                                          circumference: 1 * (3/2*Math.PI),
                                          cutoutPercentage: 86,
                                          elements: { arc: { 
                                                                borderWidth: 0,
                                                                borderColor: '#0b74da'
                                                            } 
                                                    },
                                           animation: false
                                    };
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }
        Chart.pluginService.register({
          beforeDraw: function(chart) {

                // For Pie Chart
                if(chart.config.type === "doughnut" && chart.chart.canvas.id === "pduPieChartMeters"){

                    var width = chart.chart.width,
                        height = chart.chart.height/1.25,
                        ctx = chart.chart.ctx;
                    console.log(height);
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#d2d2d2';

                    var fontSize = (height / 57).toFixed(2);
                    //ctx.font = fontSize + "em HelveticaNeueETPro-Medium";
                    ctx.font = "16px HelveticaNeueETPro-Medium";
                    var text = $scope.kW.Total,
                            textX = Math.round((width - ctx.measureText(text).width)/2),
                            textY = height/2*1.5;
                    ctx.fillText(text, textX, textY);

                    var fontSize = (height / 114).toFixed(2);
                    //ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.font = "10px HelveticaNeueETPro-Light";
                    var text = "kW",
                            textX = Math.round((width - ctx.measureText(text).width)/2),
                            textY = height/2*2;
                    ctx.fillText(text, textX, textY);

                    ctx.save();

                }else if(chart.chart.canvas.id == "pduBar1" || chart.chart.canvas.id == "pduBar2"){

                    // Bar Chart Properties

                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 226).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#d2d2d2';


                    var text = "", 
                        textX = Math.round((width - ctx.measureText(text).width)/2)-85,
                        textY = height/2-50;

                    if(ctx.canvas.id == "bar1"){
                        ctx.moveTo(textX+45, textY+10);
                        ctx.lineTo(textX+125, textY+10);
                    }else{
                        ctx.moveTo(textX+45, textY+25);
                        ctx.lineTo(textX+125, textY+25);
                    }

                    ctx.strokeStyle = "#858585";
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    console.log(ctx);
                    if(ctx.canvas.id == "bar1"){
                        ctx.moveTo(textX+45, textY);
                        ctx.lineTo(textX+125, textY);
                    }else{
                        ctx.moveTo(textX+45, textY);
                        ctx.lineTo(textX+125, textY);
                    }
                    ctx.stroke();

                    ctx.fillText(text, textX+180, textY);

                    ctx.save();

                }
            }
        });
        //options for the charts being rendered, common for both SFCM and BCM charts
        $scope.options = {
						responsive: true,
						legend: {
							display: false,
							position: 'bottom'
						},
						scales: {
                            xAxes: [{
                                display: false,
                                gridLines: {display: false, /*grid lines of x axis are gone. Since by default display is true*/ }
                            }], 
                            yAxes: [{
                                display: true,
                                //stacked: true, /*plot starts with reference to color*/
                                gridLines: {
                                    display: false, /*grid lines of y axis are gone.*/ 
                                },
                                ticks: {
                                    display: false, /*this removes ticks marks on y-aixs*/
                                },
                                scaleLabel: {
                                    display: true, 
                                    fontColor: 'black',
                                     labelString: 'Load%'
                                }
                            }]
                       },
					   showAllTooltips: true,
					   tooltipEvents: [],	
					   //onAnimationComplete: function() {
						//	this.showTooltip(this.segments, true);
						//}
					};
        //$scope.colorslabelHarmonics =	{backgroundColor: 'rgb(255, 97, 131)'};
        
        $scope.labelHarmonics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42];
        //labels or x-aixs to the BCM chart, 42 values
        $scope.labelHarmonicsBcm = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42];
        //labels or x-aixs to the SFCM chart, 14 values
        $scope.labelHarmonicsSfcm = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        //series, common to both BCM & SFCM charts
        $scope.loadSeries = ['Load']; //This is legend
        $scope.lineDisplay = {
            showLine: true
        };
        /*$scope.colors = [{'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}, {'pointBackgroundColor': "rgb(255, 97, 131)"}];*/
        
        $scope.invokeLoadChartData = function(){
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeterGrouped/submeters/7/1')
                //above json data is a response. 

                .success(function(response) {
							$scope.loadResponse1 = response; //JSON data. 
							$scope.loadResponseValue1 =JSON.parse(JSON.stringify($scope.loadResponse1)); //js data
							
							$scope.height_chart = $(".card-layout-bcm-home").height() * 0.9; //height of the div element. 
							$scope.width_chart = $(".card-layout-bcm-home").width() * 0.75; //width of the div element. 
							$scope.panelData1 =  $scope.loadResponseValue1.Meter.Load;
                            console.log($scope.panelData1);
						}).catch(function (response){
							$scope.networkFailure=true;
						});
						
        }
        
        $scope.bcmLoadChartData = function(devices){
            $scope.pushBcmPanelData = function(panelNum,panelData){
                for(var i=0;i < devices.length;i++){
                    if(devices[i].deviceType === 'BCM'){
                       for(var j=0;j < devices[i].devicePanelOn.length;j++){
                        if(parseInt(panelNum) === parseInt(devices[i].devicePanelOn[j].PanelOnId)){
                            devices[i].devicePanelOn[j].PanelOnLoad = panelData;
                        }
                      } 
                    } 
                }
            }
            $scope.pushBcmPanelStatus = function(panelNum,panelStatus){
                for(var i=0;i < devices.length;i++){
                    if(devices[i].deviceType === 'BCM'){
                       for(var j=0;j < devices[i].devicePanelOn.length;j++){
                        if(parseInt(panelNum) === parseInt(devices[i].devicePanelOn[j].PanelOnId)){
                            devices[i].devicePanelOn[j].PanelOnStatus = panelStatus;
                        }
                           console.log(devices[i].devicePanelOn[j].PanelOnStatus);
                         for(var c=0;c <= devices[i].devicePanelOn[j].PanelOnStatus.length - 1;c++){
                              switch(devices[i].devicePanelOn[j].PanelOnStatus[c]){
                                  case "Normal":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(0, 128, 0)"};
                                     break;
                                  case "Warning":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(255, 165, 0)"};
                                     break;
                                  case "Alarm":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(255, 0, 0)"};
                                     break;
                              }
                          } 
                      } 
                    } 
                }
            }
            $scope.identifyBcmPanelStatus = function(panelNum,panelStatus){
                //console.log(panelStatus);
                var a = panelStatus.indexOf("Alarm");
                var w = panelStatus.indexOf("Warning");
                var n = panelStatus.indexOf("Normal");
                if(parseInt(a) <= 0){
                    for(var i=0;i <= devices.length-1;i++){
                        if(devices[i].deviceType === 'BCM'){
                        for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                            devices[i].devicePanelOn[j].PanelOverallStatus = 'AlarmIcon';
                          }    
                       }
                    }
                }
                else if(parseInt(w) <= 0){
                    for(var i=0;i <= devices.length-1;i++){
                        if(devices[i].deviceType === 'BCM'){
                        for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                            devices[i].devicePanelOn[j].PanelOverallStatus = 'WarningIcon';
                          }    
                       }
                    }
                }
                else{
                   for(var i=0;i <= devices.length-1;i++){
                        if(devices[i].deviceType === 'BCM'){
                        for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                            devices[i].devicePanelOn[j].PanelOverallStatus = 'UI_Normal';
                          }    
                       }
                    }
                }
            }
            for(var i=0;i < devices.length;i++){
                if(devices[i].deviceType === 'BCM'){
                   var deferred = $q.defer();
                    var promises = [];
                    for(var bcmPanelOn = 0;bcmPanelOn <= devices[i].devicePanelOn.length-1;bcmPanelOn++){ 
                        promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeterGrouped/submeters/'+parseInt(devices[i].deviceId)+'/'+parseInt(devices[i].devicePanelOn[bcmPanelOn].PanelOnId)));
                    }
                }
            }
            var bcmPanelOnData = $q.all(promises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    $scope.bcmPanelDataResponse = results[i].data;
                    console.log($scope.bcmPanelDataResponse);
                    $scope.bcmPanelDataResponseValue = JSON.stringify($scope.bcmPanelDataResponse);
                    var url = results[i].config.url;
                    var arr = url.split("/");
                    var panelOnId = arr.pop();
                    $scope.bcmPanelData =  $scope.bcmPanelDataResponse.Meter.Load;
                    $scope.bcmPanelStatus = $scope.bcmPanelDataResponse.Meter.Status;
                    $scope.pushBcmPanelData(panelOnId,$scope.bcmPanelData);
                    $scope.identifyBcmPanelStatus(panelOnId,$scope.bcmPanelStatus);
                    $scope.pushBcmPanelStatus(panelOnId,$scope.bcmPanelStatus);
                }
                
                return $scope.devices;
            })
            deferred.resolve(bcmPanelOnData);
            return deferred.promise;
        }
        
        $scope.sfcmLoadChartData = function(devices){
            var subfeedNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
            $scope.pushSfcmPanelLoadAvg = function(subfeed,panelNum,panelData){
                //console.log(devices);
                for(var i=0;i <= devices.length-1;i++){
                    if(devices[i].deviceType === 'SFCM'){
                      for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                        if(parseInt(panelNum) === parseInt(devices[i].devicePanelOn[j].PanelOnId)){
                            devices[i].devicePanelOn[j].PanelOnLoad.push(panelData);
                        }
                      }  
                    }   
                }
            }
            $scope.sfcmPanelDataAvg = function(sfNum,sfcmPanelId,sfcmPanelLoadData){
                var load = 0;
                var loadAvg = 0;
                for(var i = 0; i<sfcmPanelLoadData.length; i++) {
                    if(sfcmPanelLoadData[i] != 0){
                        load = load+sfcmPanelLoadData[i];
                        //console.log(load);
                    }
                }
                loadAvg = load/3;
                //console.log(loadAvg);
                $scope.pushSfcmPanelLoadAvg(sfNum,sfcmPanelId,loadAvg);
            }
            $scope.sfcmPanelSubfeedStatusColor = function(devices){
                for(var i=0;i <= devices.length-1;i++){
                    if(devices[i].deviceType === 'SFCM'){
                      for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                        /*if(parseInt(sfcmPanelId) === parseInt(devices[i].devicePanelOn[j].PanelOnId)){
                            devices[i].devicePanelOn[j].PanelOnStatus.push(sfStatus);
                        }*/
                          
                          for(var c=0;c <= devices[i].devicePanelOn[j].PanelOnStatus.length-1;c++){
                              switch(devices[i].devicePanelOn[j].PanelOnStatus[c]){
                                  case "Normal":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(0, 128, 0)"};
                                     break;
                                  case "Warning":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(255, 165, 0)"};
                                     break;
                                  case "Alarm":
                                    devices[i].devicePanelOn[j].PanelOnStatus[c] = {'pointBackgroundColor': "rgb(255, 0, 0)"};
                                     break;
                              }
                          }
                      }
                    }   
                }
            }
            $scope.identifySfcmPanelStatus = function(devices){
                for(var i=0;i <= devices.length-1;i++){
                    if(devices[i].deviceType === 'SFCM'){
                    for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                        var a = (devices[i].devicePanelOn[j].PanelOnStatus).indexOf('Alarm');
                        var w = (devices[i].devicePanelOn[j].PanelOnStatus).indexOf('Warning');
                        var n = (devices[i].devicePanelOn[j].PanelOnStatus).indexOf('Normal');
                        if(parseInt(a) <= 0){
                            devices[i].devicePanelOn[j].PanelOverallStatus = 'AlarmIcon';
                        }
                        else if(parseInt(w) <= 0){
                            devices[i].devicePanelOn[j].PanelOverallStatus = 'WarningIcon';
                        }
                        else{
                           devices[i].devicePanelOn[j].PanelOverallStatus = 'UI_Normal'; 
                        }
                      }    
                   }
                }
                $scope.sfcmPanelSubfeedStatusColor(devices);
            }
            $scope.pushSfcmPanelSubfeedStatus = function(sfNum,sfcmPanelId,sfStatus){
                for(var i=0;i <= devices.length-1;i++){
                    if(devices[i].deviceType === 'SFCM'){
                      for(var j=0;j <= devices[i].devicePanelOn.length-1;j++){
                        if(parseInt(sfcmPanelId) === parseInt(devices[i].devicePanelOn[j].PanelOnId)){
                            devices[i].devicePanelOn[j].PanelOnStatus.push(sfStatus);
                          }
                        }
                    }   
                } 
                $scope.identifySfcmPanelStatus(devices);
            }
            
            for(var i=0;i < devices.length;i++){
                if(devices[i].deviceType === 'SFCM'){
                   var deferred1 = $q.defer();
                    var promises = [];
                    for(var sfcmPanelOn = 0;sfcmPanelOn <= devices[i].devicePanelOn.length-1;sfcmPanelOn++){
                        subfeedNum.forEach(function(sf){
                           promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+parseInt(devices[i].deviceId)+'/'+parseInt(devices[i].devicePanelOn[sfcmPanelOn].PanelOnId)+'/'+sf))
                        });
                    }
                }
            }
            var sfcmPanelOnData = $q.all(promises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    $scope.sfcmPanelDataResponse = results[i].data;
                    $scope.sfcmPanelDataResponseValue = JSON.stringify($scope.sfcmPanelDataResponse);
                    var url = results[i].config.url;
                    var arr = url.split("/");
                    var subfeedId = arr.pop();
                    var panelOnId = arr.pop();
                    var sfcmPanelData =  $scope.sfcmPanelDataResponse.Power.Load;
                    var sfcmSubfeedStatus = $scope.sfcmPanelDataResponse.Others.Status;
                    $scope.sfcmPanelDataAvg(subfeedId,panelOnId,sfcmPanelData);
                    $scope.pushSfcmPanelSubfeedStatus(subfeedId,panelOnId,sfcmSubfeedStatus);
                }
                
                return $scope.devices;
            })
            deferred1.resolve(sfcmPanelOnData);
            return deferred1.promise;
        }
        
        //$scope.invokeDeviceMeters();
	    $scope.invokeDeviceMetersService().then(function(results){
            $scope.identifyBCMPanel($scope.objBCM).then(function(results){
                $scope.identifySFCMPanel($scope.objSFCM).then(function(results){
                  $scope.sfcmLoadChartData($scope.devices).then(function(results){
                      $scope.bcmLoadChartData($scope.devices).then(function(results){
                        $scope.invokeLoadPieChart();
                      });
                   });
                });
            });
        });
    });
    

    //MS - BCM Branch View Controller: START
    app.controller('metersBranchController', function($scope, $http, $q, $timeout, $location, $interval, $rootScope, $compile){
        $rootScope.activeEventsDisplay = false;
        $scope.branchNumbers = [];
        $scope.numOfCols = 3;
        $scope.branchIsClicked = false;
        //$rootScope.selectedBranchNumber;
        
        //function to draw the BCM Branch right aligned svg: START
        $scope.svg_bcmBranchRight = function(number,status){
            /*var svgBcmBranchRightWrapper = document.createElement("div");
            svgBcmBranchRightWrapper.setAttribute("class","col-xs-6");
            svgBcmBranchRightWrapper.setAttribute("id","branchRightWrapper"+number);
            var target = document.getElementById("brRow");
            target.append(svgBcmBranchRightWrapper);*/
            //changing the way to append the div wrapper of each svg element
            var $element = $('<div class="col-xs-6" id="branhcRightWrapper" ng-click="branchInfo($event)"></div>').appendTo('#brRow');
            $compile($element)($scope);
            var branchNumSpan = document.createElement('span');
            branchNumSpan.setAttribute("id","brNumSpan");
            branchNumSpan.textContent = number;
            $element.append(branchNumSpan);
            var svg_bcmBranchRight = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
            svg_bcmBranchRight.setAttribute("viewBox","0 0 34 24");
            svg_bcmBranchRight.setAttribute("preserveAspectRatio","xMidYMid meet");
            svg_bcmBranchRight.setAttribute("version","1.1");
            $element.append(svg_bcmBranchRight);
            //branch status bar group
            var branchStatusBarContainer = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
            branchStatusBarContainer.setAttribute("id","bcmBranchStatusGrp"); //Set g's id
            branchStatusBarContainer.setAttribute("transform","translate(0,-273)"); 
            svg_bcmBranchRight.append(branchStatusBarContainer);
            //branch status bar
            var branchStatusBar = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            branchStatusBar.setAttribute("y","282.1727");                   
            branchStatusBar.setAttribute("x","7.1100736");
            branchStatusBar.setAttribute("ry","2.0287354e-015");                   
            branchStatusBar.setAttribute("height","3.9982803");
            branchStatusBar.setAttribute("width","20.949482");
            branchStatusBar.setAttribute("style","display:inline;fill:#ffffff;");
            switch(status){
                case 'Alarm':
                    branchStatusBar.setAttribute("style","display:inline;fill:#ff0000;");
                    break;
                case 'Warning':
                    branchStatusBar.setAttribute("style","display:inline;fill:#ff8800;");
                    break;
                case 'Normal':
                    branchStatusBar.setAttribute("style","display:inline;fill:#999999;");
                    break;
            }
            branchStatusBarContainer.append(branchStatusBar);
            //branch handle bar
            var branchHandleBar = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            branchHandleBar.setAttribute("id","brHandleOnClick");                   
            branchHandleBar.setAttribute("y","5.5985537");                   
            branchHandleBar.setAttribute("x","21.947514");
            branchHandleBar.setAttribute("ry","1.7759147e-015");                   
            branchHandleBar.setAttribute("height","11.278936");
            branchHandleBar.setAttribute("width","4.0258112");
            branchHandleBar.setAttribute("style","display:inline;fill:#ffffff;stroke:#cccccc;stroke-width:0.125;");
            svg_bcmBranchRight.append(branchHandleBar);
            //branch text element: 1
            var branchTextContainer1 = document.createElementNS("http://www.w3.org/2000/svg",'text');
            branchTextContainer1.setAttribute("style","font-size:4.2333px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
            branchTextContainer1.setAttribute("x",'22.357288');
            branchTextContainer1.setAttribute("y",'23.206249');
            svg_bcmBranchRight.append(branchTextContainer1);
            var branchTextOne = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
            branchTextOne.setAttribute("id",'bcmBranchTxtOne');
            branchTextContainer1.append(branchTextOne);
            branchTextOne.textContent = "1";
            branchTextOne.setAttribute("style","fill:#cccccc;fill-opacity:1;stroke-width:0.40014985");
            //branch text element: 0
            var branchTextContainer2 = document.createElementNS("http://www.w3.org/2000/svg",'text');
            branchTextContainer2.setAttribute("style","font-size:4.2333px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
            branchTextContainer2.setAttribute("x",'8.5217905');
            branchTextContainer2.setAttribute("y",'23.206249');
            svg_bcmBranchRight.append(branchTextContainer2);
            var branchTextZero = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
            branchTextZero.setAttribute("id",'bcmBranchTxtZero');
            branchTextContainer2.append(branchTextZero);
            branchTextZero.textContent = "0";
            branchTextZero.setAttribute("style","fill:#cccccc;fill-opacity:1;stroke-width:0.40014985");
            
        }
        //function to draw the BCM Branch right aligned svg: END
        
        //function to draw the BCM Branch left aligned svg: START
        $scope.svg_bcmBranchLeft = function(number,status){
            /*var svgBcmBranchLeftWrapper = document.createElement("div");
            svgBcmBranchLeftWrapper.setAttribute("class","col-xs-6");
            svgBcmBranchLeftWrapper.setAttribute("id","branchLeftWrapper");
            var target = document.getElementById("brRow");
            target.append(svgBcmBranchLeftWrapper);*/
            var $element = $('<div class="col-xs-6" id="branchLeftWrapper" ng-click="branchInfo($event);"></div>').appendTo('#brRow');
            $compile($element)($scope);
            var branchNumSpan = document.createElement('span');
            branchNumSpan.setAttribute("id","brNumSpan");
            branchNumSpan.textContent = number;
            $element.append(branchNumSpan);
            var svg_bcmBranchLeft = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); //create svg element
            svg_bcmBranchLeft.setAttribute("viewBox","0 0 34 24");
            svg_bcmBranchLeft.setAttribute("preserveAspectRatio","xMidYMid meet");
            svg_bcmBranchLeft.setAttribute("version","1.1");
            $element.append(svg_bcmBranchLeft);
            //branch status bar group
            var branchStatusBarContainer = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a defs in SVG's namespace
            branchStatusBarContainer.setAttribute("id","bcmBranchStatusGrp"); //Set g's id
            branchStatusBarContainer.setAttribute("transform","translate(0,-273)"); 
            svg_bcmBranchLeft.append(branchStatusBarContainer);
            //branch status bar
            var branchStatusBar = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            branchStatusBar.setAttribute("y","282.1727");                   
            branchStatusBar.setAttribute("x","7.1100736");
            branchStatusBar.setAttribute("ry","2.0287354e-015");                   
            branchStatusBar.setAttribute("height","3.9982803");
            branchStatusBar.setAttribute("width","20.949482");
            branchStatusBar.setAttribute("style","display:inline;fill:#ffffff;");
            switch(status){
                case "Alarm":
                    branchStatusBar.setAttribute("style","display:inline;fill:#ff0000;");
                    break;
                case "Warning":
                    branchStatusBar.setAttribute("style","display:inline;fill:#ff8800;");
                    break;
                case "Normal":
                    branchStatusBar.setAttribute("style","display:inline;fill:#999999;");
                    break;
            }
            branchStatusBarContainer.append(branchStatusBar);
            //branch handle bar
            var branchHandleBar = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            branchHandleBar.setAttribute("id","brHandleOnClick");
            branchHandleBar.setAttribute("y","5.5985537");                   
            branchHandleBar.setAttribute("x","9.2475157");
            branchHandleBar.setAttribute("ry","1.1127968e-015");                   
            branchHandleBar.setAttribute("height","11.278936");
            branchHandleBar.setAttribute("width","4.0258112");
            branchHandleBar.setAttribute("style","display:inline;fill:#ffffff;stroke:#cccccc;stroke-width:0.125;")
            svg_bcmBranchLeft.append(branchHandleBar);
            //branch text element: 1
            var branchTextContainer1 = document.createElementNS("http://www.w3.org/2000/svg",'text');
            branchTextContainer1.setAttribute("style","font-size:4.2333px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
            branchTextContainer1.setAttribute("x",'9.6572876');
            branchTextContainer1.setAttribute("y",'23.206249');
            svg_bcmBranchLeft.append(branchTextContainer1);
            var branchTextOne = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
            branchTextOne.setAttribute("id",'bcmBranchTxtOne');
            branchTextContainer1.append(branchTextOne);
            branchTextOne.textContent = "1";
            branchTextOne.setAttribute("style","fill:#cccccc;fill-opacity:1;stroke-width:0.40014985");
            //branch text element: 0
            var branchTextContainer2 = document.createElementNS("http://www.w3.org/2000/svg",'text');
            branchTextContainer2.setAttribute("style","font-size:4.2333px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;");
            branchTextContainer2.setAttribute("x",'24.39679');
            branchTextContainer2.setAttribute("y",'23.206249');
            svg_bcmBranchLeft.append(branchTextContainer2);
            var branchTextZero = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
            branchTextZero.setAttribute("id",'bcmBranchTxtZero');
            branchTextContainer2.append(branchTextZero);
            branchTextZero.textContent = "0";
            branchTextZero.setAttribute("style","fill:#cccccc;fill-opacity:1;stroke-width:0.40014985");
            
        }
        //function to draw the BCM Branch left aligned: END
        
        //function to take the BCM branch Req response as parameters and draw the 42 branch grid layout: START
        $scope.drawBcmPanelBranch = function(panelBranchNum,panelBranchState,panelBranchStatus){
            var bcmPanelBranchRow = angular.element("<div class='row' id='branchRowContainer'></div>");
            var bcmPanelBranchContainer = document.getElementById("branchContainer");
            angular.element(bcmPanelBranchContainer).append(bcmPanelBranchRow);
            var bcmPanelBranchCol1 = angular.element("<div class='col-xs-4' id='brCol1'></div>");
            angular.element(bcmPanelBranchRow).append(bcmPanelBranchCol1);
            /*var bcmPanelBranchCol2 = angular.element("<div class='col-xs-4' id='brCol2'></div>");
            angular.element(bcmPanelBranchRow).append(bcmPanelBranchCol2);
            var bcmPanelBranchCol3 = angular.element("<div class='col-xs-4' id='brCol3'></div>");
            angular.element(bcmPanelBranchRow).append(bcmPanelBranchCol3);*/
            var bcmBranchRow = angular.element("<div class='row' id='brRow'></div>");
            angular.element(bcmPanelBranchCol1).append(bcmBranchRow);
            for(var brNum=0;brNum <= panelBranchNum.length-1;brNum++){
                if(panelBranchNum[brNum]%2 != 0){
                    //to divide the grid into columns: condition to check: START
                    /*if(panelBranchNum[brNum]%(parseInt(panelBranchNum.length)/$scope.numOfCols) === 0){
                       var bcmPanelBranchCol = angular.element("<div class='col-xs-4' id='brCol'></div>");
                        var target = document.getElementById("branchRowContainer");
                        angular.element(target).append(bcmPanelBranchCol); 
                        var subTarget = document.getElementById("brCol");
                        var sub = document.getElementById("brRow");
                        angular.element(subTarget).append(sub); 
                        $scope.svg_bcmBranchRight(panelBranchStatus[brNum]);
                    }*/
                    //to divide the grid into columns: condition to check: END
                   $scope.svg_bcmBranchRight(panelBranchNum[brNum],panelBranchStatus[brNum]); 
                }
                else{
                    $scope.svg_bcmBranchLeft(panelBranchNum[brNum],panelBranchStatus[brNum]);
                }
            }
            //function to highlight the branch on click: START
            $scope.highlightBranch = function(e){
              console.log(e);
              $scope.branch = e.currentTarget;
              /*$scope.branchSvg = $scope.branch.firstElementChild.firstElementChild;
              $scope.branchSvgChildren = $scope.branchSvg.children;
                console.log($scope.branchSvg);
                console.log($scope.branchSvgChildren);
                for(var i=0;i <= $scope.branchSvgChildren.length-1;i++){
                    console.log($scope.branchSvgChildren[i].id);
                    if($scope.branchSvgChildren[i].id === 'brHandleOnClick'){
                         $scope.branchSvgChildren[i].style.fill = '#0b74da';
                       }
                }*/
              $scope.branchNumSpan = e.currentTarget.firstChild;
              $scope.branch.style.border = '1px solid #222';  
              $scope.branchNumSpan.style.color = '#222';  
              $scope.branchNumSpan.style.fontWeight = 'bold';  
              //$scope.branch.addClass('branch-highlight');   
            }
            //function to highlight the branch on click: END
            //function to fetch the branch number on click of each branch: START
            $scope.branchInfo = function(ele) {
                $rootScope.selectedBranchNumber = ele.currentTarget.firstChild.innerText;
                $rootScope.$broadcast("onBranchClick",$rootScope.selectedBranchNumber);
                $scope.branchIsClicked = !$scope.branchIsClicked;
                //$scope.highlightBranch(ele);
                console.log($rootScope.selectedBranchNumber);
            }
            //function to fetch the branch number on click of each branch: END
        }
        //function to take the BCM branch Req response as parameters and draw the 42 branch grid layout: END
        
        //function to make the API call to draw the 42 branch BCM Panel Meter layout: START
        $scope.bcmPanelBranch = function(){
            for(var i=1;i <= 42;i++){
                $scope.branchNumbers.push(i);
            }
            console.log($scope.branchNumbers);
            //manually passing the device ID '7' and the panel number '1' which need to be fetched on click
               var deferred = $q.defer();
               var promises = [];
               promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeterGrouped/submeters/7/1'));
               
               var bcmPanelBranchReq = $q.all(promises).then(function(results){
                   console.log(results);
                   $scope.bcmPanelBranchResponse = results[0].data;
                   $scope.panelBranchStates = $scope.bcmPanelBranchResponse.Config.State;
                   $scope.panelBranchStatuses = $scope.bcmPanelBranchResponse.Meter.Status;
                   //$scope.drawBcmPanelBranch($scope.branchNumbers,$scope.panelBranchStates,$scope.panelBranchStatuses);
                   console.log($scope.panelBranchStates);
                   console.log($scope.panelBranchStatuses);
                   return $scope.bcmPanelBranchResponse;
               })
               deferred.resolve(bcmPanelBranchReq);
               return deferred.promise;
        }
        //function to make the API call to draw the 42 branch BCM Panel Meter layout: END
        $scope.bcmPanelBranch().then(function(results){
            $scope.drawBcmPanelBranch($scope.branchNumbers,$scope.panelBranchStates,$scope.panelBranchStatuses);
        });
        
    });
    //MS - BCM Branch View Controller: END

    //SFCM Controllers
    app.controller('SfcmHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'SFCM' + ' - '+$rootScope.selectedDeviceId;
        $rootScope.activeEventsDisplay = false;
        $scope.showCanvas = true;
        $scope.toggleViewTableMode = false;

        // To toggle between Graph & Table View
        $scope.toggleViewTableGraph = function($event, i) {
            var element = $event;
            var filterItem = element.currentTarget.id.trim();
            $scope.toggleViewTableMode = (filterItem=='tableModeId' ? true : false)

            // Setting the style for Graph/Table Link
            var currentItem = element.currentTarget.parentElement.firstElementChild;
            for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
            {
                // Reset the class name of each element
                currentItem.className = '';			
                if(currentItem.id.trim() == filterItem){
                    currentItem.className = 'active-text-link';
                }
                currentItem = currentItem.nextElementSibling
            }

        }

        $scope.options = {
                            //responsive: false,
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {								
                                    boxWidth: 20
                                }
                            },
                            scales: {
                                xAxes: [{
                                    categoryPercentage: 0.25,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            },
                           showAllTooltips: true,
                           tooltipEvents: [],	
                           onAnimationComplete: function() {
                                this.showTooltip(this.segments, true);
                            }
                        };

        $scope.colorsVoltageHarmonics =	[
                          {
                            backgroundColor: '#2E92FA'
                          },
                          {
                            backgroundColor: 'orange'
                          }
                         ];
        $scope.labelsVoltageHarmonics = ['A', 'B', 'C'];
        $scope.seriesVoltageHarmonics = ['Voltage', 'Load'];

        $scope.invokeServices = function(){

            // API call for Panel 1			
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1').
                success(function(response) {
                $scope.panelConfig1 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/1').
                    success(function(response) {
                        $scope.currentResponse1 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/1').
                            success(function(response) {
                                $scope.voltageResponse1 = response;
                                $scope.voltageResponseValue1 =JSON.parse(JSON.stringify($scope.voltageResponse1));
                                switch($scope.voltageResponse1.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse1.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse1.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse1.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse1.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse1.Voltage.L1 = $scope.voltageResponse1.Voltage.L1/$scope.panelConfig1.VoltRating * 100;
                                $scope.voltageResponse1.Voltage.L2 = $scope.voltageResponse1.Voltage.L2/$scope.panelConfig1.VoltRating * 100;		
                                $scope.voltageResponse1.Voltage.L3= $scope.voltageResponse1.Voltage.L3/$scope.panelConfig1.VoltRating * 100;

                                $scope.panelData1 = 	[
                                                            [$scope.voltageResponse1.Voltage.L1,
                                                            $scope.voltageResponse1.Voltage.L2, 
                                                            $scope.voltageResponse1.Voltage.L3],
                                                            [$scope.currentResponse1.Load.L1,
                                                            $scope.currentResponse1.Load.L2,
                                                            $scope.currentResponse1.Load.L3,
                                                            ]
                                                    ];


                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 2	
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2').
                success(function(response) {
                $scope.panelConfig2 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/2').
                    success(function(response) {
                        $scope.currentResponse2 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/2').
                            success(function(response) {
                                $scope.voltageResponse2 = response;
                                $scope.voltageResponseValue2 =JSON.parse(JSON.stringify($scope.voltageResponse2));
                                switch($scope.voltageResponse2.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse2.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse2.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageRespons2.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse2.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse2.Voltage.L1 = $scope.voltageResponse2.Voltage.L1/$scope.panelConfig2.VoltRating * 100;
                                $scope.voltageResponse2.Voltage.L2 = $scope.voltageResponse2.Voltage.L2/$scope.panelConfig2.VoltRating * 100;		
                                $scope.voltageResponse2.Voltage.L3= $scope.voltageResponse2.Voltage.L3/$scope.panelConfig2.VoltRating * 100;

                                $scope.panelData2 = [	[$scope.voltageResponse2.Voltage.L1,
                                                $scope.voltageResponse2.Voltage.L2, 
                                                $scope.voltageResponse2.Voltage.L3],
                                                [$scope.currentResponse2.Load.L1,
                                                $scope.currentResponse2.Load.L2,
                                                $scope.currentResponse2.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 3

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3').
                success(function(response) {
                $scope.panelConfig3 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/3').
                    success(function(response) {
                        $scope.currentResponse3 = response;					
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/3').
                            success(function(response) {
                                $scope.voltageResponse3 = response;
                                $scope.voltageResponseValue3 =JSON.parse(JSON.stringify($scope.voltageResponse3));
                                switch($scope.voltageResponse3.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse3.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse3.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse3.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse3.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse3.Voltage.L1 = $scope.voltageResponse3.Voltage.L1/$scope.panelConfig3.VoltRating * 100;
                                $scope.voltageResponse3.Voltage.L2 = $scope.voltageResponse3.Voltage.L2/$scope.panelConfig3.VoltRating * 100;		
                                $scope.voltageResponse3.Voltage.L3= $scope.voltageResponse3.Voltage.L3/$scope.panelConfig3.VoltRating * 100;

                                $scope.panelData3 = [	[$scope.voltageResponse3.Voltage.L1,
                                                $scope.voltageResponse3.Voltage.L2, 
                                                $scope.voltageResponse3.Voltage.L3],
                                                [$scope.currentResponse3.Load.L1,
                                                $scope.currentResponse3.Load.L2,
                                                $scope.currentResponse3.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 4

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4').
                success(function(response) {
                $scope.panelConfig4 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/4').
                    success(function(response) {
                        $scope.currentResponse4 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/4').
                            success(function(response) {
                                $scope.voltageResponse4 = response;							
                                $scope.voltageResponseValue4 =JSON.parse(JSON.stringify($scope.voltageResponse4));

                                switch($scope.voltageResponse4.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse4.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse4.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse4.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse4.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse4.Voltage.L1 = $scope.voltageResponse4.Voltage.L1/$scope.panelConfig4.VoltRating * 100;
                                $scope.voltageResponse4.Voltage.L2 = $scope.voltageResponse4.Voltage.L2/$scope.panelConfig4.VoltRating * 100;		
                                $scope.voltageResponse4.Voltage.L3= $scope.voltageResponse4.Voltage.L3/$scope.panelConfig4.VoltRating * 100;

                                $scope.panelData4 = [	[$scope.voltageResponse4.Voltage.L1,
                                                $scope.voltageResponse4.Voltage.L2, 
                                                $scope.voltageResponse4.Voltage.L3],
                                                [$scope.currentResponse4.Load.L1,
                                                $scope.currentResponse4.Load.L2,
                                                $scope.currentResponse4.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });




        }

        $scope.invokeServices(); // Initial Call
        $scope.sfcmHomePromise = $interval(function(){$scope.invokeServices()}, DATADELAY);

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sfcmHomePromise);
        });
    });

    app.controller('SfcmMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'SFCM'+ ' - '+$rootScope.selectedDeviceId;
        $rootScope.activeEventsDisplay = false;	
        $rootScope.paginationNumbersBcmMeters = [];
        $scope.subFeeds = [];
        $scope.powerLoad = [];
        $scope.subFeedIndicator = 'active-link';
        $scope.subfeedNumber = "Subfeed 1";

        // Remove the below hard coded value after testing
        //$rootScope.selectedDeviceId = 8;

        $scope.panelStatuses = [1, 2, 3, 4]
        $scope.selectedPanel = $scope.panelStatuses[0];


        // Subfeed when clicked from main view
        $scope.subfeedDetails = function($event, i) {
            $scope.meterView = true;
            $scope.settingsView = false;
            var element = $event;
            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';		
            $(".bcm-meters-table-outer-content").css("width","300px");
            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.style.display = 'block';
            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.style.display = 'block';
            $scope.subfeedNumber = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText.trim();
            $scope.styleIndicator = ['border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0'];
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/attributes/'+$rootScope.selectedDeviceId)
                .success(function(response) {
                        $scope.settingsAttributes = response;

                }).catch(function (response){
                        $scope.networkFailure=true;
                });

            switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==0){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 2":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==1){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 3":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==2){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 4":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==3){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 5":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==4){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 6":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==5){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 7":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==6){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 8":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==7){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 9":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==8){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 10":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==9){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 11":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==10){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 12":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==11){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 13":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==12){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 14":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==13){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
            }
        }

        // Subfeed when clicked from side/minimized view
        $scope.subfeedDetailsMinView = function($event, i) {

            var element = $event;
            $scope.subfeedNumber = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText.trim();

            // Deselect all indicators previously selected
            element.currentTarget.parentElement.firstElementChild.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
            element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";

            element.currentTarget.firstElementChild.style.borderLeft = "3px solid #2f96ea";

            switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        // Subfeed 1	
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 2":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 3":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 4":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 5":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 6":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 7":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 8":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 9":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 10":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 11":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 12":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 13":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 14":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
            }
        }

        // When the Settings and Meters icon is clicked in the Right Split View
        $scope.invokeSubfeedUserConfigDetails = function(){

            // To show the Settings Table
            if($scope.meterView == true){
                $scope.meterView = false;
                $scope.settingsView = true;
            }else{
                $scope.meterView = true;
                $scope.settingsView = false;
            }		

            // Display and Bind Settings View
            if($scope.settingsView){

                $scope.editMode = false;
                $scope.subfeedUserConfigDetails = null;

                switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 2":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 3":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 4":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 5":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 6":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 7":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 8":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 9":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 10":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 11":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 12":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 13":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 14":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;

                }
            }
            //Display and Bind Meters View
            else{
                switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        // Subfeed 1	
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==0){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 2":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==1){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 3":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==2){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 4":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==3){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 5":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==4){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }

                    break;
                    case "Subfeed 6":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==5){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 7":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==6){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 8":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==7){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 9":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==8){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 10":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==9){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 11":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==10){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 12":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==11){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 13":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==12){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                    case "Subfeed 14":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subFeedDetails = response;

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                        for(var i=0; i<$scope.styleIndicator.length; i++){
                            if(i==13){
                                $scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
                            }else{
                                $scope.styleIndicator[i] = 'border-left: 0';
                            }
                        }
                    break;
                }
            }
        }

        // When the close button from the Right Split View is clicked
        $scope.subfeedList = function($event, i) {
            var element = $event;				
            var subfeeds = element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.firstElementChild;
            for(var i=0; i<14; i++){
                subfeeds.firstElementChild.style.borderLeft = "0";
                subfeeds = subfeeds.nextElementSibling;
            }

            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.style.display = 'none';
            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.style.display = 'none';
            $(".bcm-meters-table-outer-content").css("width","350px");		
            element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.style.display = 'block';				
        }

        // Edit and Bind the required value
        $scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2){
            if($scope.editMode == false){
                $scope.editMode = true;
            }

            $scope.subfeedUserConfigDetails.requiredParameter2 = data;
        }

        $scope.saveChanges = function(){
            var postBody = $scope.subfeedUserConfigDetails;

            switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 2":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 3":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 4":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 5":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 6":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 7":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 8":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 9":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 10":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10, postBody, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 11":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 12":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 13":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 14":
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14, postBody)
                            .success(function(response) {	
                                    console.log(response);

                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;

                }

                $scope.editMode = false;

        }

        $scope.discardChanges = function(){		
            $scope.editMode = false;
        }

        $scope.invokeServices = function(){	

            // To have the Subfeed Detail View panel with the selected Subfeed details
            switch($scope.subfeedNumber){
                    case "Subfeed 1":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 2":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 3":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 4":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 5":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 6":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 7":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 8":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 9":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 10":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 11":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 12":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 13":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
                    case "Subfeed 14":
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                            .success(function(response) {	
                                    $scope.subfeedUserConfigDetails = response;							
                            }).catch(function (response){
                                    $scope.networkFailure=true;
                            });
                    break;
            }

            // Subfeed 1	
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
                .success(function(response) {

                    $scope.subFeeds = [];
                    $scope.powerLoad = [];

                    $scope.subFeeds.push(response);
                    var feed=0;
                    $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[feed]);
                    for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                        if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                            $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                        }
                    }
                    if($scope.powerLoad[feed]>100){
                        $scope.datapie1 = [100, 0];
                        $scope.colorspie1 = ["#ff0000", "#272727"];
                    }else{
                        $scope.colorspie1 = ["#0b74da", "#272727"];
                        $scope.datapie1 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                    }

                    $scope.labelspie1 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                    $scope.optionspie1 = {
                                              responsive: false,
                                              rotation: 1 * (3/4*Math.PI),
                                              circumference: 1 * (3/2*Math.PI),
                                              cutoutPercentage: 86,
                                              elements: { arc: { 
                                                                    borderWidth: 0,
                                                                    borderColor: '#0b74da'
                                                                } 
                                                        },
                                               animation: false
                                        };

                    // Subfeed 2
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
                        .success(function(response) {	
                            $scope.subFeeds.push(response);
                            var feed=1;
                            $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                            for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                    $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                }
                            }
                            if($scope.powerLoad[feed]>100){
                                $scope.datapie2 = [100, 0];
                                $scope.colorspie2 = ["#ff0000", "#272727"];
                            }else{
                                $scope.colorspie2 = ["#0b74da", "#272727"];
                                $scope.datapie2 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                            }

                            $scope.labelspie2 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];						
                            $scope.optionspie2 = {
                                                      responsive: false,
                                                      rotation: 1 * (3/4*Math.PI),
                                                      circumference: 1 * (3/2*Math.PI),
                                                      cutoutPercentage: 86,
                                                      elements: { arc: { 
                                                                            borderWidth: 0,
                                                                            borderColor: '#0b74da'
                                                                        } 
                                                                },
                                                       animation: false
                                                };

                            // Subfeed 3
                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
                            .success(function(response) {						
                                $scope.subFeeds.push(response);
                                var feed=2;
                                $scope.powerLoad.push($scope.subFeeds[2].Power.Load[0]);
                                for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                    if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                        $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                    }
                                }
                                if($scope.powerLoad[feed]>100){
                                    $scope.datapie3 = [100, 0];
                                    $scope.colorspie3 = ["#ff0000", "#272727"];
                                }else{
                                    $scope.colorspie3 = ["#0b74da", "#272727"];
                                    $scope.datapie3 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                }

                                $scope.labelspie3 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                $scope.optionspie3 = {
                                                           responsive: false,
                                                          rotation: 1 * (3/4*Math.PI),
                                                          circumference: 1 * (3/2*Math.PI),
                                                          cutoutPercentage: 86,
                                                          elements: { arc: { 
                                                                                borderWidth: 0,
                                                                                borderColor: '#0b74da'
                                                                            } 
                                                                    },
                                                           animation: false
                                                    };

                                // Subfeed 4
                                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
                                .success(function(response) {						
                                    $scope.subFeeds.push(response);
                                    var feed=3;
                                    $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                    for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                        if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                            $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                        }
                                    }
                                    if($scope.powerLoad[feed]>100){
                                        $scope.datapie4 = [100, 0];
                                        $scope.colorspie4 = ["#ff0000", "#272727"];
                                    }else{
                                        $scope.colorspie4 = ["#0b74da", "#272727"];
                                        $scope.datapie4 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                    }

                                    $scope.labelspie4 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                    $scope.optionspie4 = {
                                                               responsive: false,
                                                              rotation: 1 * (3/4*Math.PI),
                                                              circumference: 1 * (3/2*Math.PI),
                                                              cutoutPercentage: 86,
                                                              elements: { arc: { 
                                                                                    borderWidth: 0,
                                                                                    borderColor: '#0b74da'
                                                                                } 
                                                                        },
                                                               animation: false
                                                        };

                                    // Subfeed 5
                                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
                                    .success(function(response) {						
                                        $scope.subFeeds.push(response);
                                        var feed=4;
                                        $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                        for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                            if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                            }
                                        }
                                        if($scope.powerLoad[feed]>100){
                                            $scope.datapie5 = [100, 0];
                                            $scope.colorspie5 = ["#ff0000", "#272727"];
                                        }else{
                                            $scope.colorspie5 = ["#0b74da", "#272727"];
                                            $scope.datapie5 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                        }

                                        $scope.labelspie5 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                        $scope.optionspie5 = {
                                                                   responsive: false,
                                                                  rotation: 1 * (3/4*Math.PI),
                                                                  circumference: 1 * (3/2*Math.PI),
                                                                  cutoutPercentage: 86,
                                                                  elements: { arc: { 
                                                                                        borderWidth: 0,
                                                                                        borderColor: '#0b74da'
                                                                                    } 
                                                                            },
                                                                   animation: false
                                                            };

                                        // Subfeed 6
                                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
                                        .success(function(response) {						
                                            $scope.subFeeds.push(response);
                                            var feed=5;
                                            $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                            for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                    $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                }
                                            }
                                            if($scope.powerLoad[feed]>100){
                                                $scope.datapie6 = [100, 0];
                                                $scope.colorspie6 = ["#ff0000", "#272727"];
                                            }else{
                                                $scope.colorspie6 = ["#0b74da", "#272727"];
                                                $scope.datapie6 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                            }

                                            $scope.labelspie6 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                            $scope.optionspie6 = {
                                                                       responsive: false,
                                                                      rotation: 1 * (3/4*Math.PI),
                                                                      circumference: 1 * (3/2*Math.PI),
                                                                      cutoutPercentage: 86,
                                                                      elements: { arc: { 
                                                                                            borderWidth: 0,
                                                                                            borderColor: '#0b74da'
                                                                                        } 
                                                                                },
                                                                       animation: false
                                                                };

                                            // Subfeed 7
                                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
                                            .success(function(response) {						
                                                $scope.subFeeds.push(response);
                                                var feed=6;
                                                $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                    if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                        $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                    }
                                                }
                                                if($scope.powerLoad[feed]>100){
                                                    $scope.datapie7 = [100, 0];
                                                    $scope.colorspie7 = ["#ff0000", "#272727"];
                                                }else{
                                                    $scope.colorspie7 = ["#0b74da", "#272727"];
                                                    $scope.datapie7 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                }

                                                $scope.labelspie7 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                $scope.optionspie7 = {
                                                                           responsive: false,
                                                                          rotation: 1 * (3/4*Math.PI),
                                                                          circumference: 1 * (3/2*Math.PI),
                                                                          cutoutPercentage: 86,
                                                                          elements: { arc: { 
                                                                                                borderWidth: 0,
                                                                                                borderColor: '#0b74da'
                                                                                            } 
                                                                                    },
                                                                           animation: false
                                                                    };

                                                // Subfeed 8
                                                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
                                                .success(function(response) {						
                                                    $scope.subFeeds.push(response);
                                                    var feed=7;
                                                    $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                    for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                        if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                            $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                        }
                                                    }
                                                    if($scope.powerLoad[feed]>100){
                                                        $scope.datapie8 = [100, 0];
                                                        $scope.colorspie8 = ["#ff0000", "#272727"];
                                                    }else{
                                                        $scope.colorspie8 = ["#0b74da", "#272727"];
                                                        $scope.datapie8 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                    }

                                                    $scope.labelspie8 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                    $scope.optionspie8 = {
                                                                               responsive: false,
                                                                              rotation: 1 * (3/4*Math.PI),
                                                                              circumference: 1 * (3/2*Math.PI),
                                                                              cutoutPercentage: 86,
                                                                              elements: { arc: { 
                                                                                                    borderWidth: 0,
                                                                                                    borderColor: '#0b74da'
                                                                                                } 
                                                                                        },
                                                                               animation: false
                                                                        };
                                                // Subfeed 9
                                                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
                                                .success(function(response) {						
                                                    $scope.subFeeds.push(response);
                                                    var feed=8;
                                                    $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                    for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                        if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                            $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                        }
                                                    }
                                                    if($scope.powerLoad[feed]>100){
                                                        $scope.datapie9 = [100, 0];
                                                        $scope.colorspie9 = ["#ff0000", "#272727"];
                                                    }else{
                                                        $scope.colorspie9 = ["#0b74da", "#272727"];
                                                        $scope.datapie9 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                    }

                                                    $scope.labelspie9 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                    $scope.optionspie9 = {
                                                                               responsive: false,
                                                                              rotation: 1 * (3/4*Math.PI),
                                                                              circumference: 1 * (3/2*Math.PI),
                                                                              cutoutPercentage: 86,
                                                                              elements: { arc: { 
                                                                                                    borderWidth: 0,
                                                                                                    borderColor: '#0b74da'
                                                                                                } 
                                                                                        },
                                                                               animation: false
                                                                        };

                                                    // Subfeed 10
                                                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
                                                    .success(function(response) {						
                                                        $scope.subFeeds.push(response);
                                                        var feed=9;
                                                        $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                        for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                            if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                                $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                            }
                                                        }
                                                        if($scope.powerLoad[feed]>100){
                                                            $scope.datapie10 = [100, 0];
                                                            $scope.colorspie10 = ["#ff0000", "#272727"];
                                                        }else{
                                                            $scope.colorspie10 = ["#0b74da", "#272727"];
                                                            $scope.datapie10 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                        }

                                                        $scope.labelspie10 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                        $scope.optionspie10 = {
                                                                                   responsive: false,
                                                                                  rotation: 1 * (3/4*Math.PI),
                                                                                  circumference: 1 * (3/2*Math.PI),
                                                                                  cutoutPercentage: 86,
                                                                                  elements: { arc: { 
                                                                                                        borderWidth: 0,
                                                                                                        borderColor: '#0b74da'
                                                                                                    } 
                                                                                            },
                                                                                   animation: false
                                                                            };

                                                        // Subfeed 11
                                                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
                                                        .success(function(response) {						
                                                            $scope.subFeeds.push(response);
                                                            var feed=10;
                                                            $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                            for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                                if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                                    $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                                }
                                                            }
                                                            if($scope.powerLoad[feed]>100){
                                                                $scope.datapie11 = [100, 0];
                                                                $scope.colorspie11 = ["#ff0000", "#272727"];
                                                            }else{
                                                                $scope.colorspie11 = ["#0b74da", "#272727"];
                                                                $scope.datapie11 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                            }

                                                            $scope.labelspie11 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                            $scope.optionspie11 = {
                                                                                       responsive: false,
                                                                                      rotation: 1 * (3/4*Math.PI),
                                                                                      circumference: 1 * (3/2*Math.PI),
                                                                                      cutoutPercentage: 86,
                                                                                      elements: { arc: { 
                                                                                                            borderWidth: 0,
                                                                                                            borderColor: '#0b74da'
                                                                                                        } 
                                                                                                },
                                                                                       animation: false
                                                                                };

                                                            // Subfeed 12
                                                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
                                                            .success(function(response) {						
                                                                $scope.subFeeds.push(response);
                                                                var feed=11;
                                                                $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                                for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                                    if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                                        $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                                    }
                                                                }
                                                                if($scope.powerLoad[feed]>100){
                                                                    $scope.datapie12 = [100, 0];
                                                                    $scope.colorspie12 = ["#ff0000", "#272727"];
                                                                }else{
                                                                    $scope.colorspie12 = ["#0b74da", "#272727"];
                                                                    $scope.datapie12 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                                }

                                                                $scope.labelspie12 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                                $scope.optionspie12 = {
                                                                                           responsive: false,
                                                                                          rotation: 1 * (3/4*Math.PI),
                                                                                          circumference: 1 * (3/2*Math.PI),
                                                                                          cutoutPercentage: 86,
                                                                                          elements: { arc: { 
                                                                                                                borderWidth: 0,
                                                                                                                borderColor: '#0b74da'
                                                                                                            } 
                                                                                                    },
                                                                                           animation: false
                                                                                    };

                                                        // Subfeed 13
                                                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
                                                        .success(function(response) {						
                                                            $scope.subFeeds.push(response);
                                                            var feed=12;
                                                            $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                            for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                                if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                                    $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                                }
                                                            }
                                                            if($scope.powerLoad[feed]>100){
                                                                $scope.datapie13 = [100, 0];
                                                                $scope.colorspie13 = ["#ff0000", "#272727"];
                                                            }else{
                                                                $scope.colorspie13 = ["#0b74da", "#272727"];
                                                                $scope.datapie13 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                            }

                                                            $scope.labelspie13 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                            $scope.optionspie13 = {
                                                                                       responsive: false,
                                                                                      rotation: 1 * (3/4*Math.PI),
                                                                                      circumference: 1 * (3/2*Math.PI),
                                                                                      cutoutPercentage: 86,
                                                                                      elements: { arc: { 
                                                                                                            borderWidth: 0,
                                                                                                            borderColor: '#0b74da'
                                                                                                        } 
                                                                                                },
                                                                                       animation: false
                                                                                };

                                                            // Subfeed 14
                                                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
                                                            .success(function(response) {						
                                                                $scope.subFeeds.push(response);
                                                                var feed=13;
                                                                $scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
                                                                for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
                                                                    if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
                                                                        $scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
                                                                    }
                                                                }
                                                                if($scope.powerLoad[feed]>100){
                                                                    $scope.datapie14 = [100, 0];
                                                                    $scope.colorspie14 = ["#ff0000", "#272727"];
                                                                }else{
                                                                    $scope.colorspie4 = ["#0b74da", "#272727"];
                                                                    $scope.datapie14 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
                                                                }

                                                                $scope.labelspie14 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];															
                                                                $scope.optionspie14 = {
                                                                                           responsive: false,
                                                                                          rotation: 1 * (3/4*Math.PI),
                                                                                          circumference: 1 * (3/2*Math.PI),
                                                                                          cutoutPercentage: 86,
                                                                                          elements: { arc: { 
                                                                                                                borderWidth: 0,
                                                                                                                borderColor: '#0b74da'
                                                                                                            } 
                                                                                                    },
                                                                                           animation: false
                                                                                    };

                                                            }).catch(function (response){
                                                                $scope.networkFailure=true;
                                                            });

                                                        }).catch(function (response){
                                                            $scope.networkFailure=true;
                                                        });

                                                            }).catch(function (response){
                                                                $scope.networkFailure=true;
                                                            });

                                                        }).catch(function (response){
                                                            $scope.networkFailure=true;
                                                        });

                                                    }).catch(function (response){
                                                        $scope.networkFailure=true;
                                                    });

                                                }).catch(function (response){
                                                    $scope.networkFailure=true;
                                                });

                                                }).catch(function (response){
                                                    $scope.networkFailure=true;
                                                });

                                            }).catch(function (response){
                                                $scope.networkFailure=true;
                                            });

                                        }).catch(function (response){
                                            $scope.networkFailure=true;
                                        });

                                    }).catch(function (response){
                                        $scope.networkFailure=true;
                                    });

                                }).catch(function (response){
                                    $scope.networkFailure=true;
                                });

                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });

                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });



                }).catch(function (response){
                    $scope.networkFailure=true;
                });

                $scope.subFeeds.splice(1, 1);

        }

        $scope.fixPieText = false;
        $scope.invokeServices();

        $scope.panelStatusChanged = function($event, i){
            var element = $event;	
            $scope.fixPieText = true;		
            $scope.invokeServices();
        }

        // Setting the text
        Chart.pluginService.register({
          beforeDraw: function(chart) {

                // For Pie Chart
                if(chart.config.type == "doughnut"){

                    var width = chart.chart.width,
                        height = chart.chart.height/1.25,
                        ctx = chart.chart.ctx;
                    if($scope.fixPieText){
                        ctx.clearRect(0, 0, width, height);
                    }
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#d2d2d2';

                    var fontSize = (height / 57).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Medium";

                    switch(ctx.canvas.id){
                        case 'pieChart1':	
                            if($scope.subFeeds.length>=1){
                                var text = $scope.subFeeds[0].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;							
                                ctx.fillText(text, textX, textY);
                            }						
                            break;
                        case 'pieChart2':					
                            if($scope.subFeeds.length>=2){
                                var text = $scope.subFeeds[1].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }	
                            break;
                        case 'pieChart3':					
                            if($scope.subFeeds.length>=3){
                                var text = $scope.subFeeds[2].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }							
                            break;
                        case 'pieChart4':
                            if($scope.subFeeds.length>=4){
                                var text = $scope.subFeeds[3].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }	
                            break;
                        case 'pieChart5':
                            if($scope.subFeeds.length>=5){
                                var text = $scope.subFeeds[4].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }	
                            break;
                        case 'pieChart6':
                            if($scope.subFeeds.length>=6){
                                var text = $scope.subFeeds[5].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }	
                            break;
                        case 'pieChart7':	
                            if($scope.subFeeds.length>=7){
                                var text = $scope.subFeeds[6].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart8':
                            if($scope.subFeeds.length>=8){
                                var text = $scope.subFeeds[7].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart9':
                            if($scope.subFeeds.length>=9){
                                var text = $scope.subFeeds[8].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart10':	
                            if($scope.subFeeds.length>=10){
                                var text = $scope.subFeeds[9].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart11':	
                            if($scope.subFeeds.length>=11){
                                var text = $scope.subFeeds[10].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart12':
                            if($scope.subFeeds.length>=12){
                                var text = $scope.subFeeds[11].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart13':	
                            if($scope.subFeeds.length>=13){
                                var text = $scope.subFeeds[12].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                        case 'pieChart14':
                            if($scope.subFeeds.length>=14){
                                var text = $scope.subFeeds[13].Power.TotalkW,
                                textX = Math.round((width - ctx.measureText(text).width)/2),
                                textY = height/2*1.5;
                                ctx.fillText(text, textX, textY);
                            }
                            break;
                    }


                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em HelveticaNeueETPro-Light";
                    var text = "kW",
                            textX = Math.round((width - ctx.measureText(text).width)/2),
                            textY = height/2*2;
                    ctx.fillText(text, textX, textY)

                    ctx.save();

                }

          }
        });


    });


    //BCM Controllers
    app.controller('BcmHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'Remote Power Panel' + ' - '+$rootScope.selectedDeviceId;
        $rootScope.activeEventsDisplay = false;
        $scope.showCanvas = true;
        $scope.editMode = false;
        //$scope.panelConfigEditMode = false;
        $scope.toggleViewMode = {"graph": true, "table": false, "settings": false};

        $scope.panelNumbers = [];
        for(var i=1; i<=4; i++){
            $scope.panelNumbers.push(i);
        }
        $scope.selectedPanelNumber = $scope.panelNumbers[0];

        $scope.panelChanged = function(item){
            $scope.selectedPanelNumber = item;

            // API call for Panel Limits View
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelNumber)
                .success(function(response) {
                    $scope.panelConfigLimitsAlarm = response.Alarm;
                    $scope.panelConfigLimitsWarning = response.Warning;
                    $scope.panelLimits = response;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });

            // Panel Config API
            $scope.panelConfigs = [];				
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1')
                .success(function(response) {

                    if(response.PanelConfig.OnOff == 'On'){
                        response.PanelConfig.OnOff = true;
                    }
                    else{
                        response.PanelConfig.OnOff = false;
                    }

                    $scope.panelConfigs.push(response.PanelConfig);						
                    $scope.panelConfigs[0].panelNumber = '1';

                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2')
                    .success(function(response) {

                        if(response.PanelConfig.OnOff == 'On'){
                            response.PanelConfig.OnOff = true;
                        }
                        else{
                            response.PanelConfig.OnOff = false;
                        }

                        $scope.panelConfigs.push(response.PanelConfig);
                        $scope.panelConfigs[1].panelNumber = '2';

                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3')
                        .success(function(response) {

                            if(response.PanelConfig.OnOff == 'On'){
                                response.PanelConfig.OnOff = true;
                            }
                            else{
                                response.PanelConfig.OnOff = false;
                            }

                            $scope.panelConfigs.push(response.PanelConfig);
                            $scope.panelConfigs[2].panelNumber = '3';

                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4')
                            .success(function(response) {

                                if(response.PanelConfig.OnOff == 'On'){
                                    response.PanelConfig.OnOff = true;
                                }
                                else{
                                    response.PanelConfig.OnOff = false;
                                }

                                $scope.panelConfigs.push(response.PanelConfig);	
                                $scope.panelConfigs[3].panelNumber = '4';
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }


        // To toggle between Graph & Table View
        $scope.toggleViewTableGraph = function($event, i) {
            var element = $event;
            var filterItem = element.currentTarget.id.trim();

            switch(filterItem){
                case "graphModeId":
                    $scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
                    break;
                case "tableModeId":
                    $scope.toggleViewMode = {"graph": false, "table": true, "settings": false};
                break;
                case "settingsModeId":
                {
                    $scope.toggleViewMode = {"graph": false, "table": false, "settings": true};


                    // Settings related Code

                    // Global Attributes
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchGlobalConfig/attributes/'+$rootScope.selectedDeviceId)
                        .success(function(response) {
                            $scope.gloablConfigAttributes = response;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

                    // Panel Limits Attributes
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/attributes/'+$rootScope.selectedDeviceId)
                        .success(function(response) {
                            $scope.panelLimitsAttributes = response;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

                    // Panel Config Attributes
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/attributes/'+$rootScope.selectedDeviceId)
                        .success(function(response) {
                            $scope.panelConfigAttributes = response.PanelConfig;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });



                    // API call for Panel Limits View
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId)
                        .success(function(response) {
                            $scope.panelConfigLimitsAlarm = response.Alarm;
                            $scope.panelConfigLimitsWarning = response.Warning;
                            $scope.panelLimits = response;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

                    // Panel Config API
                    $scope.panelConfigs = [];				
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1')
                        .success(function(response) {

                            if(response.PanelConfig.OnOff == 'On'){
                                response.PanelConfig.OnOff = true;
                            }
                            else{
                                response.PanelConfig.OnOff = false;
                            }

                            $scope.panelConfigs.push(response.PanelConfig);						
                            $scope.panelConfigs[0].panelNumber = '1';

                            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2')
                            .success(function(response) {

                                if(response.PanelConfig.OnOff == 'On'){
                                    response.PanelConfig.OnOff = true;
                                }
                                else{
                                    response.PanelConfig.OnOff = false;
                                }

                                $scope.panelConfigs.push(response.PanelConfig);
                                $scope.panelConfigs[1].panelNumber = '2';

                                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3')
                                .success(function(response) {

                                    if(response.PanelConfig.OnOff == 'On'){
                                        response.PanelConfig.OnOff = true;
                                    }
                                    else{
                                        response.PanelConfig.OnOff = false;
                                    }

                                    $scope.panelConfigs.push(response.PanelConfig);
                                    $scope.panelConfigs[2].panelNumber = '3';

                                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4')
                                    .success(function(response) {

                                        if(response.PanelConfig.OnOff == 'On'){
                                            response.PanelConfig.OnOff = true;
                                        }
                                        else{
                                            response.PanelConfig.OnOff = false;
                                        }

                                        $scope.panelConfigs.push(response.PanelConfig);	
                                        $scope.panelConfigs[3].panelNumber = '4';
                                    }).catch(function (response){
                                        $scope.networkFailure=true;
                                    });
                                }).catch(function (response){
                                    $scope.networkFailure=true;
                                });

                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

                }
                break;
            }

            // Setting the style for Graph/Table/Settings Link
            var currentItem = element.currentTarget.parentElement.firstElementChild;
            for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
            {
                // Reset the class name of each element
                currentItem.className = '';			
                if(currentItem.id.trim() == filterItem){
                    currentItem.className = 'active-text-link';
                }
                currentItem = currentItem.nextElementSibling
            }

        }

        // For Editing Global view	
        $scope.postData = {
                                    'Alarm':	{
                                        'OverCurrent':	'',
                                        'UnderCurrent':	'',
                                        'Delay':	''
                                    },
                                    'Warning':	{
                                        'OverCurrent':	'',
                                        'Delay':	''
                                    }
                                }

        $scope.updateData = function(data, requiredParameter){	

            switch(requiredParameter){
                case 'warningOverCurrent':
                    $scope.postData.Warning.OverCurrent = data;
                    break;
                case 'alarmOverCurrent':
                    $scope.postData.Alarm.OverCurrent = data;
                    break;
                case 'alarmUnderCurrent':
                    $scope.postData.Alarm.UnderCurrent = data;
                    break;
                case 'warningDelay':
                    $scope.postData.Warning.Delay = data;
                    break;
                case 'alarmDelay':
                    $scope.postData.Alarm.Delay = data;
                    break;

            }
        }

        // Functionality for editing the checkbox parameters in Settings
        $scope.editModeFeatureState = function(parameter, panelConfig){
            $scope.filterItemSubmenu = panelConfig;
            if($scope.filterItemSubmenu == 'Panel Configuration'){
                $scope.editMode = true;
                //$scope.panelConfigEditMode = true;
                $scope.requiredParameter2 = parameter;			
            }else if($scope.editMode == false){
                $scope.editMode = true;
            }			
        }

        // Edit and Bind the required value
        $scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2, requiredParameter3){
            $scope.filterItemSubmenu = requiredParameter3;
            if($scope.editMode == false){
                $scope.editMode = true;
            }
            switch($scope.filterItemSubmenu){
                    case 'Panel Limits':
                        $scope.panelLimits[requiredParameter][requiredParameter2] = data;					
                        break;
                    case 'Branch':
                        $scope.branchInfo[requiredParameter][requiredParameter2] = data;
                        break;
                    case 'Panel Configuration':
                        $scope.editMode = true;
                        //$scope.panelConfigEditMode = true;
                        $scope.panelConfigs[requiredParameter2-1][requiredParameter] = data;
                        $scope.requiredParameter2 = requiredParameter2;
                        break;
            }
        }

        // Global Screen functionality
        $scope.submitData = function($event){	

            $scope.panelNumber = document.getElementById("panelNumber").value;

            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchGlobalConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.panelNumber, $scope.postData)
                .success(function(response) {
                    var test = response;
                    $scope.resetGlobalFields();
                }).catch(function (response){
                    $scope.networkFailure=true;
                });

        }

        $scope.resetGlobalFields = function(){
            document.getElementById("panelNumber").value = '';
            document.getElementById("ocwLimit").value = '';
            document.getElementById("ocaLimit").value = '';
            document.getElementById("ucaLimit").value = '';
            document.getElementById("cwDelay").value = '';
            document.getElementById("caDelay").value = '';	
        }

        $scope.saveChanges = function(){
            var postBody = null;
            $scope.editMode = false;
            //$scope.panelConfigEditMode = false;
            switch($scope.filterItemSubmenu){				
                    case 'Panel Limits':
                        postBody = JSON.parse(JSON.stringify($scope.panelLimits));					
                        // POST API call
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelNumber, postBody)						
                            .success(function(response) {
                                var test = response;
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });	
                        break;
                    case 'Panel Configuration':		
                        for(var i=0; i<$scope.panelConfigs.length; i++){
                            delete $scope.panelConfigs[i]['$$hashKey'];				
                        }
                        postBody = JSON.parse(JSON.stringify($scope.panelConfigs[$scope.requiredParameter2-1]));
                        delete postBody['panelNumber'];
                        postBody = { "PanelConfig":  postBody};

                        if(postBody.PanelConfig.OnOff == true){
                            postBody.PanelConfig.OnOff = 'On';
                        }else{
                            postBody.PanelConfig.OnOff = 'Off';	
                        }

                        // POST API call
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.requiredParameter2, postBody)						
                            .success(function(response) {
                                var test = response;
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                        break;
                    case 'Branch':
                        postBody = JSON.parse(JSON.stringify($scope.branchInfo));
                        if(postBody.State.OnOff == true){
                            postBody.State.OnOff = 'On';
                        }else{
                            postBody.State.OnOff = 'Off';	
                        }
                        // POST API call
                        $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$scope.selectedMeterNumber, postBody)						
                            .success(function(response) {
                                var test = response;
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                        break;
            }
        }

        $scope.discardChanges = function(){
            $scope.editMode = false;
        }

        $scope.options = {
                            responsive: true,
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {								
                                    boxWidth: 20
                                }
                            },
                            scales: {
                                xAxes: [{
                                    categoryPercentage: 0.25,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            },
                           showAllTooltips: true,
                           tooltipEvents: [],	
                           onAnimationComplete: function() {
                                this.showTooltip(this.segments, true);
                            }
                        };

        $scope.colorsVoltageHarmonics =	[
                          {
                            backgroundColor: '#2E92FA'
                          },
                          {
                            backgroundColor: 'orange'
                          }
                         ];
        $scope.labelsVoltageHarmonics = ['A', 'B', 'C'];
        $scope.seriesVoltageHarmonics = ['Voltage', 'Load'];

        $scope.invokeServices = function(){

            // API call for Panel 1			
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1').
                success(function(response) {
                $scope.panelConfig1 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/1').
                    success(function(response) {
                        $scope.currentResponse1 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/1').
                            success(function(response) {
                                $scope.voltageResponse1 = response;
                                $scope.voltageResponseValue1 =JSON.parse(JSON.stringify($scope.voltageResponse1));
                                switch($scope.voltageResponse1.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse1.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse1.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse1.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse1.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse1.Voltage.L1 = $scope.voltageResponse1.Voltage.L1/$scope.panelConfig1.VoltRating * 100;
                                $scope.voltageResponse1.Voltage.L2 = $scope.voltageResponse1.Voltage.L2/$scope.panelConfig1.VoltRating * 100;		
                                $scope.voltageResponse1.Voltage.L3= $scope.voltageResponse1.Voltage.L3/$scope.panelConfig1.VoltRating * 100;

                                $scope.height_chart = $(".card-layout-bcm-home").height() * 0.9;
                                $scope.width_chart = $(".card-layout-bcm-home").width() * 0.75;
                                $scope.panelData1 = 	[
                                                            [$scope.voltageResponse1.Voltage.L1,
                                                            $scope.voltageResponse1.Voltage.L2, 
                                                            $scope.voltageResponse1.Voltage.L3],
                                                            [$scope.currentResponse1.Load.L1,
                                                            $scope.currentResponse1.Load.L2,
                                                            $scope.currentResponse1.Load.L3,
                                                            ]
                                                    ];


                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 2	
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2').
                success(function(response) {
                $scope.panelConfig2 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/2').
                    success(function(response) {
                        $scope.currentResponse2 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/2').
                            success(function(response) {
                                $scope.voltageResponse2 = response;
                                $scope.voltageResponseValue2 =JSON.parse(JSON.stringify($scope.voltageResponse2));
                                switch($scope.voltageResponse2.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse2.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse2.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageRespons2.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse2.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse2.Voltage.L1 = $scope.voltageResponse2.Voltage.L1/$scope.panelConfig2.VoltRating * 100;
                                $scope.voltageResponse2.Voltage.L2 = $scope.voltageResponse2.Voltage.L2/$scope.panelConfig2.VoltRating * 100;		
                                $scope.voltageResponse2.Voltage.L3= $scope.voltageResponse2.Voltage.L3/$scope.panelConfig2.VoltRating * 100;

                                $scope.panelData2 = [	[$scope.voltageResponse2.Voltage.L1,
                                                $scope.voltageResponse2.Voltage.L2, 
                                                $scope.voltageResponse2.Voltage.L3],
                                                [$scope.currentResponse2.Load.L1,
                                                $scope.currentResponse2.Load.L2,
                                                $scope.currentResponse2.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 3

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3').
                success(function(response) {
                $scope.panelConfig3 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/3').
                    success(function(response) {
                        $scope.currentResponse3 = response;					
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/3').
                            success(function(response) {
                                $scope.voltageResponse3 = response;
                                $scope.voltageResponseValue3 =JSON.parse(JSON.stringify($scope.voltageResponse3));
                                switch($scope.voltageResponse3.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse3.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse3.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse3.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse3.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse3.Voltage.L1 = $scope.voltageResponse3.Voltage.L1/$scope.panelConfig3.VoltRating * 100;
                                $scope.voltageResponse3.Voltage.L2 = $scope.voltageResponse3.Voltage.L2/$scope.panelConfig3.VoltRating * 100;		
                                $scope.voltageResponse3.Voltage.L3= $scope.voltageResponse3.Voltage.L3/$scope.panelConfig3.VoltRating * 100;

                                $scope.panelData3 = [	[$scope.voltageResponse3.Voltage.L1,
                                                $scope.voltageResponse3.Voltage.L2, 
                                                $scope.voltageResponse3.Voltage.L3],
                                                [$scope.currentResponse3.Load.L1,
                                                $scope.currentResponse3.Load.L2,
                                                $scope.currentResponse3.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for Panel 4

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4').
                success(function(response) {
                $scope.panelConfig4 = response.PanelConfig;

                // API call for Current
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/4').
                    success(function(response) {
                        $scope.currentResponse4 = response;
                        // API call for Voltage
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/4').
                            success(function(response) {
                                $scope.voltageResponse4 = response;							
                                $scope.voltageResponseValue4 =JSON.parse(JSON.stringify($scope.voltageResponse4));

                                switch($scope.voltageResponse4.Status.Status)
                                {
                                    case 'Unknown':
                                        $scope.voltageResponse4.Status.Status = 'UnknownIcon';
                                        break;

                                    case 'Alarm':
                                        $scope.voltageResponse4.Status.Status = 'AlarmIcon';
                                        break;

                                    case 'Warning':
                                        $scope.voltageResponse4.Status.Status = 'WarningIcon';
                                        break;

                                    case 'Normal':
                                        $scope.voltageResponse4.Status.Status = 'UI_Normal';
                                        break;
                                }
                                $scope.voltageResponse4.Voltage.L1 = $scope.voltageResponse4.Voltage.L1/$scope.panelConfig4.VoltRating * 100;
                                $scope.voltageResponse4.Voltage.L2 = $scope.voltageResponse4.Voltage.L2/$scope.panelConfig4.VoltRating * 100;		
                                $scope.voltageResponse4.Voltage.L3= $scope.voltageResponse4.Voltage.L3/$scope.panelConfig4.VoltRating * 100;

                                $scope.panelData4 = [	[$scope.voltageResponse4.Voltage.L1,
                                                $scope.voltageResponse4.Voltage.L2, 
                                                $scope.voltageResponse4.Voltage.L3],
                                                [$scope.currentResponse4.Load.L1,
                                                $scope.currentResponse4.Load.L2,
                                                $scope.currentResponse4.Load.L3,
                                                ]
                                                 ];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


            }).catch(function (response){
                $scope.networkFailure=true;
            });




        }

        $scope.invokeServices(); // Initial Call
        $scope.bcmHomePromise = $interval(function(){$scope.invokeServices()}, DATADELAY);

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.bcmHomePromise);
        });
    });

    app.controller('BcmMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'Remote Power Panel'+ ' - '+$rootScope.selectedDeviceId;
        $rootScope.activeEventsDisplay = false;
        $scope.meterNumbers = [];
        $rootScope.paginationNumbersBcmMeters = [];

        $scope.panelNumbers = [];
        for(var i=1; i<=4; i++){
            $scope.panelNumbers.push(i);
        }
        $scope.selectedPanel = $scope.panelNumbers[0];

        for(var i=1; i<=42; i=i+3){
            $scope.meterNumbers.push(i);
        }
        $rootScope.selectedPanelBcmMeters = '1';

        $scope.invokeServices = function(){			
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeterGrouped/submeters/'+$rootScope.selectedDeviceId+'/'+ $scope.selectedPanel + '/' +$rootScope.selectedPanelBcmMeters)
                .success(function(response) {	

                        $scope.panelStates = response.Config.State;
                        $scope.panelStatuses = response.Meter.Status;
                        for(var i=0; i<$scope.panelStates.length; i++){
                            if($scope.panelStates[i] == "On")
                                 $scope.panelStates[i] = true;
                            else
                                $scope.panelStates[i] = false;
                        }
                        for(i=0; i<$scope.panelStatuses.length; i++){

                            switch($scope.panelStatuses[i])
                            {
                                case 'Unknown':
                                    $scope.panelStatuses[i] = 'UnknownIcon';
                                    break;

                                case 'Alarm':
                                    $scope.panelStatuses[i] = 'AlarmIcon';
                                    break;

                                case 'Warning':
                                    $scope.panelStatuses[i] = 'WarningIcon';
                                    break;

                                case 'Normal':
                                    $scope.panelStatuses[i] = 'UI_Normal';
                                    break;
                            }

                        }
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });

        }


        $scope.invokeServices(); // Initial Call
        $scope.bcmMetersPanelPromise = $interval(function(){$scope.invokeServices()}, DATADELAY);

        $scope.branchInfo = function($event) {
            var element = $event;
            $rootScope.selectedMeterNumberBcmMeters = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText;

            $rootScope.paginationNumbersBcmMeters = [];
            for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
                if(i==$rootScope.selectedMeterNumberBcmMeters){
                    $rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
                }
                else{
                    $rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
                }
            }

           /// route to bcm meters branch view
           $location.url('/bcmmetersbranchview');
        }

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.bcmMetersPanelPromise);
        });


    });


    app.controller('BcmMetersBranchViewController', function($scope, $http, $timeout, $interval, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'Remote Power Panel'+ ' - '+$rootScope.selectedDeviceId;
        $rootScope.activeEventsDisplay = false;
        $scope.branchDetailsView = false;
        $scope.branchMeterDetailsView = true;
        $scope.editMode = false;
        
        $rootScope.selectedBranchNumber = 1;
        
        $scope.panelNumbers = [];
        for(var i=1; i<=4; i++){
            $scope.panelNumbers.push(i);
        }
        $scope.selectedPanel = $scope.panelNumbers[0];

        $scope.toggleMeterSettingsView = function(){
            $scope.branchMeterDetailsView = !$scope.branchMeterDetailsView;
        }

        $scope.saveChanges = function(){
            var postBody = null;
            $scope.editMode = false;

            postBody = JSON.parse(JSON.stringify($scope.branchInfo));
            if(postBody.State.OnOff == true){
                postBody.State.OnOff = 'On';
            }else{
                postBody.State.OnOff = 'Off';	
            }
            // POST API call
            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId + '/' + $scope.selectedPanel +'/'+$rootScope.selectedMeterNumberBcmMeters, postBody)						
                .success(function(response) {
                    var test = response;
                }).catch(function (response){
                    $scope.networkFailure=true;
                });					
        }

        $scope.discardChanges = function(){
            $scope.editMode = false;
        }

        // Functionality for editing the checkbox parameters in Settings
        $scope.editModeFeatureState = function(){
            $scope.editMode = true;						
        }

        // Edit and Bind the required value
        $scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2){
            if($scope.editMode == false){
                $scope.editMode = true;
            }
            $scope.branchInfo[requiredParameter][requiredParameter2] = data;
        }

        $scope.panelChanged = function(item){
            $scope.selectedPanel = item;

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+ $rootScope.selectedDeviceId + '/' + $scope.selectedPanel + '/' +$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });

            // API call for BCM Meters Details
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
            .success(function(response) {						
                $scope.branchDetailsCurrent = response.Current;
                $scope.branchDetailsPower = response.Power;

                switch($scope.branchDetailsCurrent.Status)
                {
                    case 'Unknown':
                        $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                        break;

                    case 'Alarm':
                        $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                        break;

                    case 'Warning':
                        $scope.branchDetailsCurrent.Status = 'WarningIcon';
                        break;

                    case 'Normal':
                        $scope.branchDetailsCurrent.Status = 'UI_Normal';
                        break;
                }

            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for BCM Settings Details
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                .success(function(response) {
                    $scope.branchInfo = response;
                    if($scope.branchInfo.State.OnOff == 'On'){
                        $scope.branchInfo.State.OnOff = true;
                    }
                    else{
                        $scope.branchInfo.State.OnOff = false;
                    }
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }

        $scope.invokeServices = function(branch){
            // API call for BCM Meters Details
            //$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/7/1/'+$rootScope.selectedBranchNumber)
            .success(function(response) {						
                $scope.branchDetailsCurrent = response.Current;
                $scope.branchDetailsPower = response.Power;

                switch($scope.branchDetailsCurrent.Status)
                {
                    case 'Unknown':
                        $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                        break;

                    case 'Alarm':
                        $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                        break;

                    case 'Warning':
                        $scope.branchDetailsCurrent.Status = 'WarningIcon';
                        break;

                    case 'Normal':
                        $scope.branchDetailsCurrent.Status = 'UI_Normal';
                        break;
                }

            }).catch(function (response){
                $scope.networkFailure=true;
            });

            // API call for BCM Settings Details
            //$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/7/1/'+$rootScope.selectedBranchNumber)
                .success(function(response) {
                    $scope.branchInfo = response;
                    if($scope.branchInfo.State.OnOff == 'On'){
                        $scope.branchInfo.State.OnOff = true;
                    }
                    else{
                        $scope.branchInfo.State.OnOff = false;
                    }
                }).catch(function (response){
                    $scope.networkFailure=true;
                });				

        }
        $scope.invokeServices(); // Initial Call
        $scope.$on("onBranchClick", function(evt,data){
            $scope.invokeServices(data);
        })
        //$scope.invokeServices(); // Initial Call

        //$scope.bcmMetersPanelPromise = $interval(function(){$scope.invokeServices()}, DATADELAY);	
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.bcmMetersPanelPromise);
        });


        $scope.firstNavigationList = function($event){
            var element = $event;
            $rootScope.selectedMeterNumberBcmMeters=1;
            $rootScope.paginationNumbersBcmMeters = [];
            for(var i=1; i<22; i++){
                if(i==$rootScope.selectedMeterNumberBcmMeters){
                    $rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
                }
                else{
                    $rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
                }
            }

            $interval.cancel($scope.bcmMetersPanelPromise);

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
                .success(function(response) {						
                    $scope.branchDetailsCurrent = response.Current;
                    $scope.branchDetailsPower = response.Power;

                    switch($scope.branchDetailsCurrent.Status)
                    {
                        case 'Unknown':
                            $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                            break;

                        case 'Alarm':
                            $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                            break;

                        case 'Warning':
                            $scope.branchDetailsCurrent.Status = 'WarningIcon';
                            break;

                        case 'Normal':
                            $scope.branchDetailsCurrent.Status = 'UI_Normal';
                            break;
                    }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
        }

        $scope.lastNavigationList = function($event){
            var element = $event;
            $rootScope.selectedMeterNumberBcmMeters=22;
            $rootScope.paginationNumbersBcmMeters = [];
            for(var i=22; i<43; i++){
                if(i==$rootScope.selectedMeterNumberBcmMeters){
                    $rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
                }
                else{
                    $rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
                }
            }
             $interval.cancel($scope.bcmMetersPanelPromise);
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
                .success(function(response) {						
                    $scope.branchDetailsCurrent = response.Current;
                    $scope.branchDetailsPower = response.Power;

                    switch($scope.branchDetailsCurrent.Status)
                    {
                        case 'Unknown':
                            $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                            break;

                        case 'Alarm':
                            $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                            break;

                        case 'Warning':
                            $scope.branchDetailsCurrent.Status = 'WarningIcon';
                            break;

                        case 'Normal':
                            $scope.branchDetailsCurrent.Status = 'UI_Normal';
                            break;
                    }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
        }

        $scope.prevNavigationList = function($event){
            var element = $event;
            if($rootScope.selectedMeterNumberBcmMeters>1){
                $rootScope.selectedMeterNumberBcmMeters--;

                $rootScope.paginationNumbersBcmMeters = [];
                for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
                    if(i==$rootScope.selectedMeterNumberBcmMeters){
                        $rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
                    }
                    else{
                        $rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
                    }
                }
                 $interval.cancel($scope.bcmMetersPanelPromise);
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
                .success(function(response) {						
                    $scope.branchDetailsCurrent = response.Current;
                    $scope.branchDetailsPower = response.Power;

                    switch($scope.branchDetailsCurrent.Status)
                    {
                        case 'Unknown':
                            $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                            break;

                        case 'Alarm':
                            $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                            break;

                        case 'Warning':
                            $scope.branchDetailsCurrent.Status = 'WarningIcon';
                            break;

                        case 'Normal':
                            $scope.branchDetailsCurrent.Status = 'UI_Normal';
                            break;
                    }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
            }
        }

        $scope.nextNavigationList = function($event){
            if($rootScope.selectedMeterNumberBcmMeters<22){
                var element = $event;
                $rootScope.selectedMeterNumberBcmMeters++;

                $rootScope.paginationNumbersBcmMeters = [];
                for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
                    if(i==$rootScope.selectedMeterNumberBcmMeters){
                        $rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
                    }
                    else{
                        $rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
                    }
                }
                $interval.cancel($scope.bcmMetersPanelPromise);
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
                .success(function(response) {						
                    $scope.branchDetailsCurrent = response.Current;
                    $scope.branchDetailsPower = response.Power;

                    switch($scope.branchDetailsCurrent.Status)
                    {
                        case 'Unknown':
                            $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                            break;

                        case 'Alarm':
                            $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                            break;

                        case 'Warning':
                            $scope.branchDetailsCurrent.Status = 'WarningIcon';
                            break;

                        case 'Normal':
                            $scope.branchDetailsCurrent.Status = 'UI_Normal';
                            break;
                    }

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
            }
        }

        $scope.paginationNavigation = function($event){
            var element = $event;
            $rootScope.selectedMeterNumberBcmMeters = element.currentTarget.firstElementChild.innerText;

            for(var i=0; i<$rootScope.paginationNumbersBcmMeters.length; i++){
                if(Number($rootScope.paginationNumbersBcmMeters[i].number)==Number($rootScope.selectedMeterNumberBcmMeters)){
                    $rootScope.paginationNumbersBcmMeters[i].className = 'active';
                }
                else{
                    $rootScope.paginationNumbersBcmMeters[i].className = '';
                }
            }
             $interval.cancel($scope.bcmMetersPanelPromise);
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
            .success(function(response) {						
                $scope.branchDetailsCurrent = response.Current;
                $scope.branchDetailsPower = response.Power;

                switch($scope.branchDetailsCurrent.Status)
                {
                    case 'Unknown':
                        $scope.branchDetailsCurrent.Status = 'UnknownIcon';
                        break;

                    case 'Alarm':
                        $scope.branchDetailsCurrent.Status = 'AlarmIcon';
                        break;

                    case 'Warning':
                        $scope.branchDetailsCurrent.Status = 'WarningIcon';
                        break;

                    case 'Normal':
                        $scope.branchDetailsCurrent.Status = 'UI_Normal';
                        break;
                }

            }).catch(function (response){
                $scope.networkFailure=true;
            });

            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
                        .success(function(response) {
                            $scope.branchInfo = response;
                            if($scope.branchInfo.State.OnOff == 'On'){
                                $scope.branchInfo.State.OnOff = true;
                            }
                            else{
                                $scope.branchInfo.State.OnOff = false;
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
        }	

    });


    app.controller('EventController', function($scope, $http, $rootScope, $interval, $timeout, $interval, $filter) {

        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);	
        $rootScope.titleHeader = 'Event Log';
        $rootScope.activeEventsDisplay = false;
        $rootScope.bgTheme = 'white';

        if ( angular.isDefined($rootScope.pduMeteringHomePromise) ){
        }
        if($rootScope.activeEventsDisplay == true){
            $scope.activeEventsMode = true;		
        }else{
            $scope.activeEventsMode = false;
            $rootScope.activeEventsDisplay = false;
        }

        $scope.hidePopover = function(){				
             $('[data-toggle="popover"]').popover('hide');
        }

        $scope.$on('$destroy', function () {
            $('[data-toggle="popover"]').popover('hide');
        });

        $scope.calenderFrom = $scope.calenderTo = new Date();
        $scope.toggleCalendar = function($event){
            if($event.currentTarget.checked==true){
                // Remove disbaled From Calendar
                $event.currentTarget.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.removeAttribute('disabled');
                // Remove disbaled To Calendar
                $event.currentTarget.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.removeAttribute('disabled');
            }else{
                // Remove disbaled From Calendar
                $event.currentTarget.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.setAttribute('disabled','disabled');
                // Remove disbaled To Calendar
                $event.currentTarget.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.setAttribute('disabled','disabled');
            }
        }


        $scope.applyColor = function(){
            for(var i=0; i<$scope.values.length; i++){
                switch($scope.values[i].type){
                    case 'A':
                        $scope.values[i].colorFilterType = 'color-type-alarm';
                        $scope.values[i].StatusIcon = 'UI_ErrorCircle1_24';
                        break;
                    case 'I':
                        $scope.values[i].colorFilterType = 'color-type-information';
                        $scope.values[i].StatusIcon = 'UI_InformationCircle2_24';
                        break;
                    case 'W':
                        $scope.values[i].colorFilterType = 'color-type-warning';
                        $scope.values[i].StatusIcon = 'UI_WarningCircle2_24';
                        break;
                }
            }
        }

        $scope.eventData = function() {

            // For all the Events
            if(!$scope.activeEventsMode){
                var url = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size;			
                var urlcount = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?eventcount?start=' + $scope.start + ',size=' + $scope.size;

                if ($scope.active == true) {
                    url = url + ',active=1';
                    urlcount = urlcount + ',active=1';
                }
                if ($scope.alarm == true) {
                    url = url + ',alarm=1';
                    urlcount = urlcount + ',alarm=1';
                }
                if ($scope.info == true) {
                    url = url + ',info=1';
                    urlcount = urlcount + ',info=1';
                }
                if ($scope.warn == true) {
                    url = url + ',warn=1';
                    urlcount = urlcount + ',warn=1';
                }
                if ($scope.reqack == true) {
                    url = url + ',reqack=1';
                    urlcount = urlcount + ',reqack=1';
                }
                if ($scope.waveform == true) {
                    url = url + ',waveform=1';
                    urlcount = urlcount + ',waveform=1';
                }
                if ($scope.calender == true) {
                    var fdate, todate;
                    try {
                        fDate = $filter('date')($scope.calenderFrom, "dd/MM/yyyy");
                        toDate = $filter('date')($scope.calenderTo, "dd/MM/yyyy");
                        url = url + ',sdate=' + fDate + ',enddate=' + toDate;
                    }
                    catch (err) {

                    }
                }					
                $http.get(urlcount)
                 .success(function (response){
                        $scope.filterCount = response.eventcount[0].filterCount;
                        $scope.totalPages = Math.ceil($scope.filterCount/15);

                        $http.get(url)
                         .success(function(responseEvt) {
                            $rootScope.eventCounter = responseEvt.event[1].Activecnt;
                            if($rootScope.eventCounter>0){
                                $("#active-event-counter-id").removeClass("event-notify-hide");
                            }else{
                                $("#active-event-counter-id").addClass("event-notify-hide");
                            }								
                            $scope.values = responseEvt.event[2].Evt;	

                            // Fixing the SN as the response has reverse order						
                            for(var i=0; i<$scope.values.length; i++){
                                $scope.values[i].SN = ((EVENTS_PER_PAGE * $scope.currentPage + 1) - EVENTS_PER_PAGE + $scope.values.length) - $scope.values[i].SN;
                            }

                            $scope.applyColor();
                        }).catch(function (responseEvt){
                            $scope.networkFailure=true;
                        });	
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });				
            }else{	
                var urlcount = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?eventcount?start=' + $scope.start + ',size=' + $scope.size +',active=1';

                $http.get(urlcount)
                 .success(function (response){
                        $scope.filterCount = response.eventcount[0].filterCount;
                        $scope.totalPages = Math.ceil($scope.filterCount/15);

                        $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size +',active=1')
                            .success(function(response) {
                                $scope.totalPages = Math.ceil(response.event[1].Activecnt/15);
                                $scope.values = response.event[2].Evt;

                                // Fixing the SN as the response has reverse order
                                for(var i=0; i<$scope.values.length; i++){
                                    $scope.values[i].SN = ((EVENTS_PER_PAGE * $scope.currentPage + 1) - EVENTS_PER_PAGE + $scope.values.length) - $scope.values[i].SN;
                                }							
                                $scope.applyColor();
                                $rootScope.eventCounter = response.event[1].Activecnt;
                                if($rootScope.eventCounter>0){
                                    $("#active-event-counter-id").removeClass("event-notify-hide");
                                }else{
                                    $("#active-event-counter-id").addClass("event-notify-hide");
                                }
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });	
            }			
        }

        $scope.prevEvent= function(){
            if($scope.currentPage>1){
                $scope.currentPage--;
                $scope.start-=15;
                $scope.eventData();
            }
        }

        $scope.nextEvent= function(){
            if($scope.currentPage < $scope.totalPages){
                $scope.currentPage++;
                $scope.start+=15;
                $scope.eventData();
            }
        }

        $scope.allEventsView = function(){
            $scope.currentPage = 1;
            $scope.start = 0;
            $scope.size = EVENTS_PER_PAGE;		
            $scope.eventData();

        }
        $scope.activeEventsView = function(){	

            $scope.currentPage = 1;
            $scope.start = 0;
            $scope.size = EVENTS_PER_PAGE;
            $scope.eventData();

        }

        // Sub Menu Navigation
        $scope.eventsSubMenu = function($event, i) {

            var element = $event;
            var filterItem = element.currentTarget.innerText;
            var subMenuCount = element.currentTarget.parentElement.parentElement.childElementCount;
            var currentSubMenuItem = element.currentTarget.parentElement;
            var subMenuItem = element.currentTarget.parentElement.parentElement.firstElementChild;

            for(var i=0; i<subMenuCount; i++){
                if(subMenuItem.innerText.trim()==currentSubMenuItem.innerText.trim()){
                    subMenuItem.className = "sub-active-link";
                }
                else{
                    subMenuItem.className = "sub-inactive-link";
                }
                subMenuItem = subMenuItem.nextElementSibling
            }

            switch(filterItem)
            {
                case 'ALL':
                    $scope.activeEventsMode = false;
                    $scope.allEventsView(); // Service Call for all Event Logs
                    break;
                case 'ACTIVE':
                    $scope.activeEventsMode = true;
                    $scope.activeEventsView(); // Service Call for Active Event Logs
                    break;
            }
        };

        if($scope.activeEventsMode == false){
            $scope.allEventsView();
        }else{
            $scope.activeEventsView();
        }
    });

    app.controller('PduMeteringMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location) {

        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);

        $rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
        $rootScope.titleSubHeader = 'Metering';
        $scope.inputMode = false;
        $rootScope.activeEventsDisplay = false;
        $scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
        $scope.editMode = false;

        // To toggle between Graph & Table View
        $scope.toggleViewTableGraph = function($event, i) {		
            var element = $event;
            var filterItem = element.currentTarget.id.trim();

            switch(filterItem){
                case "graphModeId":
                    $scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
                    break;
                case "tableModeId":
                    $scope.toggleViewMode = {"graph": false, "table": true, "settings": false};
                break;
                case "settingsModeId":
                {
                    $scope.toggleViewMode = {"graph": false, "table": false, "settings": true};
                    // Configuration View	
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
                                .success(function(response) {
                                    $scope.inVoltage = response.Rating.InVoltage;
                                    $scope.outVoltage = response.Rating.OutVoltage;
                                    $scope.current = response.Rating.Current;
                                    $scope.kw = response.Rating.kW;
                                    $scope.configurationFrequency = response.Rating.Frequency;
                                    $scope.line = response.CT.Line;
                                    $scope.neutral = response.CT.Neutral;

                                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
                                    .success(function(response) {
                                        $scope.demandPeriod = response.Power.demandperiod;
                                    }).catch(function (response){
                                        $scope.networkFailure=true;
                                    });
                                }).catch(function (response){
                                    $scope.networkFailure=true;
                                });

                    // Limits View
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
                                .success(function(response) {
                                    $scope.limitsInfo = response;;

                                }).catch(function (response){
                                    $scope.networkFailure=true;
                                });
                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig/attributes')
                            .success(function(response) {
                                // Warning Attribute values
                                $scope.warningInputOVAttributes = response.Warning.InputOV;
                                $scope.warningInputUVAttributes = response.Warning.InputUV;
                                $scope.warningOutputOVAttributes = response.Warning.OutputOV;
                                $scope.warningOutputUVAttributes = response.Warning.OutputUV;
                                $scope.warningOverCurrentAttributes = response.Warning.OverCurrent;

                                // Alarm Attribute values
                                $scope.inputOVAttributes = response.Alarm.InputOV;
                                $scope.inputUVAttributes = response.Alarm.InputUV;
                                $scope.outputOVAttributes = response.Alarm.OutputOV;
                                $scope.outputUVAttributes = response.Alarm.OutputUV;
                                $scope.overCurrentAttributes = response.Alarm.OverCurrent;
                                $scope.neutralCurrentAttributes = response.Alarm.NutralCurrent;
                                $scope.groundCurrentAttributes = response.Alarm.GndCurrent;
                                $scope.alarmfrequencyAttributes = response.Alarm.Frequency;

                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });

                }
                break;
            }

            // Setting the style for Graph/Table Link
            var currentItem = element.currentTarget.parentElement.firstElementChild;
            for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
            {
                // Reset the class name of each element
                currentItem.className = '';
                if(currentItem.id.trim() == filterItem){
                    currentItem.className = 'active-text-link';
                }
                currentItem = currentItem.nextElementSibling
            }

            // Check for Output View
            if(!$scope.inputMode){
                $interval.cancel($scope.promise2);
                $scope.outputView();
                $scope.promise1 = $interval(function () {
                                    $scope.outputView();
                              }, DATADELAY);
                $scope.$on('$destroy', function () {
                    $interval.cancel($scope.promise1);
                });
            }else{
                $interval.cancel($scope.promise1);
                $scope.inputView();
                $scope.promise2 = $interval(function () {
                                    $scope.inputView();
                              }, DATADELAY);

                $scope.$on('$destroy', function () {
                    $interval.cancel($scope.promise2);
                });
            }
        }

        // Edit and Bind the required value
        $scope.editModeFeatureValue = function(data, requiredParameter, requiredParameter2, requiredParameter3){
            if($scope.editMode == false){
                $scope.editMode = true;
            }
            $scope.filterItemSubmenu = requiredParameter3;
            switch($scope.filterItemSubmenu){
                    case 'Limits':											
                        $scope.limitsInfo[requiredParameter][requiredParameter2] = data;
                        break;
            }
        }

        $scope.saveChanges = function(){
            var postBody = null;
            $scope.editMode = false;
            switch($scope.filterItemSubmenu){			
                case 'Limits':
                    postBody = JSON.parse(JSON.stringify($scope.limitsInfo));
                    $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig', postBody)
                        .success(function(response) {
                            var test = response;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
                    break;

        }
        }

        $scope.discardChanges = function(){
            $scope.editMode = false;
        }

        $scope.outputView = function(){

            // Graphical View
            if($scope.toggleViewMode.graph){
                $scope.colors = ["#3e9ce7", "#3e9ce7", "#3e9ce7"];
                $scope.options = {
                                    scales: {
                                        xAxes: [{
                                            categoryPercentage: 0.25,
                                        }],
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero:true
                                            }
                                        }]
                                    }
                                };
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Voltage')
                    .success(function(response) {
                        $scope.voltage = response.LL;
                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
                            .success(function(response) {
                                $scope.outVoltage = response.Rating.OutVoltage;
                                $scope.voltage.AB = ($scope.voltage.AB/$scope.outVoltage)*100;
                                $scope.voltage.BC = ($scope.voltage.BC/$scope.outVoltage)*100;
                                $scope.voltage.CA = ($scope.voltage.CA/$scope.outVoltage)*100;

                                $scope.labels = ['A', 'B', 'C'];
                                $scope.data = 	[$scope.voltage.AB, $scope.voltage.BC, $scope.voltage.CA];

                            }).catch(function(response){
                                $scope.networkFailure=true;
                            });
                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
                    .success(function(response) {
                        $scope.power = response.Load;
                        $scope.labelsPower = ['L1', 'L2', 'L3'];
                        $scope.dataPower = 	[$scope.power.L1, $scope.power.L2, $scope.power.L3];
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsV')
                    .success(function(response) {
                        $scope.harmonicsV = response.Components;
                        $scope.colorsVoltageHarmonics =	[
                                                          {
                                                            backgroundColor: '#2E92FA'
                                                          },
                                                          {
                                                            backgroundColor: '#BCD0D4'
                                                          },
                                                          {
                                                            backgroundColor: '#9292FA'
                                                          }
                                                         ];
                        $scope.harmonicsV.L1.shift();
                        $scope.harmonicsV.L2.shift(); 
                        $scope.harmonicsV.L3.shift();

                        $scope.labelsVoltageHarmonics = ['Fund', '3', '5', '7', '9'];
                        $scope.seriesVoltageHarmonics = ['L1', 'L2', 'L3'];
                        $scope.dataVoltageHarmonics = [$scope.harmonicsV.L1, $scope.harmonicsV.L2, $scope.harmonicsV.L3];

                    }).catch(function (response){
                        $scope.networkFailure=true;
                        });
                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsI')
                    .success(function(response) {
                        $scope.harmonicsI = response.Components;
                        $scope.colorsCurrentHarmonics =	[
                                                          {
                                                            backgroundColor: '#2E92FA'
                                                          },
                                                          {
                                                            backgroundColor: '#BCD0D4'
                                                          },
                                                          {
                                                            backgroundColor: '#9292FA'
                                                          }
                                                         ];
                        $scope.harmonicsI.L1.shift();
                        $scope.harmonicsI.L2.shift(); 
                        $scope.harmonicsI.L3.shift();

                        $scope.labelsCurrentHarmonics = ['Fund', '3', '5', '7', '9'];
                        $scope.seriesCurrentHarmonics = ['L1', 'L2', 'L3'];
                        $scope.dataCurrentHarmonics = [$scope.harmonicsI.L1, $scope.harmonicsI.L2, $scope.harmonicsI.L3];
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
            }
            // Table View
            else if($scope.toggleViewMode.table){

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?VoltageIN')
                    .success(function(response) {
                        $scope.voltageInput = response.LL;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Voltage')
                    .success(function(response) {
                        $scope.voltage = response.LN;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Current')
                    .success(function(response) {
                        $scope.currentRms = response.RMS;
                        $scope.currentNg = response.NG;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
                    .success(function(response) {
                        $scope.power = response;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsV')
                    .success(function(response) {
                        $scope.harmonicsVThd = response.THD;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

                $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsI')
                    .success(function(response) {
                        $scope.harmonicsIThd = response.THD;

                    }).catch(function(response){
                        $scope.networkFailure=true;
                    });

            }

        }

        // This function is not called as the Input data is not used
        $scope.inputView = function(){		
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?VoltageIN')
                .success(function(response) {
                    $scope.voltageInput = response.LL;

                }).catch(function(response){
                    $scope.networkFailure=true;
                });		
        }

        $scope.outputView();
        $scope.promise1 = $interval(function () {
                                    $scope.outputView();
                              }, DATADELAY);

        $scope.$on('$destroy', function () {
                    $interval.cancel($scope.promise1);
                });

    });

    app.controller('PduMeteringSettingsController', function($scope, $filter, $http, $timeout, $interval, $rootScope, $location) {

        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
        $rootScope.titleSubHeader = 'Settings';
        $scope.viewModes = {'Configuration':true, 'Limits':false, 'Network': false, 'Protocols': false, 'Email':false, 'General':false};
        $scope.editMode = false;
        $rootScope.activeEventsDisplay = false;

        // Attributes for Protocols, Email, General Settings
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig/attributes')
                    .success(function(response) {
                        $scope.sysConfigAttributes = response;

                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });


        // Configuration View	
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
                    .success(function(response) {
                        $scope.inVoltage = response.Rating.InVoltage;
                        $scope.outVoltage = response.Rating.OutVoltage;
                        $scope.current = response.Rating.Current;
                        $scope.kw = response.Rating.kW;
                        $scope.configurationFrequency = response.Rating.Frequency;
                        $scope.line = response.CT.Line;
                        $scope.neutral = response.CT.Neutral;

                        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
                        .success(function(response) {
                            $scope.demandPeriod = response.Power.demandperiod;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });

        // Limits View
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
                    .success(function(response) {
                        $scope.limitsInfo = response;;

                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
            $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig/attributes')
                    .success(function(response) {
                        // Warning Attribute values
                        $scope.warningInputOVAttributes = response.Warning.InputOV;
                        $scope.warningInputUVAttributes = response.Warning.InputUV;
                        $scope.warningOutputOVAttributes = response.Warning.OutputOV;
                        $scope.warningOutputUVAttributes = response.Warning.OutputUV;
                        $scope.warningOverCurrentAttributes = response.Warning.OverCurrent;

                        // Alarm Attribute values
                        $scope.inputOVAttributes = response.Alarm.InputOV;
                        $scope.inputUVAttributes = response.Alarm.InputUV;
                        $scope.outputOVAttributes = response.Alarm.OutputOV;
                        $scope.outputUVAttributes = response.Alarm.OutputUV;
                        $scope.overCurrentAttributes = response.Alarm.OverCurrent;
                        $scope.neutralCurrentAttributes = response.Alarm.NutralCurrent;
                        $scope.groundCurrentAttributes = response.Alarm.GndCurrent;
                        $scope.alarmfrequencyAttributes = response.Alarm.Frequency;

                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });

        // Network View		
        $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?ethernet')
            .success(function(response) {
                $scope.ipaddress = response.ethernet[0].ipaddress;
                $scope.gateway = response.ethernet[0].gateway;					
                $scope.subnet = response.ethernet[0].subnet;
            }).catch(function (response){
                $scope.networkFailure=true;
            });

        // Invoke Protocol View Services under PDU Settings
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
            .success(function(response) {
                $scope.protocols = response.Protocols;

                if($scope.protocols.modbusTCPOnOff == "Off"){
                    $scope.protocols.modbusTCPOnOff = false;
                }else{
                    $scope.protocols.modbusTCPOnOff = true;
                }

                if($scope.protocols.modbusRTUOnOff == "Off"){
                    $scope.protocols.modbusRTUOnOff = false;
                }else{
                    $scope.protocols.modbusRTUOnOff = true;
                }

                if($scope.protocols.SSH == "Off"){
                    $scope.protocols.SSH = false;
                }else{
                    $scope.protocols.SSH = true;
                }

                if($scope.protocols.Web == "Off"){
                    $scope.protocols.Web = false;
                }else{
                    $scope.protocols.Web = true;
                }

                if($scope.protocols.SNMP == "Off"){
                    $scope.protocols.SNMP = false;
                }else{
                    $scope.protocols.SNMP = true;
                }

                if($scope.protocols.TFTPOnOf == "Off"){
                    $scope.protocols.TFTPOnOf = false;
                }else{
                    $scope.protocols.TFTPOnOf = true;
                }

                // For Baud Select Box
                switch($scope.protocols.Baud){
                    case $scope.sysConfigAttributes.Protocols.Baud[0]:
                        $scope.selectorId = {
                            status: 1
                        };
                        break;
                    case $scope.sysConfigAttributes.Protocols.Baud[1]:
                        $scope.selectorId = {
                            status: 2
                        };
                        break;
                    case $scope.sysConfigAttributes.Protocols.Baud[2]:
                        $scope.selectorId = {
                            status: 3
                        };
                        break;
                    default	:
                        $scope.selectorId = {
                            status: 4
                        };
                }

                $scope.statuses = [
                    {value: 1, text: $scope.sysConfigAttributes.Protocols.Baud[0]},
                    {value: 2, text: $scope.sysConfigAttributes.Protocols.Baud[1]},
                    {value: 3, text: $scope.sysConfigAttributes.Protocols.Baud[2]},
                    {value: 4, text: $scope.sysConfigAttributes.Protocols.Baud[3]}
                ];

                $scope.showStatus = function() {
                    var selected = $filter('filter')($scope.statuses, {value: $scope.selectorId.status});
                    return ($scope.selectorId.status && selected.length) ? selected[0].text : 'Not set';
                };

                // For Parity Select Box
                switch($scope.protocols.Parity){
                    case $scope.sysConfigAttributes.Protocols.Parity[0]:
                        $scope.selectorIdParity = {
                            status: 1
                        };
                        break;
                    case $scope.sysConfigAttributes.Protocols.Parity[1]:
                        $scope.selectorIdParity = {
                            status: 2
                        };
                        break;
                    default :
                        $scope.selectorIdParity = {
                            status: 3
                        };
                }


                $scope.statusesParity = [
                    {value: 1, text: $scope.sysConfigAttributes.Protocols.Parity[0]},
                    {value: 2, text: $scope.sysConfigAttributes.Protocols.Parity[1]},
                    {value: 3, text: $scope.sysConfigAttributes.Protocols.Parity[2]}
                ];

                $scope.showStatusParity = function() {
                    var selected = $filter('filter')($scope.statusesParity, {value: $scope.selectorIdParity.status});
                    return ($scope.selectorIdParity.status && selected.length) ? selected[0].text : 'Not set';
                };

            }).catch(function (response){
                $scope.networkFailure=true;
            });

        // Invoke Email View Services under PDU Settings
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
            .success(function(response) {
                $scope.email = response.Email;

                if($scope.email.EmailOnOff == "Off"){
                    $scope.EmailOnOff = false;
                }else{
                    $scope.EmailOnOff = true;
                }

            }).catch(function (response){
                $scope.networkFailure=true;
            });
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify')
            .success(function(response) {
                $scope.emailNotify = response;

                if($scope.emailNotify.Application.Email1 == "No"){
                    $scope.emailNotify.Application.Email1 = false;
                }else{
                    $scope.emailNotify.Application.Email1 = true;
                }
                if($scope.emailNotify.Application.Email2 == "No"){
                    $scope.emailNotify.Application.Email2 = false;
                }else{
                    $scope.emailNotify.Application.Email2 = true;
                }
                if($scope.emailNotify.Application.Service == "No"){
                    $scope.emailNotify.Application.Service = false;
                }else{
                    $scope.emailNotify.Application.Service = true;
                }

                if($scope.emailNotify.LogDump.Email1 == "No"){
                    $scope.emailNotify.LogDump.Email1 = false;
                }else{
                    $scope.emailNotify.LogDump.Email1 = true;
                }
                if($scope.emailNotify.LogDump.Email2 == "No"){
                    $scope.emailNotify.LogDump.Email2 = false;
                }else{
                    $scope.emailNotify.LogDump.Email2 = true;
                }
                if($scope.emailNotify.LogDump.Service == "No"){
                    $scope.emailNotify.LogDump.Service = false;
                }else{
                    $scope.emailNotify.LogDump.Service = true;
                }

                if($scope.emailNotify.Alerts.Email1 == "No"){
                    $scope.emailNotify.Alerts.Email1 = false;
                }else{
                    $scope.emailNotify.Alerts.Email1 = true;
                }
                if($scope.emailNotify.Alerts.Email2 == "No"){
                    $scope.emailNotify.Alerts.Email2 = false;
                }else{
                    $scope.emailNotify.Alerts.Email2 = true;
                }
                if($scope.emailNotify.Alerts.Service == "No"){
                    $scope.emailNotify.Alerts.Service = false;
                }else{
                    $scope.emailNotify.Alerts.Service = true;
                }

                switch($scope.emailNotify.Content.Last){
                    case "Hour":
                        document.getElementById("lasthourId").checked = true;
                        break;
                    case "Day":
                        document.getElementById("lastdayId").checked = true;
                        break;
                    case "20":
                        document.getElementById("last20Id").checked = true;
                        break;
                }
            }).catch(function (response){
                $scope.networkFailure=true;
            });

        // General View 
        $scope.contrast = 20;		
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
            .success(function(response) {
                $scope.general1 = response.Genaral;
                $scope.contrast = $scope.general1.Contrast;

                if($scope.general1.Audio == "Off"){
                    $scope.general1.Audio = "glyphicon audible-alarm glyphicon-volume-off";
                }else{
                    $scope.general1.Audio = "glyphicon audible-alarm glyphicon-volume-up"
                }

                if($scope.general1.NTPOnOff == "Off"){
                    $scope.general1.NTPOnOff = false;
                }else{
                    $scope.general1.NTPOnOff = true;
                }

                if($scope.general1.ManualRestart == "Off"){
                    $scope.general1.ManualRestart = false;
                }else{
                    $scope.general1.ManualRestart = true;
                }

                if($scope.general1.Security == "Off"){
                    $scope.general1.Security = false;
                }else{
                    $scope.general1.Security = true;
                }


                // For TimeZone Select Box
                switch($scope.general1.TimeZone){
                    case $scope.sysConfigAttributes.Genaral.TimeZone[0]:
                        $scope.selectorIdTimezone = {
                            status: 1
                        };
                        break;
                    case $scope.sysConfigAttributes.Genaral.TimeZone[1]:
                        $scope.selectorIdTimezone = {
                            status: 2
                        };
                        break;
                    case $scope.sysConfigAttributes.Genaral.TimeZone[2]:
                        $scope.selectorIdTimezone = {
                            status: 3
                        };
                        break;
                    case $scope.sysConfigAttributes.Genaral.TimeZone[3]:
                        $scope.selectorIdTimezone = {
                            status: 4
                        };
                        break;
                    case $scope.sysConfigAttributes.Genaral.TimeZone[4]:
                        $scope.selectorIdTimezone = {
                            status: 5
                        };
                        break;
                    case $scope.sysConfigAttributes.Genaral.TimeZone[5]:
                        $scope.selectorIdTimezone = {
                            status: 6
                        };
                        break;
                    default	:
                        $scope.selectorIdTimezone = {
                            status: 7
                        };
                }

                $scope.statusesTimezone = [
                    {value: 1, text: $scope.sysConfigAttributes.Genaral.TimeZone[0]},
                    {value: 2, text: $scope.sysConfigAttributes.Genaral.TimeZone[1]},
                    {value: 3, text: $scope.sysConfigAttributes.Genaral.TimeZone[2]},
                    {value: 4, text: $scope.sysConfigAttributes.Genaral.TimeZone[3]},
                    {value: 5, text: $scope.sysConfigAttributes.Genaral.TimeZone[4]},
                    {value: 6, text: $scope.sysConfigAttributes.Genaral.TimeZone[5]},
                    {value: 7, text: $scope.sysConfigAttributes.Genaral.TimeZone[6]}
                ];

                $scope.showStatusTimezone = function() {
                    var selected = $filter('filter')($scope.statusesTimezone, {value: $scope.selectorIdTimezone.status});
                    return ($scope.selectorIdTimezone.status && selected.length) ? selected[0].text : 'Not set';
                };

            }).catch(function (response){
                $scope.networkFailure=true;
            });

        //Date & Time
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?datetime')
            .success(function(response) {
                $scope.datetime = response;					
            }).catch(function (response){
                $scope.networkFailure=true;
            });

        // Functionality for editing the checkbox parameters in Settings. This will display only the save, discard container, but the binding happens via model defined in the view
        $scope.editModeFeatureState = function(settingsParameter){
            $scope.filterItemSubmenu = settingsParameter;
            if($scope.editMode == false){
                $scope.editMode = true;
            }
        }

        // Edit and Bind the required value
        $scope.editModeFeatureValue = function(data, requiredParameter, requiredParameter2, requiredParameter3){
            if($scope.editMode == false){
                $scope.editMode = true;
            }
            $scope.filterItemSubmenu = requiredParameter3;
            switch($scope.filterItemSubmenu){
                    case 'Protocols':
                        $scope.protocols[requiredParameter] = data;
                        break;
                    case 'Email':
                        $scope.email[requiredParameter] = data;
                        break;
                    case 'General':
                        if(requiredParameter!='Audio'){
                            $scope.general1[requiredParameter] = data;
                        }
                        else{
                            if(data=='glyphicon audible-alarm glyphicon-volume-up'){
                                $scope.general1[requiredParameter] = "glyphicon audible-alarm glyphicon-volume-off";
                            }
                            else{
                                $scope.general1[requiredParameter] = "glyphicon audible-alarm glyphicon-volume-up";
                            }
                        }
                        break;
                    case 'Limits':											
                        $scope.limitsInfo[requiredParameter][requiredParameter2] = data;
                        break;
            }
        }

        $scope.saveChanges = function(){
            var postBody = null;
            $scope.editMode = false;

            // Protocols POST API Call
            postBody = JSON.parse(JSON.stringify($scope.protocols));
            postBody = {"Protocols": postBody};

            if(postBody.Protocols.modbusTCPOnOff == false ){
                postBody.Protocols.modbusTCPOnOff = "Off";
            }else{
                postBody.Protocols.modbusTCPOnOff = "On";
            }

            if(postBody.Protocols.modbusRTUOnOff == false){
                postBody.Protocols.modbusRTUOnOff = "Off";
            }else{
                postBody.Protocols.modbusRTUOnOff = "On";
            }

            if(postBody.Protocols.SSH == false){
                postBody.Protocols.SSH = "Off";
            }else{
                postBody.Protocols.SSH = "On";
            }

            if(postBody.Protocols.Web == false){
                postBody.Protocols.Web = "Off";
            }else{
                postBody.Protocols.Web = "On";
            }

            if(postBody.Protocols.SNMP == false){
                postBody.Protocols.SNMP = "Off";
            }else{
                postBody.Protocols.SNMP = "On";
            }		
            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody).
                success(function(response) {

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

            // General POST API Call
            postBody = JSON.parse(JSON.stringify($scope.general1));
            postBody = {"Genaral": postBody};

            if(postBody.Genaral.NTPOnOff == false){
                postBody.Genaral.NTPOnOff = "Off";
            }else{
                postBody.Genaral.NTPOnOff = "On";
            }

            if(postBody.Genaral.ManualRestart == false){
                postBody.Genaral.ManualRestart = "Off";
            }else{
                postBody.Genaral.ManualRestart = "On";
            }

            if(postBody.Genaral.Security == false){
                postBody.Genaral.Security = "Off";
            }else{
                postBody.Genaral.Security = "On";
            }

            if(postBody.Genaral.Audio == 'glyphicon audible-alarm glyphicon-volume-off'){
                postBody.Genaral.Audio = "Off";
            }else{
                postBody.Genaral.Audio = "On";
            }
            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody)
                .success(function(response) {

                }).catch(function (response){
                    $scope.networkFailure=true;
                });


            // Limits POST API Call
            postBody = JSON.parse(JSON.stringify($scope.limitsInfo));
            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig', postBody)
                .success(function(response) {

                }).catch(function (response){
                    $scope.networkFailure=true;
                });

            // POST call for Email
            if($scope.EmailOnOff == false){
                $scope.email.EmailOnOff = "Off";
            }else{
                $scope.email.EmailOnOff = "On";
            }
            postBody = JSON.parse(JSON.stringify({"Email": $scope.email}));	
            $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody)
            .success(function(rest){

                // Settings parameters for Email Notify
                if($scope.emailNotify.Application.Email1 == false){
                $scope.emailNotify.Application.Email1 = "No";
                }else{
                    $scope.emailNotify.Application.Email1 = "Yes";
                }
                if($scope.emailNotify.Application.Email2 == false){
                    $scope.emailNotify.Application.Email2 = "No";
                }else{
                    $scope.emailNotify.Application.Email2 = "Yes";
                }
                if($scope.emailNotify.Application.Service == false){
                    $scope.emailNotify.Application.Service = "No";
                }else{
                    $scope.emailNotify.Application.Service = "Yes";
                }

                if($scope.emailNotify.LogDump.Email1 == false){
                    $scope.emailNotify.LogDump.Email1 = "No";
                }else{
                    $scope.emailNotify.LogDump.Email1 = "Yes";
                }
                if($scope.emailNotify.LogDump.Email2 == false){
                    $scope.emailNotify.LogDump.Email2 = "No";
                }else{
                    $scope.emailNotify.LogDump.Email2 = "Yes";
                }
                if($scope.emailNotify.LogDump.Service == false){
                    $scope.emailNotify.LogDump.Service = "No";
                }else{
                    $scope.emailNotify.LogDump.Service = "Yes";
                }

                if($scope.emailNotify.Alerts.Email1 == false){
                    $scope.emailNotify.Alerts.Email1 = "No";
                }else{
                    $scope.emailNotify.Alerts.Email1 = "Yes";
                }
                if($scope.emailNotify.Alerts.Email2 == false){
                    $scope.emailNotify.Alerts.Email2 = "No";
                }else{
                    $scope.emailNotify.Alerts.Email2 = "Yes";
                }
                if($scope.emailNotify.Alerts.Service == false){
                    $scope.emailNotify.Alerts.Service = "No";
                }else{
                    $scope.emailNotify.Alerts.Service = "Yes";
                }

                if(document.getElementById("lasthourId").checked == true){
                    $scope.emailNotify.Content.Last = "Hour";
                }else if(document.getElementById("lastdayId").checked == true){
                    $scope.emailNotify.Content.Last = "Day";
                }else{
                    $scope.emailNotify.Content.Last = "20";
                }

                // POST call For Email Notification
                postBody = JSON.parse(JSON.stringify($scope.emailNotify));
                $http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify', postBody)
                .success(function(rest) {

                    $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify')
                    .success(function(response) {
                        $scope.emailNotify = response;

                        if($scope.emailNotify.Application.Email1 == "No"){
                            $scope.emailNotify.Application.Email1 = false;
                        }else{
                            $scope.emailNotify.Application.Email1 = true;
                        }
                        if($scope.emailNotify.Application.Email2 == "No"){
                            $scope.emailNotify.Application.Email2 = false;
                        }else{
                            $scope.emailNotify.Application.Email2 = true;
                        }
                        if($scope.emailNotify.Application.Service == "No"){
                            $scope.emailNotify.Application.Service = false;
                        }else{
                            $scope.emailNotify.Application.Service = true;
                        }

                        if($scope.emailNotify.LogDump.Email1 == "No"){
                            $scope.emailNotify.LogDump.Email1 = false;
                        }else{
                            $scope.emailNotify.LogDump.Email1 = true;
                        }
                        if($scope.emailNotify.LogDump.Email2 == "No"){
                            $scope.emailNotify.LogDump.Email2 = false;
                        }else{
                            $scope.emailNotify.LogDump.Email2 = true;
                        }
                        if($scope.emailNotify.LogDump.Service == "No"){
                            $scope.emailNotify.LogDump.Service = false;
                        }else{
                            $scope.emailNotify.LogDump.Service = true;
                        }

                        if($scope.emailNotify.Alerts.Email1 == "No"){
                            $scope.emailNotify.Alerts.Email1 = false;
                        }else{
                            $scope.emailNotify.Alerts.Email1 = true;
                        }
                        if($scope.emailNotify.Alerts.Email2 == "No"){
                            $scope.emailNotify.Alerts.Email2 = false;
                        }else{
                            $scope.emailNotify.Alerts.Email2 = true;
                        }
                        if($scope.emailNotify.Alerts.Service == "No"){
                            $scope.emailNotify.Alerts.Service = false;
                        }else{
                            $scope.emailNotify.Alerts.Service = true;
                        }

                        switch($scope.emailNotify.Content.Last){
                            case "Hour":
                                document.getElementById("lasthourId").checked = true;
                                break;
                            case "Day":
                                document.getElementById("lastdayId").checked = true;
                                break;
                            case "20":
                                document.getElementById("last20Id").checked = true;
                                break;
                        }


                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });						

                  });			
            });					
        }
        $scope.discardChanges = function(){
            $scope.editMode = false;
        }

    });

    app.controller('HelpController', function($scope, $interval, $rootScope) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.activeEventsDisplay = false;
        $rootScope.titleHeader = 'Help';
    });

    app.controller('ServiceController', function($scope, $rootScope, $http, $interval, $timeout, $filter) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $scope.isBackgroundTask = false;
        $rootScope.titleHeader = 'Service';
        $rootScope.titleSubHeader = 'Service';
        $scope.viewModes = {'Reports':true, 'Upgrade':false, 'Reset': false, 'Calibration': false};
        $scope.dumpStatusView = false;
        $rootScope.activeEventsDisplay = false;	

        $scope.usbMode = function(){
            document.getElementById("usbReportId").checked = true;
            document.getElementById("usbUpgradeId").checked = true;
        }
        $scope.tftpMode = function(){		
        }

        $scope.selectAllChange = function($event){
            var element = $event;
            var selectedId = element.currentTarget.id
            if(document.getElementById("selectallId").checked == true){
                document.getElementById("logId").checked = true;
                document.getElementById("paramId").checked = true;
                document.getElementById("tlmId").checked = true;
                document.getElementById("waveformsId").checked = true;
            }else{
                document.getElementById("logId").checked = false;
                document.getElementById("paramId").checked = false;
                document.getElementById("tlmId").checked = false;
                document.getElementById("waveformsId").checked = false;
            }
        }

        // check if USB device is mounted
        $scope.usbMountCall = function(){
            $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?USBdevice?mount')
                .success(function(response) {
                    $scope.usbMount = response.USBmount;
                    if($scope.usbMount != 'NULL'){
                        $scope.usbMode();
                    }else{
                        document.getElementById("usbReportId").disabled = true;
                        document.getElementById("usbUpgradeId").disabled = true;					
                        document.getElementById("tftpReportId").checked = true;
                        document.getElementById("tftpUpgradeId").checked = true;
                    }
                }).catch(function (response){
                    $scope.networkFailure=true;
                });
        }

        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
                        .success(function(response) {
                            $scope.protocols = response.Protocols;
                        }).catch(function (response){
                            $scope.networkFailure=true;
                        });
        $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?devicestatus')
                            .success(function(response) {
                                $scope.deviceStatuses = response.devicestatus;
                                $scope.selectedDevice = $scope.deviceStatuses[0];
                            }).catch(function (response){
                                $scope.networkFailure=true;
                            });

        $scope.usbMountCall();

        // Invoke dump status service`for Reports
        $scope.dumpStatusCall = function(){
            $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?dumpstatus')
                    .success(function(response) {
                        $scope.dumpStatusView = true;
                        $scope.dumpstatus =	response.dumpstatus;
                        $scope.dumppercent = response.dumppercen;
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });

            $scope.timeoutCount = 0;

            $rootScope.dumpStatusPromise =
                $interval(function () {
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?dumpstatus')
                    .success(function(response) {
                        $scope.dumpStatusView = true;

                        // Unknown Case
                        if((response.dumpstatus == 'Unknown' || response.dumpstatus == 'File not found' || response.dumpstatus == 'Create folder failed' ||  response.dumpstatus ==  'Failure to open port' || response.dumpstatus == 'Failed to Send email to address 1'  || response.dumpstatus == 'Failed to Send email to address 2') && response.dumppercen == '0'){
                            $scope.dumpStatusView = false
                            $interval.cancel($rootScope.dumpStatusPromise);;
                            $scope.timeoutView = true;
                            $timeout(function(){
                                $scope.timeoutView = false;
                                $scope.dumpStatusView = false;
                                $scope.isBackgroundTask = false;
                            }, SUCCESSDELAY);
                        }
                        else if(response.dumpstatus == 'Success' && response.dumppercen == '100'){
                            // Upon 100% success transfer
                            $scope.dumpstatus =	response.dumpstatus;
                            $scope.dumppercent = response.dumppercen;
                            $interval.cancel($rootScope.dumpStatusPromise);						
                            if(document.getElementById("emailId").checked == true){
                                $scope.successMessage = "Email Sent Successfully"
                            }else{						
                                $scope.successMessage = "Saved Successfully"
                            }
                            if(document.getElementById("emailId").checked == true)
                            {
                                $timeout(function(){
                                    $scope.dumpStatusView = false;
                                    $scope.successView = true;

                                    $interval.cancel($rootScope.dumpStatusPromise);

                                    $timeout(function(){
                                        $scope.successView = false;
                                        $scope.isBackgroundTask = false;
                                    }, SUCCESSDELAY);
                                }, EMAIL_SUCCESS_DELAY); // 15 seconds delay for displaying success message considering the server background task
                            }else{
                                $scope.dumpStatusView = false;
                                $scope.successView = true;
                                $timeout(function(){
                                    $scope.successView = false;
                                    $scope.isBackgroundTask = false;
                                }, SUCCESSDELAY);
                            }
                            //$scope.usbMountCall();
                        }else { // Time out case and File not Found Case

                            $scope.dumpstatus =	response.dumpstatus;
                            $scope.dumppercent = response.dumppercen;

                            //timeout for 1 minute
                            $scope.timeoutCount++;
                            if($scope.timeoutCount>11 && $scope.timeoutCount<13){
                                $scope.dumpStatusView = false;
                                $scope.timeoutView = true;
                            }else if($scope.timeoutCount>11 && $scope.timeoutCount<14){
                                $interval.cancel($rootScope.dumpStatusPromise);
                                $scope.timeoutView = false;
                                $scope.dumpStatusView = false;
                                $scope.isBackgroundTask = false;
                            }
                        }
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
                }, DUMPSTATUSDELAY);
        }

        // Invoke upgrade status service`
        $scope.upgradeStatusCall = function(){
            $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?status')
                    .success(function(response) {
                        $scope.dumpStatusView = true;
                        $scope.dumpstatus =	response.dumpstatus;
                        $scope.dumppercent = response.dumppercen;
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
            $scope.timeoutCount = 0;
            $rootScope.upgradeStatusPromise =
                $interval(function () {
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?status')
                    .success(function(response) {
                        $scope.dumpStatusView = true;

                        if((response.dumpstatus == 'Unknown' || response.dumpstatus == 'File not found' || response.dumpstatus == 'Burn Error on Download' ||  response.dumpstatus ==  'Failure to open port' || response.dumpstatus == 'No response on Download'  || response.dumpstatus == 'Download failed') && response.dumppercen == '0'){
                            $scope.dumpStatusView = false
                            $interval.cancel($rootScope.upgradeStatusPromise);
                            $scope.timeoutView = true;
                            $timeout(function(){
                                $scope.timeoutView = false;
                                $scope.dumpStatusView = false;
                                $scope.isBackgroundTask = false;
                            }, SUCCESSDELAY);
                        }
                        else if(response.UpgradeStatus == 'Success' && response.Upgradepercen == '100'){
                            // Upon 100% success transfer
                            $scope.dumpstatus =	response.UpgradeStatus;
                            $scope.dumppercent = response.Upgradepercen;
                            $interval.cancel($rootScope.upgradeStatusPromise);
                            $scope.dumpStatusView = false;
                            $scope.successMessage = "Upgraded Successfully"
                            $scope.successView = true;
                            $timeout(function(){
                                $scope.successView = false;
                                $scope.isBackgroundTask = false;
                            }, SUCCESSDELAY);	
                        }
                        else{
                            $scope.dumpstatus =	response.UpgradeStatus;
                            $scope.dumppercent = response.Upgradepercen;

                            //timeout for 20 seconds
                            $scope.timeoutCount++;
                            if($scope.timeoutCount>5 && $scope.timeoutCount<7){
                                $scope.dumpStatusView = false;
                                $scope.timeoutView = true;
                            }else if($scope.timeoutCount>5 && $scope.timeoutCount<8){
                                $interval.cancel($rootScope.upgradeStatusPromise);
                                $scope.timeoutView = false;
                                $scope.dumpStatusView = false;
                                $scope.isBackgroundTask = false;
                            }
                        }
                    }).catch(function (response){
                        $scope.networkFailure=true;
                    });
                }, UPGRADESTATUSDELAY);
        }

        // parameters rquired for Service->Reports
        $scope.parametersRequired = function(){
            var parameters="";
            if(document.getElementById("logId").checked == true){
                parameters = "log";
            }
            if(document.getElementById("paramId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",param";
                }else{
                    parameters = "param";
                }
            }
            if(document.getElementById("tlmId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",tlm";
                }else{
                    parameters = "tlm";
                }
            }
            if(document.getElementById("waveformsId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",waveform";
                }else{
                    parameters = "waveform";
                }
            }
            if(document.getElementById("selectallId").checked == true){
                parameters = "all";
            }
            return parameters;
        }

        // parameters rquired for Service->Reset
        $scope.parametersRequiredReset = function(){
            var parameters="";
            if(document.getElementById("mdId").checked == true){
                parameters = "MD";
            }
            if(document.getElementById("peakId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",maxmin";
                }else{
                    parameters = "maxmin";
                }
            }
            if(document.getElementById("energyId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",power";
                }else{
                    parameters = "power";
                }
            }
            if(document.getElementById("alarmId").checked == true){
                if(parameters != ""){
                    parameters = parameters + ",fault";
                }else{
                    parameters = "fault";
                }
            }
            return parameters;
        }

        //Invoke upon submit Report
        $scope.generateReportInvoke = function(){
            if($scope.viewModes.Reset != true){
                $scope.isBackgroundTask = true;
            }
            $scope.successView = false;
            var parameters="";
            $interval.cancel($rootScope.dumpStatusPromise);
            $interval.cancel($rootScope.upgradeStatusPromise);		
            $scope.dumpStatusView = false;

            if(true){
                parameters = $scope.parametersRequired();
                if(document.getElementById("usbReportId").checked == true){
                    //API call for usb
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?usb,'+parameters)
                        .success(function(response) {
                            if(response.service  || response.error == "dump in progress"){
                                $scope.dumpStatusCall();
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                            $scope.isBackgroundTask = false;
                        });
                }
                else if(document.getElementById("tftpReportId").checked == true){
                    // API call for tftp
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?tftp,'+parameters)
                        .success(function(response) {
                            if(response.service || response.error == "dump in progress"){
                                $scope.dumpStatusCall();
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                            $scope.isBackgroundTask = false;
                        });
                }
                else if(document.getElementById("emailId").checked == true){
                    // API call for tftp
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?email,'+parameters)
                        .success(function(response) {
                            if(response.service || response.error){
                                $scope.dumpStatusCall();
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                            $scope.isBackgroundTask = false;
                        });
                }
            }

        }

        //Invoke upon submit Upgrade
        $scope.generateUpgradeInvoke = function(){
            if($scope.viewModes.Reset != true){
                $scope.isBackgroundTask = true;
            }
            $scope.successView = false;
            var parameters="";
            $interval.cancel($rootScope.dumpStatusPromise);
            $interval.cancel($rootScope.upgradeStatusPromise);		
            $scope.dumpStatusView = false;

            if(true){
                if(document.getElementById("usbUpgradeId").checked == true){
                    //API call for usb
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?usb,'+$scope.protocols.TFTPFileName)
                        .success(function(response) {
                            if(response.upgrade  || response.error == "upgrade in progress"){
                                $scope.upgradeStatusCall();
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                            $scope.isBackgroundTask = false;
                        });
                }
                else if(document.getElementById("tftpUpgradeId").checked == true){
                    // API call for tftp
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?tftp,'+$scope.protocols.TFTPFileName)
                        .success(function(response) {
                            if(response.upgrade || response.error == "upgrade in progress"){
                                $scope.upgradeStatusCall();
                            }
                        }).catch(function (response){
                            $scope.networkFailure=true;
                            $scope.isBackgroundTask = false;
                        });
                }
            }
        }

        //Invoke upon submit Reset
        $scope.generateResetInvoke = function(){
            if($scope.viewModes.Reset != true){
                $scope.isBackgroundTask = true;
            }
            $scope.successView = false;
            var parameters="";
            $interval.cancel($rootScope.dumpStatusPromise);
            $interval.cancel($rootScope.upgradeStatusPromise);		
            $scope.dumpStatusView = false;

            if(true){
                parameters = $scope.parametersRequiredReset();
                //API call for Reset
                    $http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?reset?parameter='+parameters+',ID='+$scope.selectedDevice.Id)
                        .success(function(response) {	
                            $scope.isBackgroundTask = true;
                            $scope.successMessage = "Reset Successful"
                            $scope.successView = true;						
                            $timeout(function(){
                                $scope.isBackgroundTask = false;
                                $scope.successView = false;								
                            }, 2000);

                        }).catch(function (response){
                            $scope.networkFailure=true;
                            alert(JSON.stringify(response));
                            $scope.isBackgroundTask = false;
                        });

            }

        }

        $scope.deviceIdChanged = function($event, i){
            var element = $event;	
        }

        $scope.resetViewModes = function(){
            $scope.viewModes.Reports = false;
            $scope.viewModes.Upgrade = false;
            $scope.viewModes.Reset = false;
            $scope.viewModes.Calibration = false;
        }
    });
    app.controller('AboutController', function($rootScope, $scope, $http, $interval) {
        $interval.cancel($rootScope.dumpStatusPromise);
        $interval.cancel($rootScope.upgradeStatusPromise);
        $rootScope.titleHeader = 'About';
        $rootScope.titleSubHeader = 'About';
        $scope.activeSystemMode = true;
        $rootScope.activeEventsDisplay = false;

        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
            .success(function(response) {
                $scope.rating = response.Rating;
            }).catch(function (response){
                $scope.networkFailure=true;
            });
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?sysInfo')
            .success(function(response) {
                $scope.aboutInfo = response.info;
                $scope.swVersion = response.info.SWVerMajor+'.'+response.info.SWVerMinor;
            }).catch(function (response){
                $scope.networkFailure=true;
            });
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?devicestatus')
            .success(function(response) {
                $scope.deviceStaus = response.devicestatus[0];
                $scope.meterSwVersion = Number($scope.deviceStaus.Majorver)+'.'+$scope.deviceStaus.Minorver;
            }).catch(function (response){
                $scope.networkFailure=true;
            });

        // Sub Menu Navigation
        $scope.aboutSubMenu = function($event, i) {

            var element = $event;
            var filterItem = element.currentTarget.innerText;
            var subMenuCount = element.currentTarget.parentElement.parentElement.childElementCount;
            var currentSubMenuItem = element.currentTarget.parentElement;
            var subMenuItem = element.currentTarget.parentElement.parentElement.firstElementChild;

            for(var i=0; i<subMenuCount; i++){
                if(subMenuItem.innerText.trim()==currentSubMenuItem.innerText.trim()){
                    subMenuItem.className = "sub-active-link";
                }
                else{
                    subMenuItem.className = "sub-inactive-link";
                }
                subMenuItem = subMenuItem.nextElementSibling
            }

            switch(filterItem)
            {
                case 'System':
                    $scope.activeSystemMode = true;
                    break;
                case 'Software':
                    $scope.activeSystemMode = false;
                    break;
            }
        };

    });
