$(() => {
    const remote = require('electron').remote;
    const shell = require('electron').shell;

    const app = remote.app;

    $('#version-number').text('v' + app.getVersion());

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

    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
});