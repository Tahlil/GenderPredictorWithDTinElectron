class TreeModel{
  decisionTree;
  constructor(rootEntropy, allRows) {
    this.decisionTree = {
      "name": 0, //root
      parent: null,
      "condition": null,
      path: "",
      rowNumbers: [...allRows],
      entropy: rootEntropy,
      "children": []
    };
    this.currentNodeNumber = 0;
    this.expandableNodePaths = [];
}

  getTree(){
    return this.decisionTree;
  }

  _recursivelyPrintNodeAndChildren(node){    
    this._printBasicInfoOfANode(node);
    if(node.children.length !== 0 ){      
      this._recursivelyPrintNodeAndChildren(node.children[0]);
      this._recursivelyPrintNodeAndChildren(node.children[1]);
    }
  }

  _printBasicInfoOfANode(node){
    console.log("Node Level: " + node.path.length +" name: " + node.name  +" Entropy: " + node.entropy + " Total data: " + node.rowNumbers.length+ " Condition: ");
    console.log(node.condition);
  }

  printTree(){
    this._recursivelyPrintNodeAndChildren(this.decisionTree);
  }

  _getLeafCondition(condition, path){
    let conditionTrue = path[path.length-1] == "1" ? true : false;
    if(condition.type === "equ"){
      return conditionTrue ? "Has " + condition.feature : "No " + condition.feature;
    }
    else if(condition.type === "gte"){
      return conditionTrue ? condition.feature + ">=" + condition.value : condition.feature + "<" + condition.value;

    }
    else if(condition.type === "lte"){
      return conditionTrue ? condition.feature + "<=" + condition.value : condition.feature + ">" + condition.value;
    }
    else{
      log.error("Unknown attribute type.");
    }
  }

  _newNode(parent, path, rows, entropy, bestCondition){
    let condition= this._getLeafCondition(bestCondition, path);
    let nextNodeNumber = this.getNextNodeNumber();
    return {
      name: nextNodeNumber, 
      parent: parent,
      condition: condition,
      path: path,
      rowNumbers: [...rows],
      entropy: entropy,
      children: []
    }
  }

  splitRoot(bestCondition, rightNode, leftNode){
    this.expandableNodePaths = ["0", "1"];
    this.decisionTree.condition = bestCondition;
    this.decisionTree.rowNumbers = [];
    this.decisionTree.children[0] = this._newNode(0, "0", leftNode.rows, leftNode.entropy,bestCondition);
    this.decisionTree.children[1] = this._newNode(0, "1", rightNode.rows, rightNode.entropy,bestCondition)
  }

  expandNode(node, bestCondition, rightNode, leftNode){
    node.rowNumbers = [];
    node.condition = bestCondition;
    this.expandableNodePaths.splice(this.expandableNodePaths.indexOf(node.path), 1);  
    let newExpandables = [node.path+"0", node.path+"1"]
    this.expandableNodePaths = [...this.expandableNodePaths, ...newExpandables]; 
    node.children[0] = this._newNode(node.name, newExpandables[0], leftNode.rows, leftNode.entropy,bestCondition);
    node.children[1] = this._newNode(node.name, newExpandables[1], rightNode.rows, rightNode.entropy,bestCondition)
  }

  getNextNodeNumber(){
    this.currentNodeNumber++;
    return this.currentNodeNumber;   
  }

  hasExpandable(){
    return this.expandableNodePaths.length > 0;
  }

  removeExpandable(expandablePath){
    this.expandableNodePaths.splice(this.expandableNodePaths.indexOf(expandablePath), 1);   
  }

  getExpandableWithHighestEntropy(){
    let maxEntropy = -1.1, expandableNodeWithMaxEntropy;
    for (const path of this.expandableNodePaths) {
      let node = this._findNode(path);
      let currentNodeEntropy = node.entropy;
      if(currentNodeEntropy>maxEntropy){
        maxEntropy = currentNodeEntropy
        expandableNodeWithMaxEntropy = node;  
      }
    }
    //console.log("Max entropy: " + maxEntropy);
    return expandableNodeWithMaxEntropy;
  }

  _findNode(path){
    let rootChildren = this.decisionTree.children, node;
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