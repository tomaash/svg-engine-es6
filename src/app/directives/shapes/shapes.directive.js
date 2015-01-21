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

            if ($scope.viewmodel.shapeType === 'line') {
              var x1 = $scope.viewmodel.x1, y1 = $scope.viewmodel.y1;
              var x2 = $scope.viewmodel.x2, y2 = $scope.viewmodel.y2;
              $scope.toolGroup.tlX = x1 - offsetHalf;
              $scope.toolGroup.tlY = y1 - offsetHalf;
              $scope.toolGroup.tmX = $scope.toolGroup.tlX;
              $scope.toolGroup.tmY = $scope.toolGroup.tlY;
              $scope.toolGroup.trX = $scope.toolGroup.tlX;
              $scope.toolGroup.trY = $scope.toolGroup.tlY;
              
              $scope.toolGroup.lmX = $scope.toolGroup.tlX;
              $scope.toolGroup.lmY = $scope.toolGroup.tlY;
              $scope.toolGroup.rmX = $scope.toolGroup.tlX;
              $scope.toolGroup.rmY = $scope.toolGroup.tlY;
              
              $scope.toolGroup.brX = x2 - offsetHalf;
              $scope.toolGroup.brY = y2 - offsetHalf;
              $scope.toolGroup.blX = $scope.toolGroup.brX;
              $scope.toolGroup.blY = $scope.toolGroup.brY;
              $scope.toolGroup.bmX = $scope.toolGroup.brX;
              $scope.toolGroup.bmY = $scope.toolGroup.brY;

              var dx = x2 - x1, dy = y2 - y1;
              var midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
              //var slope = dx === 0 ? 1 : dy / dx;
              var dist = Math.sqrt(dx*dx + dy*dy);
              dx /= dist;
              dy /= dist;
              $scope.toolGroup.cx = midX + offsetHalf * dy;
              $scope.toolGroup.cy = midY + offsetHalf * dx;
              //x3 = x1 + (offsetHalf)*dy;
              //y3 = y1 - (offsetHalf)*dx;
              //x4 = x1 - (N/2)*dy
              //y4 = y1 + (N/2)*dx

              //$scope.toolGroup.cx = x + widthHalf + offsetHalf;
              //$scope.toolGroup.cy = y + height + 15 + offset;
            } else {
              var x = 0, y = 0, width = 0, widthHalf = 0, height = 0, heightHalf = 0;
              if ($scope.viewmodel.shapeType === 'oval') {
                x = $scope.viewmodel.cx - $scope.viewmodel.rx;
                y = $scope.viewmodel.cy - $scope.viewmodel.ry;
                width = 2 * $scope.viewmodel.rx;
                height = 2 * $scope.viewmodel.ry;
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
