/**
 * Created by ajou on 8/20/2016.
 */
var module = angular.module('myApp',[]);
module.controller('MainCtrl', ['$scope','$http',function($scope,$http){
    $scope.validate = function(){
        console.log("HIA");
        $http({
            method: 'GET',
            url: 'http://localhost:3000/show'
        })
            .success(function(data, status, headers, config){
                if(data){
                    $scope.members= data;
                }
                else{

                }
            })

            .error(function(data, status, headers, config){
                console.log(status);
            })

    }

}])