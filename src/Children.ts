import { BufferIdOptions } from "./interface";
import TreeNode from "./TreeNode";

class Children {
  children: TreeNode[];

  constructor(indexRange: BufferIdOptions["indexRange"]) {}

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
}

export default Children;
