/**
 * Created by ajou on 8/20/2016.
 */
var module = angular.module('app',[]);
module.controller('MainCtrl', ['$scope','$http',function($scope,$http){
    alert("hay");
    $http({
        method: 'GET',
        url: 'http://localhost:3000/showall/:userId'
    })
        .success(function(data, status, headers, config) {
            if( data ) {
                $scope.posts= data;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            console.log(status);
        });
    $scope.islogin=function () {
    //alert("clicked");

        $http({
            method: 'POST',
            url: 'http://localhost:3000/validate',
           data: { password: $scope.passx , name: $scope.passx}
        //   data:{name : 'aaaa', password:'aaaaa'}


        })
            .success(function (data ,status, headers, config) {
                console.log("sucsess");
               // alert($scope.iduser);
                if (data) {
                    alert("Login Success :D ");

                    window.location = "blog.html"


                } else {
                    alert("Login Failed Please Retry :(");
                    $scope.passx;
                }
            })
            .error(function (data, status, headers, config) {
                console.log(status);

            });
    };
    $scope.addpost=function (data,status,headers,config) {
       alert("clickes");
        $http({
            method: 'POST',
            url: 'http://localhost:3000/addpost',
            data: {
                'user_id': 1,//textdapet dari ara
                'content': $scope.blogtext,//dapet dari ara
                'title': $scope.titletext
            }
                //'id': $scope.iduser//gatau dari mana
        })

                .success(function (data,status,headers,config) {
                    console.log("hay");
                        if (data){

                        alert("Addiing Post Success");
                        window.location='blog.html';//dari ara
                    }else {
                        alert("Failed Adding Post");
                    }
                })

        };

    $scope.addnew=function (status, headers, config) {
        alert("clicked");
        window.location='edit.html';
    }

    //$scope.showpost=function (data,status,headers,config) {

    //}
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