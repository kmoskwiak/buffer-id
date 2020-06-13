"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TreeNode_1 = require("./TreeNode");
class BufferId {
    constructor(options) {
        if (!options.idLength) {
            throw new Error("idLength is required");
        }
        this.options = Object.assign({
            indexRange: 256,
            idFormat: "array",
        }, options);
        return new TreeNode_1.default(this.options, null);
    }
}
exports.default = BufferId;
