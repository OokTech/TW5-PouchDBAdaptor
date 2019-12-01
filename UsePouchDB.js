/*\
title: $:/plugins/OokTech/Bob/UsePouchDB.js
type: application/javascript
module-type: library

This loads the pouchdb module and opens the tiddlers database to pass to other
functions.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */

let PouchDB = undefined
let tiddlersDB = undefined
let wikisDB = undefined
if ($tw.node) {
  try {
    PouchDB = require('pouchdb')
    tiddlersDB = new PouchDB('tiddlers')
    wikisDB = new PouchDB('wikis')
  } catch (e) {

  }
}
module.exports = tiddlersDB

module.exports.wikis = wikisDB

})();
