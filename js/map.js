// Google Maps functionality

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
      var thisMarker = this;
		  populateInfoWindow(thisMarker, infoWindow);
      displayLocationPhotos(thisMarker);
      thisMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ thisMarker.setAnimation(null); }, 750);
		});

		markers.push(marker);
	}
};

var populateInfoWindow = function (marker, infoWindow) {
  if (infoWindow.marker !== marker) {
    infoWindow.setContent('<div>' + marker.title + '</div>');
    infoWindow.open(map, marker);
    infoWindow.addListener('closeclick', function() {
      infoWindow.close();
    });
  }
};

var displayInfoWindow = function(location) {
  function stopBounce(i) {
    markers[i].setAnimation(null);
  }

  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title === location.title) {
      markers[i].setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(stopBounce, 750, i);
      if (infoWindow.marker !== markers[i]) {
        infoWindow.setContent('<div>' + markers[i].title + '</div>');
        infoWindow.open(map, markers[i]);
      }
    }
  }
};

// Displays in the map the marker of the location selected in the drop-down.
var displayMarkerDropdownSelection = function(location) {
  function stopBounce(i) {
    markers[i].setAnimation(null);
  }

  if (location !== undefined) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == location.title) {
        markers[i].setVisible(true);
        markers[i].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(stopBounce, 750, i);
        if (infoWindow.marker !== markers[i]) {
          infoWindow.setContent('<div>' + markers[i].title + '</div>');
          infoWindow.open(map, markers[i]);     
        }
      } else {
        markers[i].setVisible(false);
      }
    }
  } else {
    for (var k = 0; k < markers.length; k++) {
      markers[k].setVisible(true);
    }

  }
};