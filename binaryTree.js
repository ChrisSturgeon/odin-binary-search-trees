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

  // Runs callback in level order for a given function
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
}

const myTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
myTree.prettyPrint();

myTree.insert(8);
myTree.prettyPrint();
