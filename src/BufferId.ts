import TreeNode from "./TreeNode";
import { BufferIdOptions } from "./interface";
import BufferIdError, { ID_LENGHT_REQUIRED } from "./Errors";

class BufferId {
  options: BufferIdOptions;

  constructor(options: BufferIdOptions) {
    if (!options.idLength) {
      throw new BufferIdError(ID_LENGHT_REQUIRED, "idLength is required");
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
