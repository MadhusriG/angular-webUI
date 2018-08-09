function identifySFCM(sfcmDevice) 
        {   
            var defer2 = $q.defer;
            var sfcmPanel = [1,2,3,4];
            var promises = [];
            function pushSfcmPanelOn(sfcmPanel){
                sfcmPanelOnArr.push(sfcmPanel);
            } 
            sfcmPanel.forEach(function(s){
                console.log(s);
                promises.push($http.get("http://" + HOSTNAME + ":" + PORT + "/getdata.cgi?meters?SubfeedSystemData/submeters/" + parseInt(sfcmDevice.Id)+"/"+s))
            });
            var sfcmPanelOnCount = $q.all(promises).then(function(results){
                console.log(results.length);
                for(var i=0;i <= results.length -1;i++){
                    var sfcmPanelResponse = results[i].data;
                    console.log(sfcmPanelResponse);
                    if(sfcmPanelResponse["Config"]["On-Off"] === "On"){
                       sfcmCount++;
                       pushSfcmPanelOn(i+1);
                    }
                }
                return sfcmCount;
                return sfcmPanelOnArr;
            },function(results) {
              var sfcmPanelResponse = results;
          });
          defer2.resolve(sfcmPanelOnCount);
         return defer2.promise;
        }
        
identifySFCM(objSFCM).then(function(results2){
            var defer3 = $q.defer;
            var subfeedNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
            var promises = [];
            function sfOnCTScale(subfeedNum){
                subfeedOnCTScale.push(subfeedNum);
            }
            for(var sfcmPanelOn = 0;sfcmPanelOn <= sfcmPanelOnArr.length-1;sfcmPanelOn++){ 
                subfeedNum.forEach(function(sf){
                    console.log(sf);
                    promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedFactoryConfig/submeters/'+parseInt(sfcmDevice.Id)+'/'+parseInt(sfcmPanelOnArr[sfcmPanelOn])+'/'+sf))
                });
            }
            var sfCountOnCTScale = $q.all(promises).then(function(results){
                console.log(results.length);
                results.forEach(function(data){
                    var sfResponse = data.data;
                    console.log(sfResponse);
                    if(sfResponse.SubfeedFactoryConfig.LineCTScale != 0){
                       sfCount++;
                    }
                });
                for(var sfStatus = 0;sfStatus <= sfCount - 1;sfStatus++){
                    $scope.svg_sfcmLoad();
                }
                return sfCount;
            })
            defer3.resolve(sfCountOnCTScale);
            return defer3.promise;
            });

$scope.identifySFOnCTScale = function(){
            var defer3 = $q.defer;
            var subfeedNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
            var promises = [];
            function sfOnCTScale(subfeedNum){
                subfeedOnCTScale.push(subfeedNum);
            }
            for(var sfcmPanelOn = 0;sfcmPanelOn <= sfcmPanelOnArr.length-1;sfcmPanelOn++){ 
                subfeedNum.forEach(function(sf){
                    console.log(sf);
                    promises.push($http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedFactoryConfig/submeters/'+parseInt(sfcmDevice.Id)+'/'+parseInt(sfcmPanelOnArr[sfcmPanelOn])+'/'+sf))
                });
            }
            var sfCountOnCTScale = $q.all(promises).then(function(results){
                console.log(results.length);
                results.forEach(function(data){
                    var sfResponse = data.data;
                    console.log(sfResponse);
                    if(sfResponse.SubfeedFactoryConfig.LineCTScale != 0){
                       sfCount++;
                    }
                });
                for(var sfStatus = 0;sfStatus <= sfCount - 1;sfStatus++){
                    $scope.svg_sfcmLoad();
                }
                console.log(sfCount);
                return sfCount;
            })
            defer3.resolve(sfCountOnCTScale);
            return defer3.promise;
        }
