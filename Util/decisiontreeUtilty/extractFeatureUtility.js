let vowels = ['a', 'e', 'i', 'o', 'u'];

//attribute types
// equality => check only equality, gt-lt => check greater than and less than 
let _featuresToBeExtracted = {
  numberOfVowels: {
    attributeType: 'gt-lt',
    extract: (names) => {
      let numberOfVowelsList = [],
        numberOfNames = names.length;
      for (let index = 0; index < numberOfNames; index++) {
        let name = names[index],
          numberOfVowels = 0;
        for (const letter of name) {
          if (vowels.includes(letter))
            numberOfVowels++;
        }
        numberOfVowelsList[index] = numberOfVowels;
      }
      return numberOfVowelsList;
    }
  },
  lastVowel: {
    attributeType: 'equality',
    extract: (names) => {
      let lastVowelsList = [],
        numberOfNames = names.length;
      for (let index = 0; index < numberOfNames; index++) {
        let name = names[index];
        lastVowelsList[index] = vowels.includes(name[name.length - 1]);
      }
      return lastVowelsList;
    }
  },
  firstVowel: {
    attributeType: 'equality',
    extract: (names) => {
      let firstVowelsList = [],
        numberOfNames = names.length;
      for (let index = 0; index < numberOfNames; index++) {
        let name = names[index];
        firstVowelsList[index] = vowels.includes(name[0]);
      }
      return firstVowelsList;
    }
  },
  length: {
    attributeType: 'gt-lt',
    extract: (names) => {
      let nameLengthsList = [],
        numberOfNames = names.length;
      for (let index = 0; index < numberOfNames; index++) {
        let name = names[index];
        nameLengthsList[index] = name.length;
      }
      return nameLengthsList;
    }
  }
};

extractFeatures = (features, names) => {
  const extractedFeatures = {};
  let allFeatures = Object.keys(_featuresToBeExtracted);
  for (const feature of features) {
    if (allFeatures.includes(feature)) {
      extractedFeatures[feature] = {};
      extractedFeatures[feature].attributeType = _featuresToBeExtracted[feature].attributeType;
      extractedFeatures[feature].data = _featuresToBeExtracted[feature].extract(names);
    } else {
      console.warn("Warning! A false feature was requested!!!");
    }
  }
  //console.log(extractedFeatures);
  return extractedFeatures;
}

module.exports = {
  extractFeatures: extractFeatures
}