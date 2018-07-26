//to identify SFCMs: START
    /*$scope.identifySubFeeder = function(sfcmDevice) {
    	for (var panelId = 1; panelId <= 4; panelId++)
    	{
    	var sfcmPanelRequestURI = 'http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.objSFCM.Id+'/'+panelId;
    		//sfcmPanelRequestURI = sfcmPanelRequestURI.concat(panelId);
    		$http.get(sfcmPanelRequestURI)
    			.success(function(sfcmPanelResponse){
                    $scope.sfcmPanelConfig = sfcmPanelResponse;
    				var isSFCMPanelOn = parseSFCMPanelResponseOnOff(sfcmPanelResponse);
    				identifySubFeederOnCTScale($rootScope.objSFCM.Id, panelId);
    			}).catch(function (response){
                    $scope.networkFailure=true;
                });
    	}
    }

    $scope.parseSFCMPanelResponseOnOff = function(sfcmPanelResponse) {
    	return $scope.sfcmPanelConfig.Config["On-Off"] === "On";
    }

    $scope.identifySubFeederOnCTScale = function(objSFCM.Id, sfcmPanelOnId) {
		for (var i = 1; i <= 14; i++)
		{
		var sfcmPanelFactoryConfigURI = 'http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedFactoryConfig/submeters/'+$rootScope.objSFCM.Id+'/'+$scope.sfcmPanelOnId+'/'+i;
			//sfcmPanelFactoryConfigURI = sfcmPanelFactoryConfigURI.concat(i);
			$http.get(sfcmPanelFactoryConfigURI)
    			.success(function(sfcmPanelFactoryConfigResponse) {
    				var isCTScaleNonZero = parseSFCMPanelFactoryConfigResponse(sfcmPanelFactoryConfigResponse);
    				isCTScaleNonZero ? sfcmCount++ : sfcmCount;
    			}).catch(function (response){
                    $scope.networkFailure=true;
                });
		}

	}

    $scope.parseSFCMPanelFactoryConfigResponse = function($sfcmPanelFactoryConfigResponse) {
    	return $sfcmPanelFactoryConfigResponse.SubfeedFactoryConfig.LineCTScale != 0;
    }*/
    
    //to identify SFCMs: END
    //to identify BCMs: START
                $scope.identifyBCM = function(bcmDevice)
                {
                    $scope.bcmDeviceId;
                    $scope.bcmDeviceId = parseInt($rootScope.objBCM.Id);
                    for(var bcmPanelNo = 1;bcmPanelNo <= 4; bcmPanelNo++) 
                    {
                        $scope.bcmPanelConfigReqUri = 'http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$scope.bcmDeviceId+'/'+bcmPanelNo;
                    $http.get($scope.bcmPanelConfigReqUri)
                                            .success(function(response)
                                            {
                                                if(response.PanelConfig.OnOff === "On"){
                                                   console.log(response.PanelConfig.OnOff);
                                                   $rootScope.bcmCount++;
                                                }
                                            }).catch(function (response){
                                                $scope.networkFailure=true;
                                            });
                    }
                    console.log("No. of BCMs: "+$rootScope.bcmCount);
                }
                //to identify BCMs: END