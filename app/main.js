const {app, BrowserWindow} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

function createWindow() {

    let win = new BrowserWindow({
        width: 700,
        height: 330,
        autoHideMenuBar: true,
        frame: false,
        darkTheme: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    });

    function parseConfigFile() {
        const configPath = path.join(app.getPath('userData'), 'config.json');
        try {
            return JSON.parse(fs.readFileSync(configPath)).downloadStoragePath;
        } catch (error) {
            return false;
        }
    }

    if (os.platform() === 'win32') {
        if (parseConfigFile()) {
            win.loadFile('./app/download.html')
        } else {
            win.loadFile('./app/folder_select.html')
        }

    } else {
        win.loadFile('./app/wrong_os.html')
    }

    win.on('ready-to-show', () => {
        win.focus();
        win.show();
    });


}

app.setAppUserModelId("PRBF2-Download-Assistant");
app.on('ready', createWindow);



