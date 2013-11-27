var data = require('sdk/self').data;

var MusicPlayer = require('./music-player').MusicPlayer;
var MusicLibrary = require('./music-library').MusicLibrary;

let searchFilter = '';
let selectedTrackIndex = 0;
let selectedTrack = null;

let Tracks = [
    { Artist: 'Bassnectar', Title: 'I Am a Laser ft. Double You', Album: 'Cozza Frenzy', Duration: '342', CoverURL: 'http://www.om-records.com/files/release_images/000/003/790/large/Bassnectar_CozzaFrenzy_1800_iTunes.jpg' },
    { Artist: 'Bassnectar', Title: 'When I Grow Up (Bassnectar Remix)', Album: 'Cozza Frenzy', Duration: '362', CoverURL: 'http://www.om-records.com/files/release_images/000/003/790/large/Bassnectar_CozzaFrenzy_1800_iTunes.jpg' },
    { Artist: 'Saqi', Title: 'Jarro ft. The Polish Ambassador', Album: 'Quests End', Duration: '328', CoverURL: 'http://f0.bcbits.com/img/a4086383015_10.jpg' },
    { Artist: 'Saqi', Title: 'Your Last Breath', Album: 'Quests End', Duration: '322', CoverURL: 'http://f0.bcbits.com/img/a4086383015_10.jpg' }
];

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

    // let musicPlayer = new MusicPlayer(timeUpdate);
    // let musicLibrary = new MusicLibrary();
    // // Not sure about this one
    // let musicPlaylist = null;

    // UI Functions and Variables
    let usingSlider = false;

    function updatePlaybackProgress() {
        // Set the time elapsed and the progress slider position
    }

    function updateTagData() {
        // Set Title, Artist, Album Artwork, and Duration
    }

    function fillLibrary() {
        console.log('===MusicVM::fillLibrary()===');

        // Clear library
        UI.vLibrary.innerHTML = '';

        // Create list of labels and put them into the library

        let counter = 0;

        for each (let track in Tracks) {
            console.log('adding track');
            console.log(track);
            if (searchFilter == '' || track.Artist.contains(searchFilter) || track.Title.contains(searchFilter)) {
                // Add track to list of labels
                let trackId = counter + '';
                let lbl = document.createElement('label');
                lbl.setAttribute('value', String.concat(track.Artist, ' - ', track.Title));

                lbl.addEventListener('mouseover', function() {
                    lbl.setAttribute('style', 'background-color: #0066cc');
                });

                lbl.addEventListener('mouseout', function() {
                    lbl.setAttribute('style', '');
                });

                lbl.addEventListener('click', function() {
                    console.log(parseInt(trackId));
                });

                UI.vLibrary.appendChild(lbl);
                counter++;
            }
        }
    }

    function fillUI() {
        updatePlaybackProgress();
        updateTagData();
        fillLibrary();
    }

    // Callback Functions
    function timeUpdate() {
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
        }
        // },

        // togglePlayback: function() {
        //     let btn = document.getElementById('msu-music-btn-play-pause');

        //     if (model.isPlaying) {
        //         btn.innerHTML = 'Play';
        //     } else {
        //         btn.innerHTML = 'Pause';
        //     }

        //     model.isPlaying = !model.isPlaying;
        // }
    };
}

exports.ViewModel = ViewModel;