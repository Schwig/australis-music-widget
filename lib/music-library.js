var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var WindowUtils = require("sdk/window/utils");

var data = require('sdk/self').data;
var io = require('sdk/io/file');
var ss = require('sdk/simple-storage');

var Folder = require('./file-tree').Folder;
var TagFetcher = require('./tag-fetcher').TagFetcher;

function MusicLibrary() {
    let rootPath = null;
    let rootFolder = null;
    let audioTracks = [];
    let tagFetcher = new TagFetcher();

    if (typeof(ss.storage.msuMusicPlayerLibraryPath) == 'undefined') {
        selectRootFolder();
    } else {
        rootPath = ss.storage.msuMusicPlayerLibraryPath;
        rootFolder = new Folder(rootPath);
    }

    console.log(rootFolder);

    function tagDataLoaded(tagData) {
        console.log('===MusicLibrary::tagDataLoaded()===');
        console.log(tagData);
    }

    tagFetcher.readList(rootFolder.getFileList(), tagDataLoaded);

    function selectRootFolder() {
        let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
        filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Music Folder', Ci.nsIFilePicker.modeGetFolder);
        filePicker.show();

        rootPath = filePicker.fileURL.path;
        ss.storage.msuMusicPlayerLibraryPath = rootPath;

        rootFolder = new Folder(rootPath);
    }
    

    return {
        resetLibrary: function() {
            selectRootFolder();
        }
    };
}

exports.MusicLibrary = MusicLibrary;