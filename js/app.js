var ViewModel = function() {

	var self = this;
	this.locationsList = ko.observableArray([]); 
	this.selectedLocation = ko.observable();
	this.locationPhotos = ko.observableArray(['img/photo_placeholder.jpg']);
	this.googleMapsErrorMessage = ko.observable();

	// Handles Google Maps API errors.
	this.googleMapsFailure = function(){
		self.googleMapsErrorMessage("<span id='googleMapsError'>Oops! Something went wrong loading Google Maps.  Please reload the page.</span>")
	};

	// Creates an array of locations.
	var Location = function(initialLocations) {
		this.title = initialLocations.title;
		this.coord = initialLocations.coord;
		this.venueId = initialLocations.fsVenueId;
		this.display = ko.observable(true);
	};
	for (var i = 0; i < initialLocations.length; i++) {
		self.locationsList.push( new Location(initialLocations[i]) );
	}
	
	// Retrieves photos of the selected location from Foursquare API.
	this.displayLocationPhotos = function(location) {
		var fsClientId = 'MHHNIKVVSAULPWDI5VWVNESNXUYQLMHQLV3TB0WTV0UZG3MS';
		var fsClientSecret = 'EOEL5XG2SRLOCKW5BMXAATIIDZSAKKWITST2TGGSFXKALSSN';
		var fsPhotoSize = 'width300';
		var fsNumPhotos = 3;
		var fsApiCall;
		var venueId;
	
		for (var i = 0; i < self.locationsList().length; i++) {
			if (self.locationsList()[i].title === location.title) {
				venueId = self.locationsList()[i].venueId;
			}
		}

		fsApiCall = 'https://api.foursquare.com/v2/venues/' + venueId + '/photos?limit=' + fsNumPhotos + '&client_id=' + fsClientId + '&client_secret=' + fsClientSecret + '&v=20170601';

		$.ajax({
			url: fsApiCall,
			dataType: 'json',
			success: function(fsApiResponse) {
				self.locationPhotos().length = 0;
				for (var i = 0; i < fsApiResponse.response.photos.count; i++) {
					self.locationPhotos.push(fsApiResponse.response.photos.items[i].prefix + fsPhotoSize + fsApiResponse.response.photos.items[i].suffix);	
				}
			},
			error: function() {
				self.locationPhotos().length = 0;
				self.locationPhotos.push('img/error.jpg');
			}
		});
	};

	// Handles the selection of a location in drop-down menu.
	this.clickOnDropdown = function() {
		if (self.selectedLocation() === undefined) { // If no location is selected in the drop-down menu.

			// Display all locations in the list and placeholder photo.
			for (var i = 0; i < self.locationsList().length; i++) {
				self.locationsList()[i].display(true);
				self.locationPhotos().length = 0;
				self.locationPhotos.push('img/photo_placeholder.jpg');
			}

			infoWindow.close();

		// Hides all locations that were not selected.
		} else {
			for (var ii = 0; ii < self.locationsList().length; ii++) {
				if (self.locationsList()[ii].title != self.selectedLocation().title) {
					self.locationsList()[ii].display(false);
				} else {
					self.locationsList()[ii].display(true);
				}
			}
			self.displayLocationPhotos(self.selectedLocation());
		}
			
	displayMarkerDropdownSelection(selectedLocation());
	};

	// Event handler of click event in locations list.
	this.clickOnList = function(item) {
		displayInfoWindow(item);
		self.displayLocationPhotos(item);
	};
};

ko.applyBindings(ViewModel());