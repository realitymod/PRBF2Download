const {app, BrowserWindow} = require('electron')
var path = require('path')
app.setAppUserModelId("com.xxx.xxxx");
function createWindow () {
    // Create the browser window.

    win = new BrowserWindow({width: 700, height: 600,autoHideMenuBar:true,darkTheme:true, resizable: false,icon: path.join(__dirname, 'assets/icons/png/64x64.png')})

    // and load the index.html of the app.
    win.loadFile('./app/index.html')



}

app.on('ready', createWindow)

