const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')

let win;
const readData = require('./Util/readData');
const featureExtractUtil = require('./Util/decisiontreeUtilty/extractFeatureUtility');

class DesktopApp {
  constructor() {
    this.app = app;
    this.ipcMain = ipcMain;
    this.setUpApp();
    this.setUpAllListener();
    this.allData = readData.getNameToGenderData();
  }
  
  createWindow () {
      win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
          nodeIntegration: true
        }
      })
      globalShortcut.register('f5', function() {
        console.log('f5 is pressed')
        win.reload()
      })
      globalShortcut.register('CommandOrControl+R', function() {
        console.log('CommandOrControl+R is pressed')
        win.reload()
      })
      win.loadFile('index.html')
    
      win.webContents.openDevTools()
    
      win.on('closed', () => {
        win = null
      })
    }
    
    setUpApp(){
      this.app.on('ready', this.createWindow)
    
      this.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          this.app.quit()
        }
      })
      
      this.app.on('activate', () => {
        if (win === null) {
          this.createWindow()
        }
      })
    }

    setUpTestListener(){
      this.ipcMain.on('test-data', (event, trainingData) => {
        event.sender.send('asynchronous-reply', {data: data});
      })
    }

    setUpDTConListener(){
      ipcMain.on('construct-tree', (event, hyperParameters) => {
        
        event.sender.send('end-construct-tree', endResult);
      }) 
    }

    setUpAllListener() {
      this.setUpDTConListener();
      this.setUpTestListener();
    }
}

module.exports = DesktopApp;