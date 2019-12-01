/*\
title: $:/plugins/OokTech/PouchDBAdaptor/get-pouch-delete.js
type: application/javascript
module-type: route

GET /^\/pouch/delete

delete a tiddler

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const tiddlerDB = require('$:/plugins/OokTech/Bob/UsePouchDB.js')
const thePath = new RegExp('^\/pouch\/delete')

module.exports = {
  method: "POST",
  path: thePath,
  handler: function(request,response,state) {
    try {
      let title = state.data
      // We don't return the whole doc, just the fields part, so we need to
      // make a function here instead of just putting in callback as the
      // second argument.
      tiddlerDB.get(title, function (err, doc) {
        if (err) {
          if (err.name === 'not_found') {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("");
          } else {
            console.log(err)
            response.writeHead(403)
            response.end()
          }
        } else {
          doc._deleted = true
          tiddlerDB.put(doc, function(err) {
            if (err) {
              console.log(err)
              response.writeHead(403)
              response.end()
            } else {
              // Just reply with a 200, nothing else is needed here.
              response.writeHead(200, {"Content-Type": "text/plain"});
              response.end("");
            }
          })
        }
      })
    } catch (e) {
      console.log(e)
      response.writeHead(403)
      response.end()
    }
  }
}

}());
