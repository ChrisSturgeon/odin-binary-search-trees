class Node {
  constructor(data) {
    this.data = data;
    this.right = null;
    this.left = null;
  }
}

class Tree {
  constructor(arr) {
    this.arr = this.prepArr(arr);
    this.root = this.buildTree(this.arr, 0, this.arr.length - 1);
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

  prettyPrint = function (node, prefix = '', isLeft = true) {
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
}

const myTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
myTree.prettyPrint(myTree.root);
