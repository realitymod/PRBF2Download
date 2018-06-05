$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    const fs = require('fs');
    const path = require('path');
    const shell = require('electron').shell;
    const win = remote.getCurrentWindow();
    const configPath = path.join(app.getPath('userData'), 'config.json');
    let isoPath = 'none';
    const versionInformationURL = 'https://www.realitymod.com/version/versiontest.json';

    function getDownloadStoragePath() {
        return JSON.parse(fs.readFileSync(configPath)).downloadStoragePath;
    }

    function onMinimizeButtonPress() {
        win.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
    }

    function onGithubLinkPress() {
        shell.openExternal('https://github.com/WouterJansen/PRBF2Download')
    }

    function onCloseButtonPress() {
        app.quit();
        win.close();

    }

    function getTorrentFileName(handleData) {
        $.ajax({
            url: versionInformationURL,
            success:function(data) {
                handleData(data.torrent_filename);
            }
        });
    }

    function onContinueButtonPress() {
        win.loadFile('./app/download.html')

    }

    function onCancelButtonPress() {
        app.quit();
        win.close();

    }

    function onCancelAndRemoveButtonPress() {
        try{
            fs.unlinkSync(isoPath);
        }catch(err){
            console.log(err)
        }
        fs.unlinkSync(configPath);
        app.quit();
        win.close();
    }

    getTorrentFileName(function(torrent_filename){
        isoPath = path.join(getDownloadStoragePath(), torrent_filename)
    });

    document.querySelector('#cancel-button').addEventListener('click', onCancelButtonPress);
    document.querySelector('#cancel-remove-button').addEventListener('click', onCancelAndRemoveButtonPress);
    document.querySelector('#continue-button').addEventListener('click', onContinueButtonPress);
    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
    document.querySelector('#github-link').addEventListener('click', onGithubLinkPress);
});