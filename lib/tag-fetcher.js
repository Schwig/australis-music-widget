const { defer } = require('sdk/core/promise');

var data = require('sdk/self').data;
var PageWorker = require('sdk/page-worker');
var setInterval = require('sdk/timers').setInterval;
var clearInterval = require('sdk/timers').clearInterval;
var indexedDB = require('indexed-db').indexedDB;

function TagFetcher() {
    console.log('===TagFetcher constructor()===');

    let deferred = null;
    let tagDataLoaded = null;
    let fileList = [];
    let fileIndex = 0;

    let db = null;
    let openDbRequest = indexedDB.open('msuMusicData', 1);

    openDbRequest.onupgradeneeded = function(e) {
        db = e.target.result;

        if (!db.objectStoreNames.contains('tagData')) {
            console.log('Creating tagData object store');
            db.createObjectStore('tagData', {
                keyPath: 'filePath'
            });
        } else {
            console.log('Already contains tagData object store');
        }
    };

    openDbRequest.onsuccess = function(e) {
        console.log('openDbRequest was successful');

        db = e.target.result;
    };

    let pageWorker = PageWorker.Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('tag-fetcher-worker.js')],
        contentURL: data.url('tag-fetcher.html')
    });

    pageWorker.port.on('tagDataLoaded', function(tagData) {
        console.log('TagFetcher::pageWorker::tagDataLoaded()');
        tagDataLoaded(tagData);

        fileIndex++;

        while (db == null) {}

        let trans = db.transaction(['tagData'], 'readwrite');
        let store = trans.objectStore('tagData');
        console.log('storing tagdata into indexeddb');
        console.log(tagData);
        let req = store.put(tagData);

        req.onsuccess = function(e) {
            if (fileIndex < fileList.length) {
                readFile();
            } else {
                fileList = null;
                fileIndex = 0;
                tagDataLoaded = null;
            }
        };
    });

    function readFile() {
        let file = fileList[fileIndex];
        let filePath = file.getPath();

        while (db == null) {}
        let trans = db.transaction(['tagData'], 'readwrite');
        let store = trans.objectStore('tagData');
        let req = store.get(file.getPath());
        let result = null;

        req.onsuccess = function(e) {
            result = e.target.result;

            if (result) {
                console.log('Already contains entry for ' + filePath);
                console.log(result);
                tagDataLoaded(result);
            } else {
                console.log('indexedDB doesnt contain entry, using pageWorker');

                pageWorker.port.emit('loadTags', {
                    Bytes: file.getBytes(),
                    ContentType: file.ContentType,
                    FilePath: filePath
                });
            }
        };
    }

    return {
        readList: function(xs, callback) {
            if (xs.length > 0) {
                tagDataLoaded = callback;
                fileList = xs;
                fileIndex = 0;

                let file = fileList[0];
                let filePath = file.getPath();

                while (db == null) {}
                let trans = db.transaction(['tagData'], 'readwrite');
                let store = trans.objectStore('tagData');
                let req = store.get(file.getPath());
                let result = null;

                req.onsuccess = function(e) {
                    result = e.target.result;

                    if (result) {
                        console.log('Already contains entry for ' + filePath);
                        console.log(result);
                        tagDataLoaded(result);
                        fileIndex++;
                        if (fileIndex < fileList.length) {
                            readFile();
                        }
                    } else {
                        console.log('Doesnt contain entry');

                        pageWorker.port.emit('loadTags', {
                            Bytes: file.getBytes(),
                            ContentType: file.ContentType,
                            FilePath: filePath
                        });
                    }
                };
            }
        }
        // getAudioData: function(file, return) {
        //     console.log('===TagFetcher::getAudioData()===');
        //     console.log(file);

        //     let requestCompleted = false;
        //     let intervalId = null;
        //     let result = null;

        //     let filePath = file.getPath();
        //     let trans = db.transaction(['tagData'], 'readwrite');
        //     let store = trans.objectStore('tagData');
        //     let req = store.get(filePath);

        //     // let req = store.openCursor('filePath');


        //     req.onsuccess = function(e) {
        //         result = e.target.result;
        //         requestCompleted = true;

        //         if (result) {
        //             console.log('Already contains entry for ' + filePath);
        //             console.log(result);
        //             foo = result;
        //         } else {
        //             console.log('Doesnt contain entry');
        //             // read data for file path
        //             // put data in object store
        //             // call the callback with the returned data
        //         }
        //     };

        //     intervalId = setInterval(function() {
        //         if (requestCompleted) {
        //             clearInterval(intervalId);
        //         }
        //     }, 300);

        //     return result;
        // }
    };
}

exports.TagFetcher = TagFetcher;