$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    const fs = require('fs');
    const path = require('path');
    let downloadsPath = app.getPath('downloads');
    const shell = require('electron').shell;
    const win = remote.getCurrentWindow();
    const configPath = path.join(app.getPath('userData'), 'config.json');

    $('#download-storage-location-text').attr('value', downloadsPath);
    getVersionBig(function(version){
        $('#prbf2-version').text(version);
    });
    function onBrowseButtonPress() {
        let downloadsPathTemp = remote.dialog.showOpenDialog({
            title: 'Select Download location',
            defaultPath: downloadsPath,
            properties: ['openDirectory', 'createDirectory']
        });
        if (downloadsPathTemp !== undefined) {
            downloadsPath = downloadsPathTemp[0]
        }
        $('#download-storage-location-text').attr('value', downloadsPath);
    }

    function getVersionBig(handleData) {
        $.ajax({
            url: "https://www.realitymod.com/version/version.json",
            success:function(data) {
                handleData(data.version_big);
            }
        });
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

    function onContinueButtonPress() {
        fs.writeFileSync(configPath, JSON.stringify({downloadStoragePath: downloadsPath}));
        win.loadFile('./app/download.html')

    }

    document.querySelector('#continue-button').addEventListener('click', onContinueButtonPress);
    document.querySelector('#browse-button').addEventListener('click', onBrowseButtonPress);
    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
    document.querySelector('#github-link').addEventListener('click', onGithubLinkPress);
});