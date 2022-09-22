class Node {
  constructor(data) {
    this.data = data;
    this.right = null;
    this.left = null;
  }
}

class Tree {
  constructor(arr) {
    this.arr = arr ? this.prepArr(arr) : null;
    this.root = arr ? this.buildTree(this.arr, 0, this.arr.length - 1) : null;
  }

  // Merges two arrays for Merge Sorting
  merge = function (arr1, arr2) {
    let sorted = [];

    while (arr1.length && arr2.length) {
      if (arr1[0] < arr2[0]) {
        sorted.push(arr1.shift());
      } else {
        sorted.push(arr2.shift());
      }
    }
    return sorted.concat(arr1.slice().concat(arr2.slice()));
  };

  // Sorts given array into ascending order
  mergeSort = function (arr) {
    if (arr.length === 1) {
      return arr;
    }
    let midPoint = Math.floor(arr.length / 2);
    let left = this.mergeSort(arr.slice(0, midPoint));
    let right = this.mergeSort(arr.slice(midPoint));

    return this.merge(left, right);
  };

  // Removes duplicates from array and sorts remainder into ascending order ready for tree-building
  prepArr = function (array) {
    return this.mergeSort([...new Set(array)]);
  };

  // Builds node tree
  buildTree = function () {
    function sortArrToBST(arr, start, end) {
      if (start > end) {
        return null;
      }

      let midPoint = Math.floor((start + end) / 2);
      let node = new Node(arr[midPoint]);
      node.left = sortArrToBST(arr, start, midPoint - 1);
      node.right = sortArrToBST(arr, midPoint + 1, end);
      return node;
    }

    const tree = sortArrToBST(this.arr, 0, this.arr.length - 1);
    return tree;
  };

  // Console logs node-tree
  prettyPrint = function (node = this.root, prefix = '', isLeft = true) {
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };

  // Returns node of given value or null if not present in tree
  find = function (value, root = this.root) {
    if (root === null) {
      return null;
    }

    if (root.data === value) {
      return root;
    }

    if (root.data > value) {
      return this.find(value, root.left);
    }

    if (root.data < value) {
      return this.find(value, root.right);
    }
  };

  insert = function (value) {
    // Return if value is already present in ree
    if (this.find(value)) {
      return;
    }
    const newNode = new Node(value);

    // If tree is empty set root to be new node
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  };

  // Recursion method placing new node when root node's appropriate child is null
  insertNode = function (root, newNode) {
    if (newNode.data < root.data) {
      if (root.left === null) {
        root.left = newNode;
      } else {
        this.insertNode(root.left, newNode);
      }
    } else {
      if (root.right === null) {
        root.right = newNode;
      } else {
        this.insertNode(root.right, newNode);
      }
    }
  };

  // Deletes node for given value
  delete = function (value) {
    this.root = this.deleteNode(this.root, value);
  };

  deleteNode(root, value) {
    if (root === null) {
      return root;
    }

    if (value < root.data) {
      root.left = this.deleteNode(root.left, value);
    } else if (value > root.data) {
      root.right = this.deleteNode(root.right, value);
    } else {
      if (!root.left && !root.right) {
        return null;
      }

      if (!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }
      root.data = this.min(root.right);
      root.right = this.deleteNode(root.right, root.value);
    }
    return root;
  }

  min = function (root) {
    if (!root.left) {
      return root.data;
    } else {
      return this.min(root.left);
    }
  };

  max = function (root) {
    if (!root.right) {
      return root.data;
    } else {
      return this.max(root.right);
    }
  };

  // Runs callback in level order (left to right) for a given function or returns data arr if no function
  levelOrder = function (callback) {
    if (this.root === null) return [];

    const queue = [this.root];
    const result = [];

    while (queue.length > 0) {
      let len = queue.length;
      result.push(queue.map((node) => node.data));

      while (len--) {
        let node = queue.shift();
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        if (callback) {
          callback(node.data);
        }
      }
    }
    return result;
  };

  // Executes given function in pre-order or returns data arr in pre-order
  preOrder = function (func, root = this.root, results = []) {
    if (root === null) {
      return;
    }
    func ? func(root.data) : results.push(root.data);
    this.preOrder(func, root.left, results);
    this.preOrder(func, root.right, results);

    if (results.length > 0) return results;
  };

  // Exectures given functionin in-order or returns data arr in in-order
  inOrder = function (func, root = this.root, results = []) {
    if (root === null) {
      return;
    }

    this.inOrder(func, root.left, results);
    func ? func(root.data) : results.push(root.data);
    this.inOrder(func, root.right, results);

    if (results.length > 0) return results;
  };

  // Exectures given functionin post-order or returns data arr in post-order
  postOrder = function (func, root = this.root, results = []) {
    if (root === null) {
      return;
    }

    this.postOrder(func, root.left, results);
    this.postOrder(func, root.right, results);
    func ? func(root.data) : results.push(root.data);

    if (results.length > 0) return results;
  };

  // Returns a node's height where height is defined as the number of edges in the longest
  // path from a given node to a leaf node

  height = function (root = this.root) {
    if (root === null) {
      return -1;
    }

    let leftHeight = this.height(root.left);
    let rightHeight = this.height(root.right);
    return Math.max(leftHeight, rightHeight) + 1;
  };

  depth = function (root = this.root) {
    if (root === null) {
      return 0;
    }

    let leftDepth = this.depth(root.left);
    let rightDepth = this.depth(root.right);

    return Math.max(leftDepth, rightDepth) + 1;
  };

  isBalanced = function (root = this.root) {
    if (root === null) {
      return true;
    }

    let leftHeight = this.height(root.left);
    let rightHeight = this.height(root.right);

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }

    this.isBalanced(root.left);
    this.isBalanced(root.right);

    return true;
  };

  // Creates new array from pre-order collection and builds new tree
  rebalance = function () {
    const arr = this.preOrder();
    this.arr = this.prepArr(arr);
    this.root = this.buildTree(this.arr);
  };
}

const myTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
myTree.prettyPrint();
myTree.insert(22);
myTree.prettyPrint();
myTree.insert(24);
myTree.prettyPrint();

myTree.insert(25);
myTree.prettyPrint();
myTree.insert(26);
myTree.prettyPrint();

// console.log(myTree.inOrder());
// console.log(myTree.postOrder());
// console.log(myTree.height());
console.log(myTree.isBalanced());

myTree.rebalance();
myTree.prettyPrint();
console.log(myTree.isBalanced());
