'use strict';

$.ajax({
			type: 'GET',
			url: '/api/2.0/technicalInfo', 
			success: function(response) {
				console.log(response);
			},
			error: function(response, e) {
				//callback({ error: e, response: response });
			}
		});