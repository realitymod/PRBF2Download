const {app, BrowserWindow} = require('electron');
var path = require('path');
var os = require('os');

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 450,
        autoHideMenuBar: true,
        frame: false,
        darkTheme: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    });
    if (os.platform() == 'win32') {
        win.loadFile('./app/index.html')
    } else {
        win.loadFile('./app/wrongos.html')
    }

    win.on('ready-to-show', () => {
        win.focus();
        win.show();
    });


}
app.setAppUserModelId("PRBF2-Download-Assistant");
app.on('ready', createWindow);

