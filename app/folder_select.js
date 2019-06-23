$(() => {
    const remote = require('electron').remote;
    const app = remote.app;
    const fs = require('fs');
    const path = require('path');
    let downloadsPath = app.getPath('downloads');
    const shell = require('electron').shell;
    const win = remote.getCurrentWindow();
    const configPath = path.join(app.getPath('userData'), 'config.json');
    const versionInformationURL = 'https://d76a05d74f889aafd38d-39162a6e09ffdab7394e3243fa2342c1.ssl.cf2.rackcdn.com/test.json';

    document.getElementById('download-storage-location-text').style.borderColor = 'black';
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
            try {
                fs.writeFileSync(downloadsPathTemp[0] + '\\test_write_access.pr', 'PR:BF2 Download Assistant - Write access test file. You can remove this file!', 'utf-8');
                fs.unlinkSync(downloadsPathTemp[0] + '\\test_write_access.pr');
                downloadsPath = downloadsPathTemp[0];
                $('#download-storage-location-text').attr('value', downloadsPath);
                $('#errorText').text('');
                document.getElementById('download-storage-location-text').style.backgroundColor = '#e9ecef';
                document.getElementById('download-storage-location-text').style.color = '#495057';
                document.getElementById('download-storage-location-text').style.borderColor = 'black';
                document.getElementById('continue-button').disabled = false;
            }
            catch(e) {
                document.getElementById('continue-button').disabled = true;
                downloadsPath = undefined;
                document.getElementById('download-storage-location-text').style.backgroundColor = 'rgb(255,179,184)';
                document.getElementById('download-storage-location-text').style.color = 'rgb(107,29,37)';
                document.getElementById('download-storage-location-text').style.borderColor = 'red';
                $('#download-storage-location-text').attr('value', downloadsPathTemp[0]);
                $('#errorText').text('Please choose a different download folder. No write privileges to this folder.');
            }
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