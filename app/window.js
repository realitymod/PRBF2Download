$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    $('#version-number').text('v' + app.getVersion());
    var WebTorrent = require('webtorrent');




    const shell = require('electron').shell;
    const prettyBytes = require('pretty-bytes');
    var humanizeDuration = require('humanize-duration')
    var spawn = require("child_process").spawn, child;

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
            var window = remote.getCurrentWindow();
            window.setProgressBar(torrent.progress,{mode: "normal"});
            $('#progress-bar').attr('aria-valuenow', torrent.progress * 100);
            $('#progress-bar').css('width', torrent.progress * 100 + '%');
            $('#progress-bar').text(Math.round(torrent.progress * 100) + '%');
            if(Math.round(torrent.progress * 100) == 100){
                $('#progress-information-size').text(' ');
                $('#progress-information-time').text('Verifying Files...');
                $('#progress-information-speed').text(' ');
            }else{
                $('#progress-information-size').text(prettyBytes(torrent.progress*torrent.length) +'/' + prettyBytes(torrent.length));
                $('#progress-information-time').text(humanizeDuration(torrent.timeRemaining,{ round: true, largest: 2 }) + ' remaining');
                $('#progress-information-speed').text(prettyBytes(torrent.downloadSpeed) + '/s');
            }

        }, 1000);

        torrent.on('done', function () {
            var win = remote.getCurrentWindow();
            win.setProgressBar(1,{mode: "none"});
            var notification = {
                title: "PR:BF2 Download Assistant",
                body: "Download Complete",
                icon: './assets/icons/png/256x256.png'
            };

            var myNotification = new window.Notification(notification.title, notification);

            myNotification.onclick = () => {
                win.show();
            }
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#progress-bar').attr('class', 'progress-bar progress-bar-striped');
            $('#install-container').css('visibility', 'visible');
            $('#progress-information').text( prettyBytes(torrent.progress*torrent.length) +'/' + prettyBytes(torrent.length) + ' | ' + humanizeDuration(torrent.timeRemaining,{ round: true }) + ' remaining | ' + prettyBytes(torrent.downloadSpeed) + '/s');

            $('#progress-information').css('visibility', 'hidden');
            clearInterval(interval);
            torrent.destroy();
            if (getOsVersion()) {
                $('#install-instructions').text('Once you have mounted the PR:BF2 Installer will appear as a mounted DVD. You will be able to run the setup of PR:BF2 by opening it.');
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