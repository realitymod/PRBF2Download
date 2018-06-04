$(() => {
    const remote = require('electron').remote;
    const shell = require('electron').shell;

    const app = remote.app;

    $('#version-number').text('v' + app.getVersion());

    function onMinimizeButtonPress() {
        const window = remote.getCurrentWindow();
        window.minimize();
    }

    function onWebsiteLinkPress() {
        shell.openExternal('https://www.realitymod.com')
    }

    function onCloseButtonPress() {
        const window = remote.getCurrentWindow();
        app.quit();
        window.close();

    }

    function onGithubLinkPress() {
        shell.openExternal('https://github.com/WouterJansen/PRBF2Download')
    }

    document.querySelector('#close-button').addEventListener('click', onCloseButtonPress);
    document.querySelector('#minimize-button').addEventListener('click', onMinimizeButtonPress);
    document.querySelector('#website-link').addEventListener('click', onWebsiteLinkPress);
    document.querySelector('#github-link').addEventListener('click', onGithubLinkPress);
});