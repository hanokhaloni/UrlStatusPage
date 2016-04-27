function pinger(url, callback) {
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
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                console.log("access url:" + _that.url + " responded");
                _that.callback('responded', e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = url;
        this.timer = setTimeout(function () {
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
            {name:"2",status:"unchecked",url:"http://www.ynet.co.il/"},
            {name:"1",status:"unchecked",url:"http://127.0.0.1"},
            {name:"3",status:"unchecked",url:"http://index.html"},
            {name:"3",status:"unchecked",url:"http://localhost:63342/UrlStatus/index.html"}

        ];

       var statusStylesMap = {
           unchecked : "btn-warning",
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
       }


       function updateServerStatus(server, status) {
           server.status = status;
           $scope.$apply();//TODO this is BAD!
       }

       function verifyServerUrlIsAvailable2(server) {
           var url = server.url;
           console.log("About to pinger url:" + url);
           server.status = "checking";
               new pinger(server.url,
                   function (status, e) {
                       updateServerStatus(server, status);
                   });
       }

       var init = function(servers){
            servers.forEach(function(server){
                verifyServerUrlIsAvailable2(server);
            });
        };

       init($scope.servers);
}]);