class Root {
    constructor(options) {
        return new TreeNode(options.pathLength, null, 0);
    }
}

class TreeNode {
    constructor(maxBranchLength, parent, index) {
        this.children = new Children();
        this.maxBranchLength = maxBranchLength;
        if(parent) {
            this.path = parent.getPath().concat(index);
        } else {
            this.path = [];
        }
        
        if(this.path.length === maxBranchLength) {
            this.last = true;
            this.full = true;
        } else {
            this.last = false;
            this.full = false;
        }
    }

    remove(fullPath) {
        return this.children.remove(fullPath);
    }

    setNotFull() {
        this.full = false;
    }

    isFull() {
        this.checkFull();
        return this.full;
    }

    checkFull() {        
        if(this.last) { 
            this.full = true; 
            return;
        }

        if(!this.children.isSizeReached()) {
            this.full = false;
            return;
        }

        let full = true;
        this.children.forEach((child) => {
            full = full && child.isFull();
        });
        this.full = full && this.children.isSizeReached();
    }

    create() {
        if(this.getPath().length === this.maxBranchLength) {
            return this.getPath();
        }

        let child = this.children.getNotFull();

        if(!child) {
            child = this.children.add(this.maxBranchLength, this);
        }

        return child.create();
    }

    getPath() {
        return this.path;
    }

    getIndex() {
        return this.getPath()[this.getPath().length - 1];
    }
}

class Children {
    constructor() {
        this.size = 10;
        this.children = [];
        this.sizeReached = false;
    }

    forEach(cb) {
        this.children.forEach(cb);
    }

    find(index) {
        for(let i = 0; i < this.children.length; i++) {
            if(this.children[i].getIndex() === index) {
                return this.children[i];
            }
        }
    }

    remove(fullPath) {
        let index = fullPath.shift();
        let child = this.find(index);
        child.setNotFull();

        if(fullPath.length) {
            return child.remove(fullPath);
        }

        this.children.splice(index, 1);

        return child;
    }

    getNotFull() {
        for(let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if(!child.isFull()) {
                return child;
            }
        }

        return null;
    }

    isSizeReached() {
        this.sizeReached = this.children.length === this.size;
        return this.sizeReached;
    }

    add(maxBranchLength, parent) {
        if(this.isSizeReached()) { return false; }
        let index = this.getFreeIndex();
        let child = new TreeNode(maxBranchLength, parent, index);
        this.children.splice(index, 0, child);
        return child;
    }

    getFreeIndex() {
        for(let i = 0;  i < this.size; i++) {
            if(!this.children[i] || this.children[i].getIndex() !== i) {
                return i;
            }
        }
    }
}

module.exports = Root;