const decisionTreeModel = require('../../model/treeModel');
_generateAllConditionFromFeatures = (features, allDataFromFeatures) => {
  allConditions = {};
  for (const feature of features) {
    allConditions[feature] = {};
    let attributeType = allDataFromFeatures[feature].attributeType;
    let uniqueValues = allDataFromFeatures[feature].allUniqueValues;
    if(attributeType === 'equality'){
      allConditions[feature]['equ'] = {};
      allConditions[feature]['equ'].check = (i, j) => i === j; 
      allConditions[feature]['equ'].data = [...uniqueValues];
    }
    else if(attributeType === 'gt-lt'){
      allConditions[feature]['gte'] = {};
      allConditions[feature]['lte'] = {};
      allConditions[feature]['gte'].check = (i, j) => i >= j;
      allConditions[feature]['gte'].data = [...uniqueValues];
      allConditions[feature]['gte'].check = (i, j) => i <= j;
      allConditions[feature]['lte'].data = [...uniqueValues];
    }
    else{
      console.warn("Unknown attribute type");
    }
  }
  return allConditions;
};

_excludeCondition = () => {

};

_getNumberOfEachClasses = (rows) => {
  let numberOfClass1, numberOfClass2;
  for (const row of rows) {
    
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
  return -(class1Fraction) * Math.log2(class1Fraction) - (class2Fraction) * Math.log2(class2Fraction);
};

_splitByTwo = () => {

}

_getBestSplit = (currentAllConditions, currentMinEntropy, decisionTree) => {

};

_getAllUniqueValues = (data) => {
  return data.filter((value, index, self) => self.indexOf(value) === index);
}

constructTree = (extractedFeatures, columnOfClass, minEntropyAllowed, numberOfIteration) => {
  let features = Object.keys(extractedFeatures);
  let classes = _getAllUniqueValues(columnOfClass);
  let class1= classes[0], class2 = classes[1], allRows = ((numberOfRows) => {
    let rows = [];
    for (let index = 0; index < numberOfRows; index++){
      rows.push(index);
    } 
    return rows;
  })(columnOfClass.length);
  console.log("class1: " + class1 + " class2: " + class2 + " Number Of rows: " + allRows.length);
  let numberOfEachClasses = _getNumberOfEachClasses(allRows, columnOfClass);
  let numberOfClass1 = numberOfEachClasses.numberOfClass1, numberOfClass2 = numberOfEachClasses.numberOfClass2;
  let rootEntropy = _calculateEntropy(numberOfClass1, numberOfClass2);
  decisionTree = new decisionTreeModel(rootEntropy, allRows);
  console.log("Features: " + features);
  for (const feature of features) {
    console.log("Total values for " + feature + " :" + extractedFeatures[feature].data.length);
    extractedFeatures[feature].allUniqueValues = _getAllUniqueValues(extractedFeatures[feature].data);
    console.log("Unique values: " + feature + " :" + extractedFeatures[feature].allUniqueValues.length);
  }
  let currentAllConditions = _generateAllConditionFromFeatures(features, extractedFeatures);
  let currentMinEntropy = 1.1, currentIteration = 0;
  while (currentMinEntropy < minEntropyAllowed || currentIteration > numberOfIteration) {
    let bestSplit = _getBestSplit(currentAllConditions, currentMinEntropy, decisionTree);
    currentIteration++;
  } 
}

module.exports = {
  constructTree: constructTree
};