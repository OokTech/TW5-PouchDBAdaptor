/*\
title: $:/plugins/OokTech/PouchDBAdaptor/get-pouch-check.js
type: application/javascript
module-type: route

GET /^\/pouch/check

this is just to check if the server is available

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
const thePath = new RegExp('^\/pouch\/check')

module.exports =  {
  method: "GET",
  path: thePath,
  handler: function(request,response,state) {
    // Just reply with a 200, nothing else is needed here.
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("");
  }
}

}());
