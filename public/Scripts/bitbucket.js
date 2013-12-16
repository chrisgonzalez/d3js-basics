$(document).ready(function(){
	getBitBucketData();
})

function getBitBucketData(){
		var url = "https://bitbucket.org/EAStrategy/rss/feed?token=42450c64d6870087429b71780618a1ad";
		$.ajax({
		  type: "GET",
		  url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
		  dataType: "json",
		  success: function(data, status, exthing){
		  		
		  		var entries = data.responseData.feed.entries
		  		for(var i=0; i<entries.length; i++){
		  			$(".bitbucket").append(entries[i].content);
		  		}
			},
		  error: function(jqXHR, textStatus, errorThrown){
		  		console.debug(status);
		  }
		});		
}