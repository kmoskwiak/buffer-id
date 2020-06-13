"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TreeNode_1 = require("./TreeNode");
class Children {
    constructor(indexRange) {
        this.children = [];
        this.indexRangeReached = false;
        this.indexRange = indexRange;
    }
    /**
     * Calls callback for each child
     * @param {Function} cb callback function
     */
    forEach(cb) {
        this.children.forEach(cb);
    }
    /**
     * Returns child with given index
     * @param {Number} index index of child
     * @returns {TreeNode} child with given index
     */
    find(index) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].getIndex() === index) {
                return this.children[i];
            }
        }
        return null;
    }
    /**
     * Removes identifier from tree
     * @param {Array} fullPath identifier to remove
     * @returns {TreeNode | false} removed child node or false if child does not exist
     */
    remove(fullPath) {
        let index = fullPath.shift();
        let child = this.find(index);
        if (!child) {
            return false;
        }
        child.setNotFull();
        if (fullPath.length) {
            return child.remove(fullPath);
        }
        this.children.splice(index, 1);
        return child;
    }
    /**
     * Return child which is not full
     * @returns {TreeNode | null} not full child
     */
    getNotFull() {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (!child.isFull()) {
                return child;
            }
        }
        return false;
    }
    /**
     * Checks if range og childres is reached
     * @returns {Boolean} true if range of children is reached
     */
    isIndexRangeReached() {
        this.indexRangeReached = this.children.length === this.indexRange;
        return this.indexRangeReached;
    }
    /**
     * Creates new child in set of children
     * @param {Object} options options passed to root node
     * @param {TreeNode} parent node of parent
     * @returns {TreeNode} added child
     */
    add(options, parent) {
        if (this.isIndexRangeReached()) {
            return false;
        }
        let index = this.getFreeIndex();
        let child = new TreeNode_1.default(options, parent, index);
        this.children.splice(index, 0, child);
        return child;
    }
    /**
     * Returns available index
     * @returns {Number} available index
     */
    getFreeIndex() {
        for (let i = 0; i < this.indexRange; i++) {
            if (!this.children[i] || this.children[i].getIndex() !== i) {
                return i;
            }
        }
    }
}
exports.default = Children;
