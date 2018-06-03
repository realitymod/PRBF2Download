const {app, BrowserWindow} = require('electron');
var path = require('path');
var os = require('os');

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 350,
        autoHideMenuBar: true,
        frame: true,
        darkTheme: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    });

    win.on('ready-to-show', () => {
        win.focus();
        win.show();
        win.webContents.openDevTools({ mode: 'undocked' });
    });

    if (os.platform() == 'win32') {
        win.loadFile('./app/index.html')
    } else {
        win.loadFile('./app/wrongos.html')
    }
}

app.on('ready', createWindow);

