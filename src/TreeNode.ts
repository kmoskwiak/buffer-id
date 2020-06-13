import { BufferIdOptions } from "./interface";
import Children from "./Children";

class TreeNode {
  options: BufferIdOptions;
  children: Children;
  idLength: BufferIdOptions["idLength"];
  path: number[] = [];
  last: boolean = false;
  full: boolean = false;

  constructor(
    options: BufferIdOptions,
    parent: TreeNode | null,
    index?: number
  ) {
    this.options = options;
    this.children = new Children(options.indexRange);
    this.idLength = options.idLength;

    if (parent) {
      this.path = parent.getPath().concat(index);
    }

    if (this.path.length === this.idLength) {
      this.last = true;
      this.full = true;
    }
  }

  /**
   * Removes identifier from tree
   * @param {Array | Buffer} fullPath identifier - can be buffer or array
   */
  remove(fullPath: number[] | Buffer) {
    let _path;
    if (fullPath instanceof Buffer) {
      _path = fullPath.toJSON().data;
    } else {
      _path = fullPath;
    }

    return this.children.remove(_path);
  }

  /**
   * Returns node path
   * @returns {Array} node path
   */
  getPath() {
    let _path = this.path.slice();
    Object.defineProperty(_path, "asBuffer", {
      get: function () {
        return Buffer.from(this);
      },
    });
    return this.path;
  }

  /**
   * Sets node to not full
   */
  setNotFull() {
    this.full = false;
  }

  /**
   * Returns node index
   * @returns {Number} node index
   */
  getIndex() {
    return this.getPath()[this.getPath().length - 1];
  }
}

export default TreeNode;
