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
    const versionInformationURL = 'https://d76a05d74f889aafd38d-39162a6e09ffdab7394e3243fa2342c1.ssl.cf2.rackcdn.com/version.json';
    let paused = false;
    let completed = false;
    const configPath = path.join(app.getPath('userData'), 'config.json');
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
            url: versionInformationURL,
            success:function(data) {
                handleData(data.version_big);
            }
        });
    }

    function getTorrentURL(handleData) {
        $.ajax({
            url: versionInformationURL,
            success:function(data) {
                handleData(data.torrent_url);
            }
        });
    }

    function getTorrentFileName(handleData) {
        $.ajax({
            url: versionInformationURL,
            success:function(data) {
                handleData(data.torrent_filename);
            }
        });
    }

    function getTorrentSetupName(handleData) {
        $.ajax({
            url: versionInformationURL,
            success:function(data) {
                handleData(data.torrent_setupname);
            }
        });
    }

    function getDownloadStoragePath() {
        return JSON.parse(fs.readFileSync(configPath)).downloadStoragePath;
    }

    function onInstallButtonPress() {
        if(!completed){
            win.setProgressBar(0, {mode: "normal"});
            if(!paused){client.remove(client.torrents[0]);}
            win.loadFile('./app/cancel.html')
        }else {
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
                $('#install-instructions').text('Once the installation is complete you can remove this utility and delete the Installer ISO file.');
            } else {
                shell.showItemInFolder(isoPath);
            }
        }
    }

    function onMinimizeButtonPress() {
        win.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
    }

    function onPRManualLinkPress() {
        shell.openExternal('https://www.realitymod.com/manual')
    }

    function onGithubLinkPress() {
        shell.openExternal('https://github.com/WouterJansen/PRBF2Download')
    }

    function onCloseButtonPress() {
        win.setProgressBar(0, {mode: "normal"});
        if(!paused){client.remove(client.torrents[0]);}
        win.loadFile('./app/cancel.html')
    }

    function onTorrentContinueButtonPress() {
        $('#torrent-pause').css('color', 'white');
        $('#torrent-start').css('color', '#5a5757');
        getTorrentURL(function(torrent_url){
            client.add(torrent_url, {path: getDownloadStoragePath()}, onTorrent);
        });
        paused = false;
        $('#progress-information-time').text('Verifying Files...');
    }
    function onTorrentPauseButtonPress() {
        win.setProgressBar(client.progress, {mode: "paused"});
        $('#torrent-start').css('color','white');
        $('#torrent-pause').css('color','#5a5757');
        client.remove(client.torrents[0]);
        $('#progress-information-size').text(' ');
        $('#progress-information-time').text('Paused...');
        $('#progress-information-speed').text(' ');
        paused = true;
    }

    function getOsVersion() {
        const os = require('os');
        const release = os.release();
        const splitRelease = release.split('.')/**/;
        return splitRelease[0] === '10' || splitRelease[0] === '8';
    }

    function onTorrent(torrent) {
        let interval = setInterval(function () {
            if(!paused) {
                win.setProgressBar(client.progress, {mode: "normal"});
                $('#progress-bar').attr('aria-valuenow', client.progress * 100);
                $('#progress-bar').css('width', client.progress * 100 + '%');
                $('#progress-bar').text(Math.round(client.progress * 100) + '%');
                if (Math.round(client.progress * 100) === 100) {
                    $('#progress-information-size').text(' ');
                    $('#progress-information-time').text('Verifying Files...');
                    $('#progress-information-speed').text(' ');
                } else {
                    $('#progress-information-size').text(prettyBytes(client.progress * torrent.length) + '/' + prettyBytes(torrent.length));
                    $('#progress-information-time').text(humanizeDuration(torrent.timeRemaining, {
                        round: true,
                        largest: 2
                    }) + ' remaining');
                    $('#progress-information-speed').text(prettyBytes(client.downloadSpeed) + '/s');
                }
            }else{
                clearInterval(interval);
            }
        }, 1000);

        torrent.on('done', function () {
            win.setProgressBar(1, {mode: "normal"});
            completed = true;
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
            $('#progress-bar').attr('aria-valuenow', 100);
            $('#progress-bar').css('width', 100 + '%');
            $('#progress-bar').text('Completed');
            $('#progress-bar').attr('class', 'progress-bar progress-bar-striped');
            $('#progress-information').css('visibility', 'hidden');
            $('#install-container').css('visibility', 'visible');
            $('#torrent-pause').css('visibility', 'hidden');
            $('#torrent-start').css('visibility', 'hidden');
            clearInterval(interval);
            torrent.destroy();
            if (getOsVersion()) {
                $('#install-instructions').text('');
                $('#install-button').text('Start installer');
            } else {
                $('#install-button').text('Open downloads folder');
                $('#install-instructions').text('Please use software such as 7ZIP or WinRar to open the ISO file you have downloaded. Then can you start the installer (' + installerName + ').');
            }
        })
    }

    document.querySelector('#install-button').addEventListener('click', onInstallButtonPress);
    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
    document.querySelector('#github-link').addEventListener('click', onGithubLinkPress);
    document.querySelector('#prbf2-manual-link').addEventListener('click', onPRManualLinkPress);
    document.querySelector('#torrent-start').addEventListener('click', onTorrentContinueButtonPress);
    document.querySelector('#torrent-pause').addEventListener('click', onTorrentPauseButtonPress);

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