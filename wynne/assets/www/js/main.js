var appid = "5252D701A7CE4B4F3C190F1403D2181F2C330F2E";

function init() {
	document.addEventListener("deviceready", deviceready, true);

}

function deviceready() {
	console.log('loaded');

window.plugins.tts.startup(doSpeak, errHandler);

function doSpeak() {
   window.plugins.tts.speak("The TTS service is ready", {} , errHandler);
}

function errHandler(result){
    alert('Error: ' + result);
}


///////////////////////////////////////////////////////////////////////////
	window.plugins.speechrecognizer.init(speechInitOk, speechInitFail);
	
	function speechInitOk() {
		$("#micButton").removeAttr("disabled");
	}
	
	function speechInitFail(e) {
		//Since this isn't critical, we don't care...
	}
	
	$("#startrecognition").bind("touchstart", function() {		
		var requestCode = 4815162342;
		var maxMatches = 1;
		var promptString = "What do you want?";
		window.plugins.speechrecognizer.startRecognize(speechOk, speechFail, requestCode, maxMatches, promptString);
	});

	function speechOk(result) {
		var match, respObj;
		if (result) {
			respObj = JSON.parse(result);
			if (respObj) {
				var response = respObj.speechMatches.speechMatch[0];
				$("#searchField").val(response);
				$("#searchButton").trigger("touchstart");
			}        
		}
	}

	function speechFail(m) {
		navigator.notification.alert("Sorry, I couldn't recognize you.", function() {}, "Speech Fail");
	}

	$("#searchButton").bind("touchstart",function() {
		var s = $.trim($("#searchField").val());
		console.log("going to search for "+s);

		$.getJSON("http://api.search.live.net/json.aspx?Appid="+appid+"&query="+escape(s)+"&sources=image&image.count=20", {}, function(res) {
			var results = res.SearchResponse.Image.Results;
			if(results.length == 0) {
				$("#results").html("No results!");
				return;
			}
			var s = "";
			for(var i=0; i<results.length; i++) {
				s+= "<p><img src='"+results[i].Thumbnail.Url+"'><br/><a href='"+results[i].Url+"'>"+results[i].DisplayUrl+"</a></p>";				
			}
			$("#results").html(s);
		});

	});
}

