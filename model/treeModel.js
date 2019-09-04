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
    this.expandableNodePaths = [];
  }

  printTree(){
    console.log(this.decisionTree);
  }

  _newNode(parent, rows, entropy){
    return {
      name: this.getNextNodeNumber, //root
      parent: parent,
      condition: null,
      rowNumbers: [...rows],
      entropy: entropy,
      children: []
    }
  }

  splitRoot(bestCondition, rightNode, leftNode){
    this.expandableNodePaths = ["0", "1"];
    this.decisionTree[0].condition = bestCondition;
    this.decisionTree[0].children[0] = this._newNode(0, leftNode.rows, leftNode.entropy);
    this.decisionTree[0].children[1] = this._newNode(0, rightNode.rows, rightNode.entropy)
  }

  getNextNodeNumber(){
    this.currentNodeNumber++;
    return newNodeNumber;   
  }

  getExpandableWithHighestEntropy(){
    let maxEntropy = -1.1, expandableWithMaxEntropy;
    for (const path of this.expandableNodePaths) {
      let node = _findNode(path);
      let currentNodeEntropy = node.entropy;
      if(currentNodeEntropy>maxEntropy){
        maxEntropy = currentNodeEntropy
        expandableWithMaxEntropy = node;  
      }
    }
    console.log("Max entropy: " + maxEntropy);
    return expandableWithMaxEntropy;
  }

  _findNode(path){
    let rootChildren = this.decisionTree[0].children, node;
    let currentChildren = rootChildren;
    for (const childNumLetter of path) {
      let childNumber = parseInt(childNumLetter);
      node= currentChildren[childNumber];
      currentChildren = node.children;
    }
    return node;
  }
}

module.exports = TreeModel;