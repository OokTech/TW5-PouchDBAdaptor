/*\
title: $:/plugins/OokTech/PouchDBAdaptor/PostAdaptor.js
type: application/javascript
module-type: syncadaptor

A skeleton of a sync adaptor module to use as a basis for future adaptors

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
if ($tw.browser) {
	const theHost = getHost();

	function PostAdaptor(options) {
	  this.wiki = options.wiki;
		//this.host = getHost();
		this.host = theHost;
	}

	function getHost() {
		var text = "$protocol$//$host$";
		const substitutions = [
				{name: "protocol", value: document.location.protocol},
				{name: "host", value: document.location.host}
			];
		for(var t=0; t<substitutions.length; t++) {
			var s = substitutions[t];
			text = $tw.utils.replaceString(text,new RegExp("\\$" + s.name + "\\$","mg"),s.value);
		}
		return text;
	};

	// REQUIRED
	// The name of the syncer
	PostAdaptor.prototype.name = "postadaptor"

	// REQUIRED
	// Tiddler info, can be left like this but must be present
	PostAdaptor.prototype.getTiddlerInfo = function() {
	  return {}
	}

	PostAdaptor.prototype.preprocessTiddler = function(tiddler) {
		return JSON.stringify(tiddler.getFieldStrings())
	}

	// REQUIRED
	// This does whatever is necessary to actually store a tiddler
	PostAdaptor.prototype.saveTiddler = function (tiddler, callback) {
		const request = new XMLHttpRequest();
		request.open('POST', theHost + '/pouch/save', true);
		request.setRequestHeader("X-Requested-With","TiddlyWiki");
		request.setRequestHeader("Content-type","application/json");
		request.onreadystatechange = function() {
			if(this.readyState === 4) {
				if(this.status === 200 || this.status === 201 || this.status === 204) {
					// Success!
					callback(null)//,this[returnProp],this);
					return;
				}
			// Something went wrong
			callback($tw.language.getString("Error/XMLHttpRequest") + ": " + this.status,null,this);
			}
		};
		request.send(this.preprocessTiddler(tiddler));
	}

	// REQUIRED
	// This does whatever is necessary to load a tiddler
	PostAdaptor.prototype.loadTiddler = function (title, callback) {
		$tw.utils.httpRequest({
			url: this.host + "/pouch/load",
			type: "GET",
			headers: {
				"Content-type": "text/plain"
			},
			data: {title: title},
			callback: function(err,data,request) {
				if(err) {
					return callback(err);
				}
				// Invoke the callback
				callback(null, JSON.parse(data));
			}
		});
	}

	// REQUIRED
	// This does whatever is necessary to delete a tiddler
	PostAdaptor.prototype.deleteTiddler = function (title, callback, options) {
		$tw.utils.httpRequest({
			url: this.host + "/pouch/delete",
			type: "POST",
			headers: {
				"Content-type": "text/plain"
			},
			data: title,
			callback: function(err,data,request) {
				if(err) {
					return callback(err);
				}
				// Invoke the callback
				callback(null);
			}
		});
	}

	/*
	// OPTIONAL
	// Returns true if the syncer is ready, otherwise false
	// This can be updated at any time, it gets checked when a syncing task is
	// being run so its value can change over time.
	PostAdaptor.prototype.isReady = function() {
	  return true
	}

	// OPTIONAL
	// This checks the login state
	// it can be used to give an async way to check the status and update the
	// isReady state. The tiddlyweb adaptor does this.
	PostAdaptor.prototype.getStatus = function(callback) {

	}

	// OPTIONAL
	// A login thing, need specifics
	PostAdaptor.prototype.login = function (username, password, callback) {

	}

	// OPTIONAL
	// A logout thing, need specifics
	PostAdaptor.prototype.logout = function (callback) {

	}

	// OPTIONAL
	// Loads skinny tiddlers, need specifics
	PostAdaptor.prototype.getSkinnyTiddlers = function (callback) {

	}
	*/

	function PostRouteAvailable() {
		const request = new XMLHttpRequest();
		request.open('GET', theHost + '/pouch/check', false);
		request.send();
		if (request.status === 200) {
			return true
		} else {
			return false
		}
	}
	// Replace this with whatever conditions are required to use your adaptor
	// I am not sure what to test to turn this on and off.
	if ($tw.browser && PostRouteAvailable()) {
	  exports.adaptorClass = PostAdaptor
	}
}
})();