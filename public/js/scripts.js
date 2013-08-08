function TodoCtrl($scope, $http) {
    $http.get('/list').success(function(data) {
        $scope.uniquetasks = data.unique;
        $scope.projects = data.project;
        $scope.areas = data.area;
        console.log(data);
    });
}