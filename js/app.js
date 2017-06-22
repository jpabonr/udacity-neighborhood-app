//------------------------------ Model ------------------------------
var initialLocations = [
	{title: "Green Lakes Towers", coord: {lat: 25.078350, lng: 55.147886}, fsVenueId: "4da5d73dcda1c55f755ef604"},
	{title: "Friends' Avenue Cafe", coord: {lat:  25.079049, lng: 55.149523}, fsVenueId: "54f161e4498e1e5f53041c7d"},
	{title: "JLT Public Park", coord:{lat: 25.075317, lng: 55.146228}, fsVenueId: "52e22e5d11d2752fdd730e96"},
	{title: "Dubai Marina Mall", coord: {lat: 25.07643, lng: 55.140504}, fsVenueId: "4b0ad94cf964a520da2823e3"},
	{title: "McGettigan's Irish Pub", coord: {lat: 25.067524, lng: 55.141787}, fsVenueId: "4cab2289f47ea1430acc8821"}
];

//------------------------------ ViewModel ------------------------------
var ViewModel = function() {

	var self = this;
	this.locationsList = ko.observableArray([]); 
	this.selectedLocation = ko.observable();
	this.locationPhotos = ko.observableArray(['img/photo_placeholder.jpg']);

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
	this.displayLocationPhotos = function(item) {
		var fsClientId = 'MHHNIKVVSAULPWDI5VWVNESNXUYQLMHQLV3TB0WTV0UZG3MS';
		var fsClientSecret = 'EOEL5XG2SRLOCKW5BMXAATIIDZSAKKWITST2TGGSFXKALSSN';
		var fsPhotoSize = 'width300';
		var fsNumPhotos = 3;

		// FourSqure API call.
		if (item === undefined) {
			var fsApiCall = 'https://api.foursquare.com/v2/venues/' + self.selectedLocation().venueId + '/photos?limit=' + fsNumPhotos 
						+ '&client_id=' + fsClientId + '&client_secret=' + fsClientSecret + '&v=20170601';
		} else {
			var fsApiCall = 'https://api.foursquare.com/v2/venues/' + item.venueId + '/photos?limit=' + fsNumPhotos 
						+ '&client_id=' + fsClientId + '&client_secret=' + fsClientSecret + '&v=20170601';
		}
		$.ajax({
			url: fsApiCall,
			dataType: 'json',
			success: function(fsApiResponse) {
				self.locationPhotos().length = 0;
				for (var i = 0; i < fsApiResponse.response.photos.count; i++) {
					self.locationPhotos.push(fsApiResponse.response.photos.items[i].prefix + fsPhotoSize 
						+ fsApiResponse.response.photos.items[i].suffix);	
				}
			},
			error: function() {
				self.locationPhotos().length = 0;
				self.locationPhotos.push('img/error.jpg');
			}
		});
	};

	// Handles the selection of a location in drop-down menu.
	this.clickOnDropdown = function(item) {
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
			for (var i = 0; i < self.locationsList().length; i++) {
				if (self.locationsList()[i].title != self.selectedLocation().title) {
					self.locationsList()[i].display(false);
				} else {
					self.locationsList()[i].display(true);
				}
			}
			self.displayLocationPhotos(item);
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