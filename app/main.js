const {app, BrowserWindow} = require('electron');
const {dialog} = require('electron')
var path = require('path');
var os = require('os');
const fs = require('fs');
function createWindow() {

    win = new BrowserWindow({
        width: 700,
        height: 330,
        autoHideMenuBar: true,
        frame: false,
        darkTheme: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    });

    function parseConfigFile() {
        const configPath = path.join(app.getPath('userData'),'config.json');
        // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
        // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
        try {
            return JSON.parse(fs.readFileSync(configPath)).downloadStoragePath;
        } catch(error) {
            return false;
        }
    }

    if (os.platform() == 'win32') {
        if(parseConfigFile()) {
            win.loadFile('./app/download.html')
        }else{
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



