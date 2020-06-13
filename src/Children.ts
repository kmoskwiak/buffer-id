import { BufferIdOptions } from "./interface";
import TreeNode from "./TreeNode";

class Children {
  children: TreeNode[] = [];
  indexRange: BufferIdOptions["indexRange"];
  indexRangeReached: boolean = false;

  constructor(indexRange: BufferIdOptions["indexRange"]) {
    this.indexRange = indexRange;
  }

  /**
   * Calls callback for each child
   * @param {Function} cb callback function
   */
  forEach(cb: (value: TreeNode, index: number) => any) {
    this.children.forEach(cb);
  }

  /**
   * Returns child with given index
   * @param {Number} index index of child
   * @returns {TreeNode} child with given index
   */
  find(index: number) {
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
  remove(fullPath: number[]): TreeNode | false {
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
  getNotFull(): false | TreeNode {
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
  add(options: BufferIdOptions, parent: TreeNode) {
    if (this.isIndexRangeReached()) {
      return false;
    }
    let index = this.getFreeIndex();
    let child = new TreeNode(options, parent, index);
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

export default Children;
