//$(document).ready(function() {        
	// Enter necessary functions here

				$('#gmap-3').live("pageshow", function() {
					//$('#map_canvas_2').gmap('refresh');
					$('#map_canvas_1').gmap('getCurrentPosition', function(position, status) {
						if ( status === 'OK' ) {
							var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
							$('#map_canvas_1').gmap('get', 'map').panTo(latlng);
							$('#map_canvas_1').gmap('search', { 'location': latlng }, function(results, status) {
								if ( status === 'OK' ) {
									$('#from').val(results[0].formatted_address);
								}
							});
							
						} else {
							alert('Unable to get current position');
						}
					});
				});
				
				// To stop the click from looping into nonsense
				$('#gmap-3').live("pagecreate", function() {
					
					$('#map_canvas_1').gmap({'center': '59.3426606750, 18.0736160278'});
					
					$('#submit').click(function() {
						$('#map_canvas_1').gmap('displayDirections', { 'origin': $('#from').val(), 'destination': $('#to').val(), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(success, response) {
							if ( success ) {
								$('#results').show();
							} else {
								$('#results').hide();
							}
						});
						return false;
					});
				});



//});