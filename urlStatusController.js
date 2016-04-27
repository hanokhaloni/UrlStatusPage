function Pinger(url, callback) {
    //from http://jsfiddle.net/GSSCD/203/
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.url = url;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('responded');

        };
        this.img.onerror = function (event) {
            if (_that.inUse) {
                _that.inUse = false;
                console.log("access url:" + _that.url + " responded" + "with error" + event.message);
                _that.callback('responded');
            }

        };
        this.start = new Date().getTime();
        this.img.src = url;
        setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                console.log("access url:" + _that.url + " timeout");
                _that.callback('timeout');
            }
        }, 1500);
    }
}



angular.module('HelloWorldApp', [])
    .config(function($httpProvider){
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
   .controller('HelloWorldController',['$scope', '$http', '$window',
   function($scope, $http, $window) {
        $scope.version = "0.0.0";
        $scope.servers = [
            {name:"Jira",status:"unchecked",url:"https://jira-server.ngsoft.com/"},
            {name:"Isufit",status:"unchecked",url:"https://isufit.ngsoft.com/"},
            {name:"Sharepoint",status:"unchecked",url:"https://sharepoint.ngsoft.com/"},
            {name:"3271 MySudexo",status:"unchecked",url:"http://mysodexo.co.il/"},
            {name:"Jenkins",status:"unchecked",url:"http://Jenkins_server:8080/"},
            {name:"SonarQube",status:"unchecked",url:"http://10.30.50.27:9000/"},
        ];

       var statusStylesMap = {
           unchecked : "btn-info",
           checking : "btn-warning",
           responded : "btn-success",
           timeout : "btn-danger"
       };

       $scope.resolveClassByStatus = function(server) {
           return statusStylesMap[server.status];
       };

       $scope.gotoServerUrl = function(server) {
           console.log("Redirecting to " + server.url);
           $window.location.href =server.url;
       };


       function updateServerStatus(server, status) {
           server.status = status;
           $scope.$apply();//TODO this is BAD!
       }

       function verifyServerUrlIsAvailable2(server) {
           var url = server.url;
           console.log("About to Ping url:" + url);
           server.status = "checking";
               new Pinger(server.url,
                   function (status) {
                       updateServerStatus(server, status);
                   });
       }

       var init = function(){
           var servers = $scope.servers;
            servers.forEach(function(server){
                verifyServerUrlIsAvailable2(server);
            });
        };

       init();
}]);