import TreeNode from "./TreeNode";
import { BufferIdOptions } from "./interface";

class BufferId {
  options: BufferIdOptions;

  constructor(options: BufferIdOptions) {
    if (!options.idLength) {
      throw new Error("idLength is required");
    }

    this.options = {
      ...{
        indexRange: 256,
        idFormat: "array",
      },
      ...options,
    };

    return new TreeNode(this.options, null);
  }
}

export default BufferId;
