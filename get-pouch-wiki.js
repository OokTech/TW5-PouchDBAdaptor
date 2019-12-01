/*\
title: $:/plugins/OokTech/PouchDBAdaptor/get-pouch-wiki.js
type: application/javascript
module-type: route

GET /^\/pouch\/wiki

Returns the wiki

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const wikisDB = require('$:/plugins/OokTech/Bob/UsePouchDB.js').wikis
const tiddlerDB = require('$:/plugins/OokTech/Bob/UsePouchDB.js')
const thePath = /^\/pouch\/wiki(\/?)$/

module.exports = {
  method: "GET",
  path: thePath,
  handler: function(request,response,state) {
    try {
      // Assume that the url is properly formatted
      //const title = request.url.split('?')[1].split('=')[1]
      const title = 'wiki'
      // We don't return the whole doc, just the fields part, so we need to
      // make a function here instead of just putting in callback as the
      // second argument.
      wikisDB.get(title, function (err, doc) {
        if (err) {
          if (err.name === 'not_found') {
            // If the wiki doesn't exist yet, make one.
            // Use the render thing
            const wikiHTML = $tw.wiki.renderTiddler("text/plain",'$:/core/save/all',{variables: {currentTiddler: '$:/core/save/all'}})
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(wikiHTML);
            wikisDB.put({_id: 'wiki', wiki: wikiHTML}, function(err, res) {
              if (err) {
                console.log(err)
              }
            })
          } else {
            response.writeHead(403)
            response.end()
          }
        } else {
          tiddlerDB.allDocs({include_docs: true}, function(err, docs) {
            if (err) {
              console.log(err)
              response.writeHead(403)
              response.end()
            } else {
              docs.rows.forEach(function(docInfo) {
                $tw.wiki.addTiddler(new $tw.Tiddler(docInfo.doc.fields))
              })
              const wikiHTML = $tw.wiki.renderTiddler("text/plain",'$:/core/save/all',{variables: {currentTiddler: '$:/core/save/all'}})
              response.writeHead(200, {"Content-Type": "text/html"});
              response.end(wikiHTML);
            }
          })
        }
      })
      // Just reply with a 200, nothing else is needed here.
    } catch (e) {
      console.log(e)
      response.writeHead(403)
      response.end()
    }
  }
}

}());
