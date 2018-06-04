$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    const fs = require('fs');
    const path = require('path');
    let downloadsPath = app.getPath('downloads');
    const shell = require('electron').shell;
    const win = remote.getCurrentWindow();
    const configPath = path.join(app.getPath('userData'), 'config.json');

    $('#version-number').text('v' + app.getVersion());
    $('#download-storage-location-text').attr('value', downloadsPath);

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

    function onMinimizeButtonPress() {
        win.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
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
});