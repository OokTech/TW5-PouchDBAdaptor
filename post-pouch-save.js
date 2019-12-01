/*\
title: $:/plugins/OokTech/PouchDBAdaptor/get-pouch-save.js
type: application/javascript
module-type: route

GET /^\/pouch/save

save a tiddler

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const tiddlerDB = require('$:/plugins/OokTech/Bob/UsePouchDB.js')
const thePath = new RegExp('^\/pouch\/save')

module.exports = {
  method: "POST",
  path: thePath,
  handler: function(request,response,state) {
    const tiddlerString = state.data
    try {
      const tiddlerFields = JSON.parse(tiddlerString)
      tiddlerDB.get(tiddlerFields.title, function(err,doc) {
        if (err) {
          if (err.name === 'not_found') {
            // Put new tiddler
            // Update existing tiddler
            const newDoc = {fields: tiddlerFields, _id: tiddlerFields.title}
            tiddlerDB.put(newDoc, function(err, res) {
              if (err) {
                console.log(err)
                response.writeHead(403)
                response.end()
              }
              console.log('saved ', tiddlerFields.title)
              // Just reply with a 200, nothing else is needed here.
              response.writeHead(200, {"Content-Type": "text/plain"});
              response.end("");
            })
          } else {
            console.log(err)
            // Some other error
            response.writeHead(403)
            response.end()
          }
        } else {
          // Update existing tiddler
          const newDoc = {fields: tiddlerFields, _id: doc._id, _rev: doc._rev}
          tiddlerDB.put(newDoc, function(err, res) {
            if (err) {
              console.log(err)
            }
            console.log('saved ', doc._id)
            // Just reply with a 200, nothing else is needed here.
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("");
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
