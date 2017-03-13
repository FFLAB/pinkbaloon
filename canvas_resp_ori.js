function createMarker(width, height, radius) {

          var canvas, context;

          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          context = canvas.getContext("2d");

          context.clearRect(0,0,width,height);

          // background is yellow
          context.fillStyle = "rgba(255,255,0,1)";

          // border is black
          context.strokeStyle = "rgba(0,0,0,1)";

          context.beginPath();
          context.moveTo(radius, 0);
          context.lineTo(width - radius, 0);
          context.quadraticCurveTo(width, 0, width, radius);
          context.lineTo(width, height - radius);
          context.quadraticCurveTo(width, height, width - radius, height);
          context.lineTo(radius, height);
          context.quadraticCurveTo(0, height, 0, height - radius);
          context.lineTo(0, radius);
          context.quadraticCurveTo(0, 0, radius, 0);
          context.closePath();

          context.fill();
          context.stroke();

          return canvas.toDataURL();

        }
function createBaloon(width, height, radius) {

          var canvas, context;

          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          context = canvas.getContext("2d");

          context.clearRect(0,0,width,height);

          // background is yellow
          context.fillStyle = "rgb(255, 0, 49)";

          // border is black
          context.strokeStyle = "rgba(0,0,0,1)";

          context.beginPath();
          context.moveTo(radius, 0);
          context.lineTo(width - radius, 0);
          context.quadraticCurveTo(width, 0, width, radius);
          context.lineTo(width, height - radius);
          context.quadraticCurveTo(width, height, width - radius, height);
          context.lineTo(radius, height);
          context.quadraticCurveTo(0, height, 0, height - radius);
          context.lineTo(0, radius);
          context.quadraticCurveTo(0, 0, radius, 0);
          context.closePath();

          context.fill();
          context.stroke();

          return canvas.toDataURL();

        }
            
//    function createBaloon(width, height, radius) {
//
//          var canvas, context;
//
//          canvas = document.createElement("canvas");
//          canvas.width = width;
//          canvas.height = height;
//
//          context = canvas.getContext("2d");
//
//          context.clearRect(0,0,width,height);
//
//          // background is pink
//          context.fillStyle = "rgb(255, 0, 206)";
//
//          // border is black
//          context.strokeStyle = "rgba(0,0,0,1)";
//
//          context.beginPath();
//          context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//               
//          context.moveTo(radius, 0);
//          context.lineTo(width - radius, 0);
//          context.quadraticCurveTo(width, 0, width, radius);
//          context.lineTo(width, height - radius);
//          context.quadraticCurveTo(width, height, width - radius, height);
//          context.lineTo(radius, height);
//          context.quadraticCurveTo(0, height, 0, height - radius);
//          context.lineTo(0, radius);
//          context.quadraticCurveTo(0, 0, radius, 0);
//          context.closePath();
//
//          context.fill();
//          context.stroke();
//
//          return canvas.toDataURL();
//
//        }
//


           

/*Prova per resize responsive*/
var map; //<-- This is now available to both event listeners and the initialize() function
function initialize() {
  var mapOptions = {
   center: new google.maps.LatLng(35.090349,-35.367574),
   zoom: 4,
   mapTypeId: google.maps.MapTypeId.HYBRID
  };
    
/*
roadmap displays the default road map view. This is the default map type.
satellite displays Google Earth satellite images
hybrid displays a mixture of normal and satellite views
terrain displays a physical map based on terrain information.
*/    
    
  map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
    // creating a marker
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(35.090349,-35.367574),
              map: map,
              title:"LA NOSTRA BARCA!",
              icon: createMarker(25, 25, 4)
          });
              // creating a SECOND marker
          var marker2 = new google.maps.Marker({
              position: new google.maps.LatLng(34.090349,-34.367574),
              map: map,
              title:"PALLONCINO!",
              icon: createBaloon(25, 25, 4)
          });
}
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
 var center = map.getCenter();
 google.maps.event.trigger(map, "resize");
 map.setCenter(center); 
});