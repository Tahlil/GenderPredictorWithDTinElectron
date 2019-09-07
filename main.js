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
    this.currentDecisionTree = null;
    this.allData = null;
    this.textData = [];
    this.trainData = [];
    this.features = [];
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

    test(){
      let totalTestData = this.testData.columnOfGenders.length, numberOfCorrectPrediction=0;
      let extractedFeatureOfTestData = featureExtractUtil.extractFeatures(this.features, this.testData.columnOfNames);
      let truePositive=0, trueNegative=0, falsePositive=0, falseNegative=0;
      //let numberOfPredictedFemale=0, numberOfPredictedMale=0;
      let resultTable = []; 
      console.log("Total test data: " + totalTestData);
      let current = totalTestData;
      while(current > 0){
        current--;
        let individualData = {};
        for (const feature of this.features) {
          individualData[feature] = extractedFeatureOfTestData[feature].data[current];
        }
        let actualGender =this.testData.columnOfGenders[current];
        let predictedGender = this.currentDecisionTree.predictClass(individualData, this.trainData.columnOfGenders);
        if (predictedGender === this.currentDecisionTree.class1) {
          predictedGender === actualGender ? truePositive++ : falsePositive++;
        }
        else if(predictedGender === this.currentDecisionTree.class2){
          predictedGender === actualGender ? trueNegative++ : falseNegative++;
        } 
        // if(predictedGender === actualGender){
        //   numberOfCorrectPrediction++;
        // }
        let name = this.testData.columnOfNames[current];
        resultTable[current] = {
          id: current,
          name: name,
          predicted: predictedGender,
          actual: actualGender,
          hasPredicted: predictedGender === actualGender
        }
      }
      numberOfCorrectPrediction = trueNegative+ truePositive;
      console.log("Number of correct prediction: " + numberOfCorrectPrediction);
      //console.log("Number of correct prediction: " + (trueNegative+ truePositive));
      let incorrectPrediction = totalTestData - numberOfCorrectPrediction;
      //console.log("Predicted Female: "+ numberOfPredictedFemale + " Predicted Male" + numberOfPredictedMale);
      let precision = (truePositive/(truePositive+falsePositive))*100;
      let recall = (truePositive/(truePositive+falseNegative))*100;
      let performance = (numberOfCorrectPrediction/totalTestData)*100;
      console.log("Precision: " + precision + " %");
      console.log("Recall: " + recall + " %");
      console.log("Correct percentage: " + performance + " %");
      return {
        resultTable: resultTable,
        totalTestData: totalTestData,
        numberOfCorrectPrediction: numberOfCorrectPrediction,
        incorrectPrediction: incorrectPrediction, 
        performance: performance.toFixed(2),
        truePositive: truePositive,
        trueNegative: trueNegative,
        falsePositive: falsePositive,
        falseNegative: falseNegative,
        precision: precision.toFixed(2),
        recall: recall.toFixed(2)
      }
    }

    setUpTestListener(){
      this.ipcMain.on('test-data', (event, _) => {
        console.log("Testing performance...");
        let testResult = this.test();
        event.sender.send('asynchronous-reply', {result: testResult, success:true});
      })
    }

    _getRandomIndex(currentNumberOfData){
      return Math.floor(Math.random() * (currentNumberOfData));
    }

    splitTrainingAndTestSet(testSplitRatio){
      this.trainData = this.allData;
      this.testData = {
        columnOfNames: [],
        columnOfGenders: []
      };
      let currentNumberOfData = this.trainData.columnOfNames.length;
      let numberOfTestData = Math.floor(currentNumberOfData*testSplitRatio/100);
      while(numberOfTestData !== 0){
        let index = this._getRandomIndex(currentNumberOfData);
        let name = this.trainData.columnOfNames[index], gender= this.trainData.columnOfGenders[index];
        this.testData.columnOfNames.push(name);
        this.testData.columnOfGenders.push(gender);
        this.trainData.columnOfNames.splice(index, 1);
        this.trainData.columnOfGenders.splice(index, 1);
        currentNumberOfData--;
        numberOfTestData--;
      }
    }

    setUpDTConListener(){
      ipcMain.on('construct-tree', (event, hyperParameters) => {
        this.allData = readData.getNameToGenderData();
        console.log("Number of Data: ");
        console.log(this.allData.columnOfGenders.length);
        console.log(this.allData.columnOfNames.length);
        //console.log(hyperParameters);
        this.splitTrainingAndTestSet(hyperParameters.testSplitRatio);
        console.log("Number of Train data: " + this.trainData.columnOfNames.length);
        console.log("Number of Test data: " + this.testData.columnOfNames.length);
        console.log("Total Number of data: " + (this.trainData.columnOfNames.length+this.testData.columnOfNames.length));

        let minEntropy = hyperParameters.minEntropy, numberOfIteration = hyperParameters.numberOfIteration, predictors = hyperParameters.predictors;
        this.features = predictors;
        let extractedFeatures = featureExtractUtil.extractFeatures(predictors, this.allData.columnOfNames);
        const decisionTree = conTreeUtil.constructTree(extractedFeatures, this.allData.columnOfGenders, minEntropy, numberOfIteration);
        this.currentDecisionTree = decisionTree;
        let totalTrainingData = this.trainData.columnOfNames.length;
        console.log("sending to UI...");
        let tree = decisionTree.getTree();
        event.sender.send('end-construct-tree', {tree: tree, totalTrainingData: totalTrainingData});
      }) 
    }

    setUpAllListener() {
      this.setUpDTConListener();
      this.setUpTestListener();
    }
}

module.exports = DesktopApp;