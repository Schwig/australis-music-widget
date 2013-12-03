var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var WindowUtils = require("sdk/window/utils");

var data = require('sdk/self').data;
var io = require('sdk/io/file');
var ss = require('sdk/simple-storage');

var PageWorker = require('sdk/page-worker');

var Folder = require('./file-tree').Folder;
// var TagFetcher = require('./tag-fetcher').TagFetcher;

function Playlist() {
    let current = null;
    let songList = [];

    return {
        addSong: function(track) {
            songList.push(track);
        },

        getSongList: function() { return songList; },

        toSongAtIndex: function(index) {
            console.log('current = ' + current);
            current = index;
            console.log('current = ' + current);
            return songList[index];
        },

        toNext: function() {
            console.log('current = ' + current);
            current = (current + 1) % songList.length;
            console.log('current = ' + current);
            return songList[current];
        },

        toPrevious: function() {
            console.log('current = ' + current);
            if (current == -1) {
                current = songList.length - 1;
            } else {
                current = (current - 1) % songList.length;
            }
            if (current < 0) {
                current = songList.length + current;
            }
            console.log('current = ' + current);
            return songList[current];
        },

        clearSongs: function() {
            songList.length = 0;
            current = -1;
        }
    }
}

function isAudioFile(file) {
    return true;
}

function MusicLibrary(database) {
    let db = database;
    let fileIndex = 0;

    function selectRootFolder() {
        let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
        filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Music Folder', Ci.nsIFilePicker.modeGetFolder);
        filePicker.show();

        rootPath = filePicker.fileURL.path;
        ss.storage.msuMusicPlayerLibraryPathVideo = rootPath;

        isDoneReadingFiles = false;
        rootFolder = new Folder(rootPath);
        fileList = rootFolder.getFileList();
        readTracks();
    }

    function readTracks() {
        let file = fileList[fileIndex];
        fileIndex++;

        if (typeof(file) == 'undefined') {
                isDoneReadingFiles = true;
                fileIndex = 0;
                return;
        }

        while (!isAudioFile(file)) {
            file = fileList[fileIndex];
            fileIndex++;

            if (typeof(file) == 'undefined') {
                isDoneReadingFiles = true;
                fileIndex = 0;
                return;
            }
        }

        // TODO: Make sure file is an audio file
        if (typeof(file) != 'undefined') {
            let trans = db.transaction(['tagData'], 'readwrite');
            let store = trans.objectStore('tagData');
            let req = store.get(file.getPath());
            let result = null;

            req.onsuccess = function(e) {
                result = e.target.result;

                if (result) {
                    console.log('Already contains entry for ' + file.getPath());
                    console.log(result);

                    // Copied from another method
                    audioTracks.push(result);

                    if (result.Artist.toLowerCase().contains(songFilter.toLowerCase()) || result.Title.toLowerCase().contains(songFilter.toLowerCase()) || result.Album.toLowerCase().contains(songFilter.toLowerCase())) {
                        console.log('adding song to playlist');
                        console.log(result);
                        playlist.addSong(result);
                    }

                    if (fileList.length == fileIndex) {
                        fileIndex = 0;
                        isDoneReadingFiles = true;
                    } else {
                        readTracks();
                    }
                    // End of copy
                } else {
                    console.log('indexedDB doesnt contain entry, using pageWorker');

                    pageWorker.port.emit('loadTags', {
                        Bytes: file.getBytes(),
                        ContentType: file.ContentType,
                        FilePath: file.getPath()
                    });
                }
            };

            // pageWorker.port.emit('loadTags', {
            //     Bytes: file.getBytes(),
            //     ContentType: file.ContentType,
            //     FilePath: file.getPath()
            // });
        }
    }

    let rootPath = null;
    let rootFolder = null;
    let audioTracks = [];

    let isDoneReadingFiles = false;

    let fileList = [];

    let playlist = new Playlist();
    let songFilter = '';

    let pageWorker = PageWorker.Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('tag-fetcher-worker.js')],
        contentURL: data.url('tag-fetcher.html')
    });

    pageWorker.port.on('tagDataLoaded', function(tagData) {
        audioTracks.push(tagData);

        let trans = db.transaction(['tagData'], 'readwrite');
        let store = trans.objectStore('tagData');
        console.log('storing tagdata into indexeddb');
        console.log(tagData);
        let req = store.put(tagData);

        if (tagData.Artist.toLowerCase().contains(songFilter.toLowerCase()) || tagData.Title.toLowerCase().contains(songFilter.toLowerCase()) || tagData.Album.toLowerCase().contains(songFilter.toLowerCase())) {
            console.log('adding song to playlist');
            console.log(tagData);
            playlist.addSong(tagData);
        }

        if (fileList.length == fileIndex) {
            fileIndex = 0;
            isDoneReadingFiles = true;
        } else {
            readTracks();
        }
    });

    if (true || typeof(ss.storage.msuMusicPlayerLibraryPathVideo) == 'undefined') {
        selectRootFolder();
    } else {
        rootPath = ss.storage.msuMusicPlayerLibraryPathVideo;
        rootFolder = new Folder(rootPath);
        fileList = rootFolder.getFileList();
        readTracks();
    }

    return {
        resetLibrary: function() {
            selectRootFolder();
        },
        isDoneReadingFiles: function() {
            return isDoneReadingFiles;
        },
        
        getPlaylist: function() {
            return playlist;
        },

        filterPlaylist: function (songFilter) {
            playlist.clearSongs();
            for each (let tagData in audioTracks) {
                if (tagData.Artist.toLowerCase().contains(songFilter.toLowerCase()) || tagData.Title.toLowerCase().contains(songFilter.toLowerCase()) || tagData.Album.toLowerCase().contains(songFilter.toLowerCase())) {
                    playlist.addSong(tagData);
                }
            }
        }
    };
}



exports.MusicLibrary = MusicLibrary;