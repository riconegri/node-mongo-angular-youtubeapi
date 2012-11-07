function seila ($scope,$element) {
	console.log("passa aqui");
	directive('labelsearch', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        //var panes = $scope.panes = [];
 
        // $scope.select = function(pane) {
        //   angular.forEach(panes, function(pane) {
        //     pane.selected = false;
        //   });
        //   pane.selected = true;
        // };
 
        // this.addPane = function(pane) {
        //   if (panes.length === 0) $scope.select(pane);
        //   panes.push(pane);
        // };
      },
      template: "<h4>Termos buscados</h4>" +
      '<span class="label label-info margin3" ng-show="search.name" ng-repeat="search in video_search">{{search.name}}</span>',
      replace: true
    };
  });
}

function OtherController ($scope) {
	
	console.log($scope);
}