// Google Maps functionality

setTimeout(function() {
  if(!window.google || !window.google.maps) {
    $("#map-col").prepend("<h3 id='error'>Oops! Something went wrong loading Google Maps.  Please reload the page.</h3>");
  }
}, 5000);

var markers = [];
var map;

var infoWindow;

var initMap = function() {
	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 25.073335, lng: 55.143996},
    	zoom: 15
  	});
 
  infoWindow = new google.maps.InfoWindow();

	for (var i = 0; i < initialLocations.length; i++) {
    /* jshint loopfunc: true */
		var position = initialLocations[i].coord;
		var title = initialLocations[i].title;
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		
		marker.addListener('click', function() {
		  populateInfoWindow(this, infoWindow);
		});

		markers.push(marker);
	}
};

var populateInfoWindow = function (marker, infoWindow) {
  if (infoWindow.marker != marker) {
    infoWindow.setContent('<div>' + marker.title + '</div>');
    infoWindow.open(map, marker);
    infoWindow.addListener('closeclick', function() {
      infoWindow.close();
    });
  }
};

var displayInfoWindow = function(location) {
  var selectedLocation = location;
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title == selectedLocation.title) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP);
      if (infoWindow.marker != markers[i]) {
      infoWindow.setContent('<div>' + markers[i].title + '</div>');
      infoWindow.open(map, markers[i]);
      }
    } else {
      markers[i].setMap(null);
    }
  }
};

// Displays in the map the marker of the location selected in the drop-down.
var displayMarkerDropdownSelection = function(location) {
  if (location !== undefined) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == location.title) {
        markers[i].setMap(map);
        markers[i].setAnimation(google.maps.Animation.DROP);   
        if (infoWindow.marker != markers[i]) {
          infoWindow.setContent('<div>' + markers[i].title + '</div>');
          infoWindow.open(map, markers[i]);     
          }
      } else {
        markers[i].setMap(null);
      }
    }
  } else {
    for (var iii = 0; iii < markers.length; iii++) {
      markers[iii].setMap(map);
    }

  }
};