$(() => {
    var WebTorrent = require('webtorrent');
    const remote = require('electron').remote;
    const shell = require('electron').shell;
    var spawn = require("child_process").spawn, child;
    fs = require('fs')

    const app = remote.app;
    var client = new WebTorrent();

    const filename = 'gimp_test_iso.iso';
    var executablePath = app.getPath('downloads') + '\\' + filename;
    var magnetURI = 'http://files.realitymod.com/bt/gimp_test_iso.iso.torrent';

    client.add(magnetURI, {path: app.getPath('downloads')}, onTorrent);

    function onInstallButtonPress() {
        if (getOsVersion()) {
            child = spawn("powershell.exe", ["-Command", "Mount-DiskImage -ImagePath \"" + app.getPath('downloads') + '\\' + filename + "\""]);
        } else {
            shell.showItemInFolder(executablePath);
        }
    }

    function onMinimizeButtonPress() {
        var window = remote.getCurrentWindow();
        window.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
    }

    function onCloseButtonPress() {
        var window = remote.getCurrentWindow();
        app.quit();
        window.close();

    }

    function getOsVersion() {
        var os = require('os');
        var release = os.release();
        var splitRelease = release.split('.')/**/;
        if (splitRelease[0] === '10' || splitRelease[0] === '8') {
            return true;
        } else {
            return false;
        }

    }

    function onTorrent(torrent) {
        var interval = setInterval(function () {
            $('#progress-bar').attr('aria-valuenow', torrent.progress * 100);
            $('#progress-bar').css('width', torrent.progress * 100 + '%');
            $('#progress-bar').text(Math.round(torrent.progress * 100) + '% - ' + (client.downloadSpeed / 1000000).toFixed(2) + ' MB/s');
        }, 1000);

        torrent.on('done', function () {
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#progress-bar').attr('class', 'progress-bar progress-bar-striped');
            $('#install-container').css('visibility', 'visible');
            clearInterval(interval);
            torrent.destroy();
            if (getOsVersion()) {
                $('#install-instructions').text('Once you have mounted the Installer it will appear as a DVD. You will be able to run the setup of PR:BF2 by opening it.');
                $('#install-button').text('Mount Installer');
            } else {
                $('#install-instructions').text('Please use software such as 7ZIP or WinRar to open the ISO file you have downloaded. Then start the Setup executable to start the PR:BF2 installer.');
            }
        })
    }

    document.querySelector('#install-button').addEventListener('click', onInstallButtonPress);
    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
});