$scope.test = function() {
  var deferred = $q.defer();
  var data = [1,2,3,4];
  var promises = [];
  var finalData = [];
  var userCount = 0;
  function pushData(data) {
    finalData.push(data)
  }
  data.forEach(function(d) {
    console.log(d);
    promises.push($http.get('https://jsonplaceholder.typicode.com/todos/' + d))
  });
  var t = $q.all(promises).then(function(results){
    results.forEach(function(data,status,headers,config){
      userCount++;
      pushData(data.data);
      //console.log(data,status,headers,config);
      //console.log(data.data);
    })
    //deferred.resolve(finalData);
    //return deferred.promise;
    return userCount;
    //return finalData;
  });
 deferred.resolve(t);
 return deferred.promise;
  

}


$scope.test().then(function(data){
   console.log("Finally - "+JSON.stringify(data));
});
