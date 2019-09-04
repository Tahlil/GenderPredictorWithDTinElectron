const decisionTreeModel = require('../../model/treeModel');
let currentAllConditions, decisionTree, featureData;
_generateAllConditionFromFeatures = (features, allDataFromFeatures) => {
  allConditions = {};
  for (const feature of features) {
    allConditions[feature] = {};
    let attributeType = allDataFromFeatures[feature].attributeType;
    let uniqueValues = allDataFromFeatures[feature].allUniqueValues;
    if (attributeType === 'equality') {
      allConditions[feature]['equ'] = {};
      allConditions[feature]['equ'].check = (i, j) => i === j;
      allConditions[feature]['equ'].data = [...uniqueValues];
    } else if (attributeType === 'gt-lt') {
      allConditions[feature]['gte'] = {};
      allConditions[feature]['lte'] = {};
      allConditions[feature]['gte'].check = (i, j) => i >= j;
      allConditions[feature]['gte'].data = [...uniqueValues];
      allConditions[feature]['lte'].check = (i, j) => i <= j;
      allConditions[feature]['lte'].data = [...uniqueValues];
    } else {
      console.warn("Unknown attribute type");
    }
  }
  return allConditions;
};

_getCurrentNumberOfConditions = () => {
  let currentNumberOfConditions = 0;
  let features = Object.keys(currentAllConditions);
  console.log("Current number of features: " + features.length);
  for (const feature of features) {
    let current = currentAllConditions[feature];
    let types = Object.keys(current)
    for (const type of types) {
      if(current[type].data)
        currentNumberOfConditions += current[type].data.length;
    }
  }  
  return currentNumberOfConditions;
}

_excludeCondition = (feature, type, value) => {
  console.log("Before excluding Current number of features: " + _getCurrentNumberOfConditions()); 
  //console.log(Object.keys(currentAllConditions));
  //console.log("Current conditions: ");
  
  let currentFeatureOfCond = currentAllConditions[feature][type];
  //console.log(currentFeatureOfCond);
  
  if(type === "equ"){
    if(currentFeatureOfCond.data.length === 2){
      delete currentAllConditions[feature][type]
    }
    else{
      arr.splice(currentFeatureOfCond.data.indexOf(value), 1);  
    }
  }
  else{
    currentAllConditions[feature][type].data = currentFeatureOfCond.data.filter(
      i => type === 'lte' ? i >= value : i <= value
      )
  }
  console.log("After exluding Current number of features: " + _getCurrentNumberOfConditions());  
};

_getNumberOfEachClasses = (rows, columnOfClass, class1, class2) => {
  let numberOfClass1 = 0,
    numberOfClass2 = 0;
  for (const row of rows) {
    if (columnOfClass[row] === class1) {
      numberOfClass1++;
    } else if (columnOfClass[row] === class2) {
      numberOfClass2++;
    }
  }
  return {
    numberOfClass1: numberOfClass1,
    numberOfClass2: numberOfClass2
  };
}

_calculateEntropy = (numberOfClass1, numberOfClass2) => {
  let total = numberOfClass1 + numberOfClass2;
  let class1Fraction = numberOfClass1 / total,
    class2Fraction = numberOfClass2 / total;
  return (-1)*(class1Fraction)*Math.log2(class1Fraction) - (class2Fraction)*Math.log2(class2Fraction);
};

_splitByCondition = (feature, type, compareTo) => {
  let rowWithConditionMet = [],
    rowWithConditionNotMet = [],
    featureSpecificColumn = featureData[feature].data;

  //console.log("Number of rows: "+featureSpecificColumn.length);
  //console.log(currentAllConditions[feature][type]);
  for (let index = 0; index < featureSpecificColumn.length; index++) {
    const data = featureSpecificColumn[index];
    if (currentAllConditions[feature][type].check(data, compareTo)) {
      rowWithConditionMet.push(index);
    } else {
      rowWithConditionNotMet.push(index);
    }
  }
  return {
    positiveRows: rowWithConditionMet,
    negativeRows: rowWithConditionNotMet
  }
}

_getEntropyFromRows = (rows, columnOfClass, class1, class2) => {
  let numberOfClass1 = 0,
    numberOfClass2 = 0;
  for (const row of rows) {
    if (columnOfClass[row] === class1) {
      numberOfClass1++;
    } else if (columnOfClass[row] === class2) {
      numberOfClass2++;
    } else {
      log.error("Wrong class name provided or something: class1: " + class1 + " class2: " + class2 + " current data: " + columnOfClass[row]);
    }
  }
  return _calculateEntropy(numberOfClass1, numberOfClass2);
}

