let rows = [],
    index = 0;

_getAllFeaturues = (features, rows) => {
    let allFeatures = {};
    let className = features[features.length - 1];
    console.log(className);
    for (let i = 0; i < rows.length; i++) {
        let currentClass = rows[i][className];
        for (let i = 1; i < features.length - 1; i++) {
            allFeatures[features[i]] = [];
        }
        console.log("Current class: ");
        console.log(currentClass);
    }
    return allFeatures;
};
_excludeFeature = () => {

};


_calculateEntropy = (numberOfClass1, numberOfClass2) => {
    let total = numberOfClass1 + numberOfClass2;
    let class1Fraction = numberOfClass1 / total,
        class2Fraction = numberOfClass2 / total;
    return -(class1Fraction) * Math.log2(class1Fraction) - (class2Fraction) * Math.log2(class2Fraction);
};

_getBestFeature = () => {

};

constructTree = () => {

}

module.exports = constructTree;

