$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    const WebTorrent = require('webtorrent');
    const fs = require('fs');
    const path = require('path');
    const shell = require('electron').shell;
    let spawn = require("child_process").spawn, child;
    const prettyBytes = require('pretty-bytes');
    const humanizeDuration = require('humanize-duration');
    const client = new WebTorrent();
    const win = remote.getCurrentWindow();

    let installerName = 'none';
    let setupPath = 'none';
    let isoPath = 'none';

    function findMountedDrive() {
        let found = false;
        for (let i = 65; i <= 90; i++) {
            if (fs.existsSync(String.fromCharCode(i) + ':\\' + installerName)) {
                found = true;
                return String.fromCharCode(i) + ':\\' + installerName
            }
        }
        if (found === false) {
            return 'none'
        }
    }

    function getVersionBig(handleData) {
        $.ajax({
            url: "https://www.realitymod.com/version/version.json",
            success:function(data) {
                handleData(data.version_big);
            }
        });
    }

    function getTorrentURL(handleData) {
        $.ajax({
            url: "https://www.realitymod.com/version/version.json",
            success:function(data) {
                handleData(data.torrent_url);
            }
        });
    }

    function getTorrentFileName(handleData) {
        $.ajax({
            url: "https://www.realitymod.com/version/version.json",
            success:function(data) {
                handleData(data.torrent_filename);
            }
        });
    }

    function getTorrentSetupName(handleData) {
        $.ajax({
            url: "https://www.realitymod.com/version/version.json",
            success:function(data) {
                handleData(data.torrent_setupname);
            }
        });
    }

    function getDownloadStoragePath() {
        return JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'config.json'))).downloadStoragePath;
    }

    function onInstallButtonPress() {
        if (getOsVersion()) {
            setupPath = findMountedDrive();
            if (setupPath === 'none') {
                child = spawn("powershell.exe", ["-Command", "Mount-DiskImage -ImagePath \"" + isoPath + "\""]);
                setTimeout(function () {
                    setupPath = findMountedDrive();
                    child = spawn(setupPath);
                }, 3000);
            } else {
                setupPath = findMountedDrive();
                child = spawn(setupPath);
            }
            $('#install-instructions').text('Once the installation is complete you can remove this utility.');
        } else {
            shell.showItemInFolder(isoPath);
        }
    }

    function onMinimizeButtonPress() {
        win.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
    }

    function onPRManualLinkPress() {
        shell.openExternal('https://realitymod.gitbooks.io/pr-manual/content/')
    }

    function onGithubLinkPress() {
        shell.openExternal('https://github.com/WouterJansen/PRBF2Download')
    }

    function onCloseButtonPress() {
        app.quit();
        win.close();

    }

    function getOsVersion() {
        const os = require('os');
        const release = os.release();
        const splitRelease = release.split('.')/**/;
        return splitRelease[0] === '10' || splitRelease[0] === '8';
    }

    function onTorrent(torrent) {
        let interval = setInterval(function () {
            win.setProgressBar(torrent.progress, {mode: "normal"});
            $('#progress-bar').attr('aria-valuenow', torrent.progress * 100);
            $('#progress-bar').css('width', torrent.progress * 100 + '%');
            $('#progress-bar').text(Math.round(torrent.progress * 100) + '%');
            if (Math.round(torrent.progress * 100) === 100) {
                $('#progress-information-size').text(' ');
                $('#progress-information-time').text('Verifying Files...');
                $('#progress-information-speed').text(' ');
            } else {
                $('#progress-information-size').text(prettyBytes(torrent.progress * torrent.length) + '/' + prettyBytes(torrent.length));
                $('#progress-information-time').text(humanizeDuration(torrent.timeRemaining, {
                    round: true,
                    largest: 2
                }) + ' remaining');
                $('#progress-information-speed').text(prettyBytes(torrent.downloadSpeed) + '/s');
            }

        }, 1000);

        torrent.on('done', function () {
            app.setAppUserModelId("PRBF2-Download-Assistant");
            let notification = {
                title: "PR:BF2 Download Assistant",
                body: "Download Complete",
                icon: './assets/icons/png/256x256.png'
            };
            let myNotification = new window.Notification(notification.title, notification);

            myNotification.onclick = () => {
                win.show();
            };
            win.setProgressBar(1, {mode: "none"});
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#progress-bar').attr('class', 'progress-bar progress-bar-striped');
            $('#progress-information').css('visibility', 'hidden');
            $('#install-container').css('visibility', 'visible');
            clearInterval(interval);
            torrent.destroy();
            if (getOsVersion()) {
                $('#install-instructions').text('');
                $('#install-button').text('Start Installer');
            } else {
                $('#install-instructions').text('Please use software such as 7ZIP or WinRar to open the ISO file you have downloaded. Then can you start the installer(Setup.exe).');
            }
        })
    }

    document.querySelector('#install-button').addEventListener('click', onInstallButtonPress);
    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
    document.querySelector('#github-link').addEventListener('click', onGithubLinkPress);
    document.querySelector('#prbf2-manual-link').addEventListener('click', onPRManualLinkPress);
    getVersionBig(function(version){
        $('#prbf2-version').text(version);
    });
    getTorrentURL(function(torrent_url){
        client.add(torrent_url, {path: getDownloadStoragePath()}, onTorrent);
    });
    getTorrentFileName(function(torrent_filename){
        isoPath = path.join(getDownloadStoragePath(), torrent_filename)
    });
    getTorrentSetupName(function(torrent_setupname){
        installerName = torrent_setupname;
    });





});