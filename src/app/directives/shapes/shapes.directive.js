'use strict';

angular.module('b4Editor')
  .directive('shapes', function() {
    return {
      restrict: 'A',
      templateUrl: 'app/directives/shapes/shapes.template.html',
      replace: false,
      priority: 0,
      scope: {
        viewmodel: '=',
        context: '='
      },
      controller: function($scope, $element, $attrs) {
        $scope.updateToolPositions = function() {
          if ($scope.toolGroup) {
            var offset = 10; //$scope.viewmodel['stroke-width'];
            var offsetHalf = offset/2;
            var x = 0, y = 0, width = 0, widthHalf = 0, height = 0, heightHalf = 0;
            if ($scope.viewmodel.shapeType === 'oval') {
              x = $scope.viewmodel.cx - $scope.viewmodel.rx;
              y = $scope.viewmodel.cy - $scope.viewmodel.ry;
              width = 2 * $scope.viewmodel.rx;
              height = 2 * $scope.viewmodel.ry
            } else {
              x = $scope.viewmodel.x;
              y = $scope.viewmodel.y;
              width = $scope.viewmodel.width;
              height = $scope.viewmodel.height;
            }

            widthHalf = width/2 - 5;
            heightHalf = height/2 - 5;

            $scope.toolGroup.tlX = x - offset;
            $scope.toolGroup.tlY = y - offset;
            $scope.toolGroup.tmX = x + widthHalf;
            $scope.toolGroup.tmY = $scope.toolGroup.tlY;
            $scope.toolGroup.trX = x + width;
            $scope.toolGroup.trY = y - offset;
            
            $scope.toolGroup.lmX = x - offset;
            $scope.toolGroup.lmY = y + heightHalf;
            $scope.toolGroup.rmX = x  + width;
            $scope.toolGroup.rmY = y + heightHalf;
            
            $scope.toolGroup.blX = x - offset;
            $scope.toolGroup.blY = y + height;
            $scope.toolGroup.bmX = x + widthHalf;
            $scope.toolGroup.bmY = y + height;
            $scope.toolGroup.brX = x + width;
            $scope.toolGroup.brY = y + height;
            $scope.toolGroup.cx = x + widthHalf + offsetHalf;
            $scope.toolGroup.cy = y + height + 15 + offset;
          }
        };

        $scope.showTools = function(tg) {
          $scope.toolGroup = tg;
          $scope.toolGroup.on = true;
          $scope.toolGroup.visibility = 'visible';
          $scope.toolGroup.transform = $scope.viewmodel.transform;
          $scope.updateToolPositions();
        };
        
        $scope.hideTools = function() {
          if ($scope.toolGroup) {
            $scope.toolGroup.visibility = 'hidden';
            $scope.toolGroup.on = false;
            $scope.toolGroup.mode = false;
          }
        };

        $scope.context = $scope;
      }
    };
  });
