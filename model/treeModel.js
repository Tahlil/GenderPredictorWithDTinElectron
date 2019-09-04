class TreeModel{
  decisionTree;
  constructor(rootEntropy, allRows) {
    this.decisionTree = [{
      name: 0, //root
      parent: null,
      condition: null,
      path: "",
      rowNumbers: [...allRows],
      entropy: rootEntropy,
      children: []
    }];
    this.currentNodeNumber = 0;
    this.expandableNodePaths = [];
  }

  _recursivelyPrintNodeAndChildren(node){    
    this._printBasicInfoOfANode(node);
    if(node.children.length !== 0 ){      
      this._recursivelyPrintNodeAndChildren(node.children[0]);
      this._recursivelyPrintNodeAndChildren(node.children[1]);
    }
  }

  _printBasicInfoOfANode(node){
    console.log("Node Level: " + node.path.length +" name: " + node.name  +" Entropy: " + node.entropy + " Total data: " + node.rowNumbers.length);    
  }

  printTree(){
    this._recursivelyPrintNodeAndChildren(this.decisionTree[0]);
  }

  _newNode(parent, path, rows, entropy){
    let nextNodeNumber = this.getNextNodeNumber();
    return {
      name: nextNodeNumber, 
      parent: parent,
      condition: null,
      path: path,
      rowNumbers: [...rows],
      entropy: entropy,
      children: []
    }
  }

  splitRoot(bestCondition, rightNode, leftNode){
    this.expandableNodePaths = ["0", "1"];
    this.decisionTree[0].condition = bestCondition;
    this.decisionTree[0].rowNumbers = [];
    this.decisionTree[0].children[0] = this._newNode(0, "0", leftNode.rows, leftNode.entropy);
    this.decisionTree[0].children[1] = this._newNode(0, "1", rightNode.rows, rightNode.entropy)
  }

  expandNode(node, bestCondition, rightNode, leftNode){

  }

  getNextNodeNumber(){
    this.currentNodeNumber++;
    return this.currentNodeNumber;   
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