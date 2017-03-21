$(document).ready(function() {
	$("#toOptions").click(function() { openOptions(); });
	$("#doUdate").click(function() { update(); });
	getFromStorage();
});

function hidediv(id) {
	document.getElementById(id).style.display = 'none';
}

function showdiv(id) {
	document.getElementById(id).style.display = 'block';
}


function openOptions() {
	var url = chrome.extension.getURL("html/options.html");
	chrome.tabs.create({url:url, selected:true});
}


function line(content) {
	return makeTag("tr", content);
}

function cell(content) {
	return makeTag("td", content);
}


function makeTag(tag, content) {
	return "<" + tag + ">" + content + "</" + tag + ">";
}

function display(data) {
	showdiv("data");
	var start = localStorage.getStartStation();
	var end = localStorage.getEndStation();

	var timesDiv = document.getElementById("times");
	var congesDiv = document.getElementById("conges");
	//json.connections.connection[0].departure["@attributes"].canceled  + "   " + json.connections.connection[0].departure["@attributes"].delay
	var html = start + " -> "+end+"<hr>";
	html += "<table id='timesTable'><tr><th>direction</th><th>time</th><th>dock</th><th>delay</th></tr>";
	for (i = 0; i < data.connections.connection.length; i++) {
		html += line( 
			cell(data.connections.connection[i].departure.direction["#text"]) 
			+ cell(data.connections.connection[i].departure.time["@attributes"].formatted.substring(11, 16)) 
			+ cell(data.connections.connection[i].departure.platform["#text"]) 
			+ cell("+"+data.connections.connection[i].departure["@attributes"].delay/60)
		//	+ cell(data.connections.connection[i].departure["@attributes"].canceled)
		); 
	}
	html += "</table><hr>";
	
	timesDiv.innerHTML = html;
	
}



function getFromStorage() {
	showdiv("data");
	var start = localStorage.getStartStation();
	var end = localStorage.getEndStation();
	
	if (start == "" || end == "") {
		openOptions();
		return;
	}
	update(); 
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
	var start = localStorage.getStartStation();
	var end = localStorage.getEndStation();

	$.ajax({
		type: "GET",
		url: "https://api.irail.be/connections/?to="+end+"&from="+start,
		dataType:"xml"
		}).done(function(resp) {
			json=xmlToJson(resp)
			display(json)
		});
}