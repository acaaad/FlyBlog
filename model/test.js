/**
 * Created by ajou on 8/20/2016.
 */
var module = angular.module('app',[]);
module.controller('MainCtrl', ['$scope','$http',function($scope,$http){
    alert("hay");

    $scope.islogin=function () {
    //alert("clicked");

        $http({
            method: 'POST',
            url: 'http://localhost:3000/validate',
           data: { password: $scope.passx , name: $scope.iduser}
        //   data:{name : 'aaaa', password:'aaaaa'}


        })
            .success(function (data ,status, headers, config) {
                console.log("sucsess");
               // alert($scope.iduser);
                if (data) {
                    alert("Login Success :D ");

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
       // alert("clickes");
        $http({
            method: 'POST',
            url: 'http://localhost:3000/showall/:userId',
            data: {
                'user_id': $scope.username,//textdapet dari ara
                'content': $scope.post//dapet dari ara
                //'id': $scope.iduser//gatau dari mana
            }

                .success(function (data) {
                        if (data){
                        alert("Addiing Post Success");
                        window.location='login.html'//dari ara
                    }else {
                        alert("Failed Adding Post");
                    }
                })

        });
    };
    $scope.addpost=function (status, headers, config) {
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