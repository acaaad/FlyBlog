/**
 * Created by ajou on 8/20/2016.
 */
var module = angular.module('app',[]);
module.controller('MainCtrl', ['$scope','$http',function($resource,$scope,$http){
    alert("hay");

    $scope.islogin=function () {
    alert("clicked");

        $http({
            method: 'POST',
            url: 'http://localhost:3000/validate',
            data: {name: $scope.iduser, password: $scope.passx}


        })
            .success(function (data ,status, headers, config) {
                console.log("sucsess");
                alert($scope.iduser);
                if (data.length) {
                    alert("Login Success :D ");
                    $scope.islogin = true;
                    window.location = "home.html"

                } else {
                    alert("Login Failed Please Retry :(");
                    $scope.passx;
                }
            })
            .error(function (data, status, headers, config) {
                console.log(status);

            });
    };
    $scope.addnew=function (data,status,headers,config) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/showall',
            data: {
                'text': $scope.text,//textdapet dari ara
                'Name ': $scope.name,//dapet dari ara
                'id': $scope.iduser//gatau dari mana
            }

                .success(function (data) {
                    if (data){
                        alert("Addiing Post Success");
                        window.location='home.html'//dari ara
                    }else {
                        alert("Failed Adding Post");
                    }
                })

        });
    };
    $scope.addpost=function () {
        $http({

        })
    }
}]);
// $scope.validate = function(){
//     console.log("HIA");
//     $http({
//         method: 'GET',
//         url: 'http://localhost:3000/show'
//     })
//         .success(function(data, status, headers, config){
//             if(data){
//                 $scope.members= data;
//             }
//             else{
//
//             }
//         })
//
//         .error(function(data, status, headers, config){
//             console.log(status);
//         })
//
// }