class BufferId {
    /**
     * Creates first node of tree
     * @param {Object}  options
     * @param {Number}  options.idLength
     * @param {Number}  options.indexRange
     * @param {String}  options.idFormat 
     */
    constructor(_options) {
        let options = {
            idLength: _options.idLength,
            indexRange: _options.indexRange || 256,
            idFormat: _options.idFormat || 'array'
        };

        return new TreeNode(options, null);
    }
}

class TreeNode {
    /**
     * Creates node in tree
     * @param {Object} options length of buffer
     * @param {TreeNode | null} parent parent node or null if node is root  
     * @param {Number} index index of node 
     */
    constructor(options, parent, index) {
        this.options = options;
        this.children = new Children(options.indexRange);
        this.idLength = options.idLength;

        if(parent) {
            this.path = parent.getPath().concat(index);
        } else {
            this.path = [];
        }
        
        if(this.path.length === this.idLength) {
            this.last = true;
            this.full = true;
        } else {
            this.last = false;
            this.full = false;
        }
    }

    /**
     * Removes identifier from tree
     * @param {Array | Buffer} fullPath identifier - can be buffer or array
     */
    remove(fullPath) {
        let _path = fullPath;
        if(fullPath instanceof Buffer) {
            _path = fullPath.toJSON().data;
        }

        return this.children.remove(fullPath);
    }

    /**
     * Sets node to not full
     */
    setNotFull() {
        this.full = false;
    }

    /**
     * Check if node is full
     * @returns {Boolean} true if node is full
     */
    isFull() {
        this.checkFull();
        return this.full;
    }

    /**
     * Check if node is full
     */
    checkFull() {        
        if(this.last) { 
            this.full = true; 
            return;
        }

        if(!this.children.isIndexRangeReached()) {
            this.full = false;
            return;
        }

        let full = true;
        this.children.forEach((child) => {
            full = full && child.isFull();
        });
        this.full = full && this.children.isIndexRangeReached();
    }

    /**
     * Creates new identifier as array. Buffer id is accessible under asBuffer property
     * @returns {Array} identifier as array 
     */
    create() {
        if(this.getPath().length === this.idLength) {
            if(this.options.idFormat === 'buffer') {
                return Buffer.from(this.getPath());
            }
            return this.getPath();
        }

        let child = this.children.getNotFull();

        if(!child) {
            child = this.children.add(this.options, this);
        }

        return child.create();
    }

    /**
     * Returns node path
     * @returns {Array} node path
     */
    getPath() {
        let _path = this.path.slice();
        Object.defineProperty(_path, 'asBuffer', { get: function() {
            return Buffer.from(this);
        }});
        return this.path;
    }

    /**
     * Returns node index
     * @returns {Number} node index
     */
    getIndex() {
        return this.getPath()[this.getPath().length - 1];
    }
}

class Children {
    /**
     * Creates array-like children object
     * @param {Number} indexRange range of indexes
     */
    constructor(indexRange) {
        this.indexRange = indexRange;
        this.children = [];
        this.indexRangeReached = false;
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
        for(let i = 0; i < this.children.length; i++) {
            if(this.children[i].getIndex() === index) {
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

        if(!child) { return false; }
        
        child.setNotFull();
        if(fullPath.length) {
            return child.remove(fullPath);
        }
        this.children.splice(index, 1);
        return child;
    }

    /**
     * Return child which is not full
     * @returns {TreeNode} not full child
     */
    getNotFull() {
        for(let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if(!child.isFull()) {
                return child;
            }
        }

        return null;
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
        if(this.isIndexRangeReached()) { return false; }
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
        for(let i = 0;  i < this.indexRange; i++) {
            if(!this.children[i] || this.children[i].getIndex() !== i) {
                return i;
            }
        }
    }
}

module.exports = BufferId;