_getBestConditionWithEntropy = (columnOfClass, class1, class2) => {
  let features = Object.keys(currentAllConditions);
  let bestCondition, minEntropy = 1.1,
    posNode, negNode;
  for (const feature of features) {
    let conditionTypes = Object.keys(currentAllConditions[feature]);
    // console.log("featrue: " + feature + " condition types:");
    // console.log(conditionTypes);
    for (const type of conditionTypes) {
      let allPossibleValues = currentAllConditions[feature][type].data;
      for (const value of allPossibleValues) {
        let splitedData = _splitByCondition(feature, type, value);
        let positiveRows = splitedData.positiveRows,
          negativeRows = splitedData.negativeRows;
        let posRowsEntropy = _getEntropyFromRows(positiveRows, columnOfClass, class1, class2),
          negRowsEntropy = _getEntropyFromRows(negativeRows, columnOfClass, class1, class2);
        let numOfPosRows = positiveRows.length,
          numOfNegRows = negativeRows.length;
        let total = numOfNegRows + numOfPosRows;
        //console.log("Total: " + total);
        let netEntropy = ((numOfPosRows / total) * posRowsEntropy) + ((numOfNegRows / total) * negRowsEntropy);
        if (netEntropy < minEntropy) {
          minEntropy = netEntropy;
          bestCondition = {
            feature: feature,
            type: type,
            value: value
          };
          posNode = {
            rows: positiveRows,
            entropy: posRowsEntropy
          };
          negNode = {
            rows: negativeRows,
            entropy: negRowsEntropy
          };
        }
      }
    }
  }
  const bestResult = {
    bestCondition: bestCondition,
    posNode: posNode,
    negNode: negNode
  }
  console.log(" Best result: ");
  // console.log(minEntropy);
  // console.log(posNode.entropy);
  // console.log(negNode.entropy);
  console.log(bestResult.bestCondition);
  return bestResult;
}

_getBestSplit = (currentMinEntropy) => {

};

_getAllUniqueValues = (data) => {
  return data.filter((value, index, self) => self.indexOf(value) === index);
}

_splitRoot = (unsplittedTree, columnOfClass, class1, class2) => {
  let bestSplit = _getBestConditionWithEntropy(columnOfClass, class1, class2);
  _excludeCondition(bestSplit.bestCondition.feature, bestSplit.bestCondition.type, bestSplit.bestCondition.value);
  return unsplittedTree;
}

_initDecisionTree = (columnOfClass, class1, class2) => {
  let allRows = ((numberOfRows) => {
    let rows = [];
    for (let index = 0; index < numberOfRows; index++) {
      rows.push(index);
    }
    return rows;
  })(columnOfClass.length);
  let numberOfEachClasses = _getNumberOfEachClasses(allRows, columnOfClass, class1, class2);
  console.log(numberOfEachClasses);
  let numberOfClass1 = numberOfEachClasses.numberOfClass1,
    numberOfClass2 = numberOfEachClasses.numberOfClass2;
  let rootEntropy = _calculateEntropy(numberOfClass1, numberOfClass2);
  let unsplittedTree = new decisionTreeModel(rootEntropy, allRows);
  return _splitRoot(unsplittedTree, columnOfClass, class1, class2);
}

constructTree = (extractedFeatures, columnOfClass, minEntropyAllowed, numberOfIteration) => {
  let features = Object.keys(extractedFeatures);
  featureData = extractedFeatures;
  let classes = _getAllUniqueValues(columnOfClass);
  let class1 = classes[0],
    class2 = classes[1];
  console.log("Features: " + features);
  console.log("class1: " + class1 + " class2: " + class2 + " Number Of rows: " + columnOfClass.length);;
  for (const feature of features) {
    console.log("Total values for " + feature + " :" + featureData[feature].data.length);
    featureData[feature].allUniqueValues = _getAllUniqueValues(featureData[feature].data);
    console.log("Unique values: " + feature + " :" + featureData[feature].allUniqueValues.length);
  }
  currentAllConditions = _generateAllConditionFromFeatures(features, featureData);

  decisionTree = _initDecisionTree(columnOfClass, class1, class2)
  let currentMinEntropy = 1.1,
    currentIteration = 1;
  while (currentMinEntropy < minEntropyAllowed || currentIteration > numberOfIteration) {
    let bestSplit = _getBestSplit(currentAllConditions, currentMinEntropy, decisionTree);
    currentIteration++;
  }
}

module.exports = {
  constructTree: constructTree
};