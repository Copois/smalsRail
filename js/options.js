$(document).ready(function() {
	$("#saveButton").click(function() { save(); });
	$("#eraseButton").click(function() { erase(); reload(); });
	$("#restoreButton").click(function() { reload();update(); });
	$("#btn_searchStart").click(function() { search("StartStation"); });
	$("#btn_searchEnd").click(function() { search("EndStation"); });
	reload();
});


function reload() {
	$("#search_StartStation").val(localStorage.getStartStation());
	$("#search_EndStation").val(localStorage.getEndStation());
}

function save() {
console.log($("#select_EndStation").val())
	localStorage.setStartStation($("#select_StartStation").val());
	localStorage.setEndStation($("#select_EndStation").val());
	
}

function erase() {
	localStorage.clear();
}
function search(station) { 

	var city = $("#search_"+station).val()
	$.ajax({
		type: "GET",
		url: "https://irail.be/stations/NMBS?q="+city,
		dataType:"json"
		}).done(function(resp) {
			$.each(resp["@graph"], function(key,val) {
				$('<option>').val(val.name).text(val.name).appendTo('#select_'+station);
			});
		});
}




function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function update() {
	$.ajax({
		type: "GET",
		url: "https://api.irail.be/connections/?to=Charleroi-Sud&from=Brussel-Zuid/Bruxelles-Midi",
		dataType:"xml"
		}).done(function(resp) {
			json=xmlToJson(resp)
		});
}