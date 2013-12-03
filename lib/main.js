var indexedDB = require('indexed-db').indexedDB;

var Widgets = require('sdk/widget');

var AustralisWidget = require("./xul-manager/australis-widget.js").AustralisWidget;
var TestWidget = require("./test-widget.js").TestWidget;

let db = null;

function initAddon() {
  var testWidget = new TestWidget({
    Database: db
  });
  var australisWidget = new AustralisWidget(testWidget);
}

let openDbRequest = indexedDB.open('msuAustralsMusicData', 1);

openDbRequest.onupgradeneeded = function(e) {
  db = e.target.result;

  if (!db.objectStoreNames.contains('tagData')) {
    console.log('Creating tagData object store');
    let store = db.createObjectStore('tagData', {
      keyPath: 'FilePath'
    });
    console.log('store created');
  } else {
    console.log('Already contains tagData object store');
  }

  // initAddon();
};

openDbRequest.onsuccess = function(e) {
  console.log('openDbRequest was successful');
  db = e.target.result;

  initAddon();
};

// let useButtonLoader = false;

// if(useButtonLoader) {
//     var widgetLoader = Widgets.Widget({
//       id: "msu-music-loader",
//       label: "Music Loader",
//       contentURL: "http://mozilla.org/favicon.ico",
//       onClick: function() {
//         initAddon();
//       }
//     });
// } else {
//     initAddon();
// }

