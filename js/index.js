//Set focus to the search box on page load
window.onload = function() {
    document.getElementById("wikiSearchInput").focus();
};

//AJAX request to the wikipedia api
function ajax (keyword) { //AJAX request
	$.ajax({ 
		url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
		dataType: "jsonp",
		success: function(response) {
			console.log(response.query);
			if (response.query.searchinfo.totalhits === 0) {
				showError(keyword);
			}

			else {
				showResults(response);
			}
		},
		error: function () {
			alert("Error retrieving search results, please refresh the page");
		}
	});
}

//Show search results
function showResults (callback) {

	//Limit search results to top 9 found articles 
	for (var i = 0; i <= 9; i++) {
		$(".displayResults").
			append("<div class='resultList result-" + i + "'>" + 
			       		"<span class='resultTitle title-" + i + "'></span>" + 
			       			"<br>" +
			       		"<span class='resultSnippet snippet-" + i + "'></span>" + 
			       			"<br>" + 
			       		"<span class='resultMetadata metadata-" + i + "'></span>" + 
			       	"</div>" );
	}

	for (var m = 0; m <= 9; m++) {
		var title = callback.query.search[m].title;
		var url = title.replace(/ /g, "_");
		var timestamp = callback.query.search[m].timestamp;
		timestamp = new Date(timestamp);
		//"Wed Aug 27 2014 00:27:15 GMT+0100 (WAT)";
		console.log(timestamp);
		$(".title-" + m).html("<a href='https://en.wikipedia.org/wiki/" + url + "' target='_blank'>" + callback.query.search[m].title + "</a>");
		$(".snippet-" + m).html(callback.query.search[m].snippet);
		$(".metadata-" + m).html((callback.query.search[m].size/1000).toFixed(0) + "kb (" + callback.query.search[m].wordcount + " words) - " + timestamp);
	}
}

//Show Error if any
function showError(keyword) {
	$(".displayResults").
		append("<div class='error'>"+
		       		"<p>Your search <span class='keyword'>" 
			       		+ keyword + 
			       	"</span> did not match any documents.</p> <p>Suggestions:</p>"+
			       	"<li>Make sure that all words are spelled correctly.</li>"+
			       	"<li>Try different keywords.</li><li>Try more general keywords.</li>"+
			    "</div> ");
}

//OnClick of the Search button on the result page
//Set the (keyword Value) to the current form input field text
$(".resultButtonWiki").click(function (event) {
		event.preventDefault();
		$(".displayResults").html("");
		var keyword = $(".resultWikiSearchFormInput").val();
		document.getElementById("resultWikiSearchFormInput").blur();
		ajax(keyword);
});

//OnClick of the mainpage wikisearch button
//set (Keyword Value) to the searchfield value
$(".btnWikiSearch").click(function(event) {
	event.preventDefault();
	var keyword = $(".wikiSearchInput").val();

	//if Keyword is not empty
	if (keyword !== "") {
		$(".resultWikiSearchFormInput").val(keyword);
		$(".homePage").addClass('hidden');
   	 	$(".resultPage").removeClass('hidden');
    	document.getElementById("wikiSearchInput").blur();
   		$(".wikiSearchInput").val("");
		document.getElementById("resultWikiSearchFormInput").blur();	
		$(".displayResults").html("");
		ajax(keyword);
	}else {
		alert("Enter a keyword into the search box");
	}
	
});