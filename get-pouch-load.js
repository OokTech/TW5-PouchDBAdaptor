/*\
title: $:/plugins/OokTech/PouchDBAdaptor/get-pouch-load.js
type: application/javascript
module-type: route

GET /^\/pouch/load

Returns the favicon of the root wiki

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const tiddlerDB = require('$:/plugins/OokTech/Bob/UsePouchDB.js')
const thePath = new RegExp('^\/pouch\/load')

module.exports = {
  method: "GET",
  path: thePath,
  handler: function(request,response,state) {
    try {
      // Assume that the url is properly formatted
      const title = request.url.split('?')[1].split('=')[1]
      // We don't return the whole doc, just the fields part, so we need to
      // make a function here instead of just putting in callback as the
      // second argument.
      tiddlerDB.get(title, function (err, doc) {
        if (err) {
          response.writeHead(403)
          response.end()
        } else {
          response.writeHead(200, {"Content-Type": "application/json"});
          response.end(doc.fields);
        }
      })
      // Just reply with a 200, nothing else is needed here.
    } catch (e) {
      response.writeHead(403)
      response.end()
    }
  }
}

}());
