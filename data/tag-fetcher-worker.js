var audio = document.getElementById('sound-player');
var filePath = null;

self.port.on('loadTags', function(fileInfo) {
    console.log('inside of loadTags');
    let encodedData = btoa(fileInfo.Bytes);

    let dataURI = 'data:';
    dataURI += fileInfo.ContentType;
    dataURI += ';base64,';
    dataURI += encodedData;

    let asset = AV.Asset.fromURL(dataURI);

    let tagData = {};
    filePath = fileInfo.FilePath;

    asset.on('metadata', function(meta) {
        console.log('asset.on metadata called');
        tagData.Title = meta.title.replace('\u0000', '') || '';
        tagData.Album = meta.album.replace('\u0000', '')|| '';
        tagData.Artist = meta.artist.replace('\u0000', '') || '';
        tagData.FilePath = filePath;
        if (typeof(meta.coverArt) != 'undefined') {
            tagData.CoverURL = meta.coverArt.toBlobURL();
        } else {
            tagData.CoverURL = null;
        }
    });

    asset.get('duration', function(msec) {
        console.log('asset.get duration called');
        tagData.Duration = msec;
        asset.stop();

        self.port.emit('tagDataLoaded', tagData);
    });

    asset.start();
});