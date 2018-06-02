const {app, BrowserWindow} = require('electron')

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 600,
        autoHideMenuBar: true,
        darkTheme: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    })
    win.loadFile('./app/index.html')
}

app.on('ready', createWindow)

