$(() => {
    var WebTorrent = require('webtorrent');
    const remote = require('electron').remote;
    const shell = require('electron').shell;
    const app = remote.app;
    var client = new WebTorrent();
    var executablePath = app.getPath('downloads') + '\\gimp-2.8.22-setup.exe';
    var magnetURI = 'http://www.legittorrents.info/download.php?id=c691c817f7310ab3e7851576814dfc167bb52740&f=gimp-2.8.22-setup.exe.torrent';
    client.add(magnetURI, {path: 'C:/Users/Wouter Jansen/Downloads'}, onTorrent);

    function onButtonPress() {
        console.log(executablePath);
        shell.showItemInFolder(executablePath);
    }

    document.querySelector('#install-button').addEventListener('click', onButtonPress)

    function onTorrent(torrent) {
        var interval = setInterval(function () {
            $('#progress-bar').attr('aria-valuenow', torrent.progress * 100);
            $('#progress-bar').css('width', torrent.progress * 100 + '%');
            $('#progress-bar').text(torrent.progress);
        }, 1000);

        torrent.on('done', function () {
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#install-container').css('visibility', 'visible');
            clearInterval(interval);
        })
    }
});