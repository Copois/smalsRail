function isFresh(cacheData) {
	var now = new Date();
	var timestamp = new Date(cacheData.timestamp);
	return cacheData != null && now.getDate() == timestamp.getDate() && now.getMonth() == timestamp.getMonth();	
}
Storage.prototype.toCache = function(key, value) {
	var cacheObject = {timestamp : new Date(), data : value};
	this.setItem(key, JSON.stringify(cacheObject));
}
 
Storage.prototype.fromCache = function(key) {
	var cacheObject = JSON.parse(this.getItem(key));
	return cacheObject != null && isFresh(cacheObject) ? cacheObject.data : null;	
}

/*----------*/

Storage.prototype.getStartStation = function() {
	return this.fromCache("cache.StartStation");
}

Storage.prototype.setStartStation = function(value) {
	this.toCache("cache.StartStation", value);
}

Storage.prototype.getEndStation = function() {
	return this.fromCache("cache.EndStation");
}

Storage.prototype.setEndStation = function(value) {
	this.toCache("cache.EndStation", value);
}
