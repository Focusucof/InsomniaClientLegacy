const { app, BrowserWindow } = require('electron')
const path = require('path')

//used to start localhost server
const loadApp = require('./app.js');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
  })

  win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})