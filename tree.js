"use strict";
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Directory"] = 0] = "Directory";
    ItemType[ItemType["File"] = 1] = "File";
})(ItemType || (ItemType = {}));
class Tree {
    constructor() {
        this.root = new Leaf({ name: "root", type: ItemType.Directory });
    }
    findDirectory(dirName) {
        const queue = [];
        if (this.root === null) {
            return null;
        }
        queue.push(this.root);
        while (queue.length > 0) {
            const currLeaf = queue.shift();
            if (currLeaf.data.type === ItemType.Directory && currLeaf.data.name === dirName) {
                return currLeaf;
            }
            if (currLeaf.countChildren() !== 0) {
                let done = false;
                while (!done) {
                    const child = currLeaf.nextChild();
                    if (child) {
                        queue.push(child);
                    }
                    else {
                        done = true;
                        currLeaf.reset();
                    }
                }
            }
        }
        return null;
    }
    getFiles(dirName) {
        const files = [];
        const dir = this.findDirectory(dirName);
        if (dir) {
            dir.reset();
            let item = dir.nextChild();
            while (item) {
                if (item.data.type === ItemType.File) {
                    files.push(item.data);
                }
                item = dir.nextChild();
            }
        }
        return files;
    }
    getRoot() {
        return this.root;
    }
    createDirectory(parentDir, dirName) {
        const dir = this.findDirectory(parentDir);
        if (dir) {
            return dir.addLeaf(new Leaf({ name: dirName, type: ItemType.Directory }));
        }
        return null;
    }
    addFile(dirName, filename, size) {
        const dir = this.findDirectory(dirName);
        if (dir) {
            return dir.addLeaf(new Leaf({ name: filename, type: ItemType.File, size: size }));
        }
        return null;
    }
}
class Leaf {
    constructor(item) {
        this.children = [];
        this.currChild = 0;
        this.data = item;
    }
    addLeaf(leaf) {
        this.children.push(leaf);
        return leaf;
    }
    nextChild() {
        if (this.currChild < this.children.length) {
            const leaf = this.children[this.currChild];
            this.currChild++;
            return leaf;
        }
        else {
            return null;
        }
    }
    reset() {
        this.currChild = 0;
    }
    countChildren() {
        return this.children.length;
    }
}
// create the tree
// add a new directory
// add some files to the directory
// list the files in the directory
const tree = new Tree();
tree.createDirectory("root", "documents");
tree.addFile("documents", "secret.txt", Math.floor(Math.random() * 10000));
tree.addFile("documents", "6502.txt", Math.floor(Math.random() * 10000));
tree.addFile("documents", "nes.txt", Math.floor(Math.random() * 10000));
tree.addFile("documents", "assembler.pdf", Math.floor(Math.random() * 10000));
const files = tree.getFiles("documents");
files.forEach(file => console.log(file));
// const files: Item[] = [
//   { name: "home", type: ItemType.Directory },
//   { name: "pictures", type: ItemType.Directory },
//   { name: "downloads", type: ItemType.Directory },
//   { name: "documents", type: ItemType.Directory },
// ];
// const tree = new Tree();
// const root = tree.getRoot();
// files.forEach(file => root?.addLeaf(new Leaf(file)));
// console.log("Number Children: ", tree.getRoot()?.countChildren());
// const found = tree.findDirectory("downloads");
// if (found) {
//   console.log(`Found Dir: ${found.data.name}`);
//   const dir = found.addLeaf(new Leaf({ name: "textfiles", type: ItemType.Directory }));
//   dir.addLeaf(new Leaf({ name: "secret.txt", type: ItemType.File, size: Math.floor(Math.random() * 10000) }));
//   dir.addLeaf(new Leaf({ name: "nes.txt", type: ItemType.File, size: Math.floor(Math.random() * 10000) }));
//   dir.addLeaf(new Leaf({ name: "6502-tutorial.txt", type: ItemType.File, size: Math.floor(Math.random() * 10000) }));
// } else {
//   console.log("nothing found");
// }
// const textfiles = tree.findDirectory("textfiles");
// if (textfiles) {
//   console.log("Found textfiles directory");
//   console.log(textfiles.countChildren(), "files found");
//   const files = tree.getFiles("textfiles");
//   files.forEach(file => {
//     console.log(file);
//   });
// } else {
//   console.log("Did not find the textfiles directory");
// }
