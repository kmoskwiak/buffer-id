"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BufferId {
    constructor(options) {
        if (!options.idLength) {
            throw new Error("idLength is required");
        }
        this.options = Object.assign({
            indexRange: 256,
            idFormat: "array",
        }, options);
    }
}
exports.default = BufferId;
