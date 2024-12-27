class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}


class Tree {
    constructor(array) {
        // Remvoe duplicate values from array and then sort
        this.sortedArray = array
            .filter((item, index, self) => self.indexOf(item) === index)
            .sort((a, b) => a - b);
        this.root = this.#buildTree(this.sortedArray);
    }

    #buildTree(array) {
        let start = 0;
        let end = array.length - 1;
        if (start > end) return null;

        let mid = Math.floor((start + end) / 2);
        let root = new Node(array[mid]);

        root.left = this.#buildTree(array.slice(start, mid));
        root.right = this.#buildTree(array.slice(mid + 1, end + 1));
        return root;
    }

    insert(value) {
        let root = this.root;
        if (root === null) { // If tree is empty
            this.root = new Node(value);
            console.log(`Inserted ${value} at root.`);
            return this.root;
        }

        while (true) {
            if (root.data === value) {
                console.log(`${value} already exists.`);
                return;
            }
            if (value < root.data) { // insert to the left
                if (!root.left) {
                    root.left = new Node(value);
                    console.log(`Inserted ${value} to the left of ${root.data}.`);
                    return root.left;
                } else {
                    root = root.left;
                }
            } else { // Insert to the right
                if (!root.right) {
                    root.right = new Node(value);
                    console.log(`Inserted ${value} to the right of ${root.data}.`);
                    return root.right;
                } else {
                    root = root.right;
                }
            }
        }
    }

    deleteItem(value) {
        // gets the next biggest node, useful when removing a node with 2 chldren
        function getSuccessor(node) {
            let successorNode = node.right;
            while (successorNode && successorNode.left) {
                successorNode = successorNode.left;
            }
            return successorNode;
        }

        function removeNode(root, value) {
            if (root === null) return root;

            if (value < root.data) root.left = removeNode(root.left, value);
            else if (value > root.data) root.right = removeNode(root.right, value);
            else {
                // If root has only right child or no child
                if (root.left === null) return root.right;
                // root only has left child
                if (root.right === null) return root.left;

                // root has both child
                let successor = getSuccessor(root);
                root.data = successor.data;
                root.right = removeNode(root.right, successor.data);
            }
            return root;
        }
        this.root = removeNode(this.root, value);
    }

    find(value) {
        if (!this.root) return false;
        let current = this.root;
        while (current) {
            if (value === current.data) return true;
            else if (value < current.data) current = current.left;
            else current = current.right;
        }
        return false;
    }

    levelOrder(callback) {
        if (!callback) throw new Error('callback funciton not provided.');
        if (!this.root) {
            console.log("Tree is empty.");
            return;
        }
        let visitOrder = [this.root];
        while (visitOrder.length !== 0) {
            let node = visitOrder.shift();
            callback(node);
            if (node.left) visitOrder.push(node.left);
            if (node.right) visitOrder.push(node.right);
        }
    }

    inOrder(callback) {
        if (!callback) throw new Error('callback funciton not provided.');
        function inorderTraversal(root) {
            if (!root) return;
            inorderTraversal(root.left);
            callback(root);
            inorderTraversal(root.right);
        }
        inorderTraversal(this.root);
    }

    preOrder(callback) {
        if (!callback) throw new Error('callback funciton not provided.');
        function preorderTraversal(root) {
            if (!root) return;
            callback(root);
            preorderTraversal(root.left);
            preorderTraversal(root.right);
        }
        preorderTraversal(this.root);
    }

    postOrder(callback) {
        if (!callback) throw new Error('callback funciton not provided.');
        function postorderTraversal(root) {
            if (!root) return;
            postorderTraversal(root.left);
            postorderTraversal(root.right);
            callback(root);
        }
        postorderTraversal(this.root);
    }

    height(node) {
        if (!node) return -1;
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
        return 1 + Math.max(leftHeight, rightHeight);
    }

    depth(node) {
        if (!node || !this.root) return -1; // Return -1 if the tree is empty or node is null
    
        let current = this.root;
        let depth = 0;
    
        while (current) {
            if (node === current) return depth; // Node found, return the depth
            if (node.data < current.data) {
                current = current.left; // Move to the left
            } else {
                current = current.right; // Move to the right
            }
            depth++; // Increment the depth at each step
        }
    
        return -1; // Node not found, return -1
    }

    isBalanced() {
        function checkBalanced(root) {
            if (!root) return 0; // Base case: null node has height 0
            
            // Recursively get the height of the left and right subtrees
            let leftHeight = checkBalanced(root.left);
            let rightHeight = checkBalanced(root.right);
            
            // If either left or right subtree is unbalanced (height is -1), return -1
            if (leftHeight === -1 || rightHeight === -1) return -1;
    
            // If the current node is unbalanced (difference in height > 1), return -1
            if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    
            // Return the height of the current node (max of left and right heights + 1)
            return Math.max(leftHeight, rightHeight) + 1;
        }
    
        // Start the recursive check from the root node
        return checkBalanced(this.root) !== -1; // If the result is -1, the tree is unbalanced
    }

    rebalance() {
        let array = [];
        const addItems = (node) => {
            array.push(node.data);
        };
        this.inOrder(addItems);
        console.log(array);
        this.root = this.#buildTree(array);
    }

}



// Function to print the tree 
const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};


let tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
console.log(`is balanced ${tree.isBalanced()}`);
let insert1 = tree.insert(8694);
let insert2 = tree.insert(6);
tree.insert(4);
prettyPrint(tree.root);
tree.deleteItem(6);
tree.deleteItem(8);
console.log(`Is 4 in tree: ${tree.find(4)}`);
console.log(`Is 8 in tree: ${tree.find(8)}`);
console.log(`Height of root: ${tree.height(tree.root)}`);
console.log(`Depth root: ${tree.depth(tree.root)}`);
console.log(`Depth of 8694: ${tree.depth(insert1)}`);
console.log(`Depth of 6: ${tree.depth(insert2)}`);
console.log(`Depth of '0': ${tree.depth(new Node(0))}`);
prettyPrint(tree.root);
// tree.levelOrder(callback);
// tree.inOrder(callback);
//tree.preOrder(callback);
//tree.postOrder(callback);
console.log(`is balanced ${tree.isBalanced()}`);
tree.rebalance();
prettyPrint(tree.root);
console.log(`is balanced ${tree.isBalanced()}`);
function callback(element) {
    console.log(element.data);
}
