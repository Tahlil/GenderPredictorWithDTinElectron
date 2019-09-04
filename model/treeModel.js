class TreeModel{
  decisionTree;
  constructor(rootEntropy, allRows) {
    this.decisionTree = [{
      name: 0, //root
      parent: null,
      condition: null,
      rowNumbers: [...allRows],
      entropy: rootEntropy,
      children: []
    }];
    this.currentNodeNumber = 0;
    this.expandable = ["0"]; 
  }

  getNextNodeNumber(){
    this.currentNodeNumber++;
    return newNodeNumber;   
  }
  
}

module.exports = TreeModel;