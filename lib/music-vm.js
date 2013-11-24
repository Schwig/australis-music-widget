var data = require('sdk/self').data;

var MusicPlayer = require('./music-player').MusicPlayer;
var MusicLibrary = require('./music-library').MusicLibrary;

const elementIds = {
    Container: "msu-music-vbox-container",
    SetLibrary: "msu-music-btn-set-library",
    Elapsed: "msu-music-playback-elapsed",
    Remaining: "msu-music-playback-remaining",
    ProgressSlider: "msu-music-playback-progress",
    Previous: "msu-music-btn-previous",
    PlayPause: "msu-music-btn-play-pause",
    Next: "msu-music-btn-next",
    Library: "msu-music-vbox-library",
    AlbumArtwork: "msu-music-img-album-artwork",
    Title: "msu-music-lbl-title",
    Album: "msu-music-lbl-album",
    Artist: "msu-music-lbl-artist"
};

function ViewModel() {
    console.log('===ViewModel Constructor===');
    let document = null;
    let view = null;

    let UI = {
        btnPrevious: null,
        btnNext: null,
        btnPlayPause: null,
        btnSetLibrary: null,
        lblTitle: null,
        lblAlbum: null,
        lblArtist: null,
        lblElapsed: null,
        lblRemaining: null,
        sliderPlaybackProgress: null,
        vLibrary: null,
        vContainer: null,
        imgAlbumArtwork: null
    };

    let musicPlayer = new MusicPlayer(timeUpdate);
    let musicLibrary = new MusicLibrary();
    // Not sure about this one
    let musicPlaylist = null;

    // UI Functions and Variables
    let usingSlider = false;

    function updatePlaybackProgress() {
        // Set the time elapsed and the progress slider position
    }

    function updateTagData() {
        // Set Title, Artist, Album Artwork, and Duration
    }

    function fillLibrary() {
        // Create list of labels and put them into the library
    }

    function fillUI() {
        updatePlaybackProgress();
        updateTagData();
        fillLibrary();
    }

    // Callback Functions
    function timeUpdate(msec) {
        if (!usingSlider) {
            // Update progress slider
        }
    }

    // Event Functions

    function playPauseClicked() {

    }

    function nextClicked() {

    }

    function previousClicked() {

    }

    function sliderClicked() {
        usingSlider = true;
    }

    function sliderReleased() {
        usingSlider = false;
    }

    function sliderChanged() {
        // If the user is causing the change, then seek the track
        // Otherwise, ignore the event
        if (usingSlider) {
            // Seek the track
        }
    }

    function populateView() {
        console.log('===populateView()===');

        let xulToInject = data.load('music-player.xul');

        view.innerHTML = xulToInject;

        // Get XUL elements and assign them to local variables
        UI.btnPrevious = document.getElementById(elementIds.Previous);
        UI.btnNext = document.getElementById(elementIds.Next);
        UI.btnPlayPause = document.getElementById(elementIds.PlayPause);
        UI.btnSetLibrary = document.getElementById(elementIds.SetLibrary);
        UI.lblElapsed = document.getElementById(elementIds.Elapsed);
        UI.lblRemaining = document.getElementById(elementIds.Remaining);
        UI.sliderPlaybackProgress = document.getElementById(elementIds.ProgressSlider);
        UI.vLibrary = document.getElementById(elementIds.Library);
        UI.vContainer = document.getElementById(elementIds.Container);
        UI.imgAlbumArtwork = document.getElementById(elementIds.AlbumArtwork);
        UI.lblTitle = document.getElementById(elementIds.Title);
        UI.lblAlbum = document.getElementById(elementIds.Album);
        UI.lblArtist = document.getElementById(elementIds.Artist);

        // Add event listeners

        // Fill in UI information
        fillUI();
    }

    return {
        injectUI: function(doc, theView) {
            document = doc;
            view = theView;
            populateView();
        },

        togglePlayback: function() {
            let btn = document.getElementById('msu-music-btn-play-pause');

            if (model.isPlaying) {
                btn.innerHTML = 'Play';
            } else {
                btn.innerHTML = 'Pause';
            }

            model.isPlaying = !model.isPlaying;
        }
    };
}

exports.ViewModel = ViewModel;