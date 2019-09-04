_generateAllConditionFromFeatures = (features, allDataFromFeatures) => {
  allConditions = {};
  for (const feature of features) {
    allConditions[feature] = {};
    let attributeType = allDataFromFeatures[feature].attributeType;
    let uniqueValues = allDataFromFeatures[feature].allUniqueValues;
    if(attributeType === 'equality'){
      allConditions[feature]['equ'].check = (i, j) => i === j; 
      allConditions[feature]['equ'].data = [...uniqueValues];
    }
    else if(attributeType === 'gt-lt'){
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

_excludeFeature = () => {

};

_splitDataByCondition = () => {

};


_calculateEntropy = (numberOfClass1, numberOfClass2) => {
  let total = numberOfClass1 + numberOfClass2;
  let class1Fraction = numberOfClass1 / total,
    class2Fraction = numberOfClass2 / total;
  return -(class1Fraction) * Math.log2(class1Fraction) - (class2Fraction) * Math.log2(class2Fraction);
};

_getBestFeature = () => {

};

_getAllUniqueValues = (data) => {
  return data.filter((value, index, self) => self.indexOf(value) === index);
}

constructTree = (extractedFeatures, minEntropyAllowed, numberOfIteration) => {
  let features = Object.keys(extractedFeatures);
  console.log("Features: " + features);
  for (const feature of features) {
    console.log("Total values for " + feature + " :" + extractedFeatures[feature].data.length);
    extractedFeatures[feature].allUniqueValues = _getAllUniqueValues(extractedFeatures[feature].data);
    console.log("Unique values: " + feature + " :" + extractedFeatures[feature].allUniqueValues.length);
  }
  let allConditions = _generateAllConditionFromFeatures(features, extractedFeatures);
  let currentMinEntropy = 1.1, currentIteration = 0;
  while (currentMinEntropy < minEntropyAllowed || currentIteration > numberOfIteration) {
    
    currentIteration++;
  } 

}

module.exports = {
  constructTree: constructTree
};