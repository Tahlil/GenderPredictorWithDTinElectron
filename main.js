const { globalShortcut, app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')

let win;
const readData = require('./Util/readData');
const featureExtractUtil = require('./Util/decisiontreeUtilty/extractFeatureUtility');
const calcPerformanceUtil = require('./Util/decisiontreeUtilty/testUtility');
const conTreeUtil = require('./Util/decisiontreeUtilty/constructTreeUtility');


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
        let allData = readData.getNameToGenderData();
        console.log(hyperParameters);
        let minEntropy = hyperParameters.minEntropy, numberOfIteration = hyperParameters.numberOfIteration, predictors = hyperParameters.predictors;
        let extractedFeatures = featureExtractUtil.extractFeatures(predictors, allData.columnOfNames);
        const decisionTree = conTreeUtil.constructTree(extractedFeatures, minEntropy, numberOfIteration);
        event.sender.send('end-construct-tree', decisionTree);
      }) 
    }

    setUpAllListener() {
      this.setUpDTConListener();
      this.setUpTestListener();
    }
}

module.exports = DesktopApp;