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
            $('#progress-bar').text(Math.round(torrent.progress * 100) + '%');
        }, 1000);

        torrent.on('done', function () {
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#progress-bar').attr('class', 'progress-bar progress-bar-striped');
            $('#install-container').css('visibility', 'visible');
            clearInterval(interval);
            if(getOsVersion()){
                $('#install-instructions').text('Please open the folder and double click the ISO file to mount it. Then you can start the Setup process.');
            }else{
                $('#install-instructions').text('Please use software such as 7ZIP or WinRar to open the ISO file you have downloaded and start the Setup executable to start the PR:BF2 installer.');
            }
        })
    }
});

function getOsVersion(){
    var os = require('os');
    var release = os.release();
    var splitRelease = release.split('.')
    if(splitRelease[0] == '10' || splitRelease[0] == '8'){
        console.log('mount version')
        return true;
    }else{
        console.log('none-mount version')
        return false;
    }

}