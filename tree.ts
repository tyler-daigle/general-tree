import { assert } from "console";

export enum ItemType {
  Directory,
  File
}

export interface Item {
  name: string;
  type: ItemType;
  size?: number;
}

export class Tree {
  private root: Leaf;

  constructor() {
    this.root = new Leaf({ name: "/", type: ItemType.Directory });
  }

  findDirectory(dirName: string, parentDir?: Leaf): Leaf | null {
    const queue = [];
    if (this.root === null) {
      return null;
    }

    if (parentDir) {
      queue.push(parentDir);
    } else {
      queue.push(this.root);
    }

    while (queue.length > 0) {
      const currLeaf: Leaf = queue.shift()!;
      if (currLeaf.data.type === ItemType.Directory && currLeaf.data.name === dirName) {
        return currLeaf;
      }
      if (currLeaf.countChildren() !== 0) {
        let done = false;
        while (!done) {
          const child = currLeaf.nextChild();
          if (child) {
            queue.push(child);
          } else {
            done = true;
            currLeaf.reset();
          }
        }
      }
    }
    return null;
  }

  getParentDirectory(dirName: string): Leaf | null {
    let currParent = this.root;
    assert(currParent !== null);
    if (currParent === null) {
      return null;
    }

    const queue: Leaf[] = [];
    queue.push(currParent);


    while (queue.length > 0) {
      // get the children of the currParent and check for dirName
      const children = currParent.getAllChildren();
      for (const child of children) {
        if (child.data.type === ItemType.Directory && child.data.name === dirName) {
          return currParent;
        } else if (child.data.type === ItemType.Directory) {
          queue.push(child);
        }
      };
      currParent = queue.shift()!;
    }

    return null;
  }

  getFiles(dirName: string): Item[] {
    const files: Item[] = [];
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

  getRoot(): Leaf | null {
    return this.root;
  }

  createDirectory(parentDir: string, dirName: string): Leaf | null {
    const dir = this.findDirectory(parentDir);
    if (dir) {
      return dir.addLeaf(new Leaf({ name: dirName, type: ItemType.Directory }));
    }
    return null;
  }

  addFile(dirName: string, filename: string, size: number): Leaf | null {
    const dir = this.findDirectory(dirName);
    if (dir) {
      return dir.addLeaf(new Leaf({ name: filename, type: ItemType.File, size: size }));
    }
    return null;
  }
}

export class Leaf {
  public data: Item;
  private children: Leaf[] = [];
  private currChild: number = 0;

  constructor(item: Item) {
    this.data = item;
  }

  addLeaf(leaf: Leaf): Leaf {
    this.children.push(leaf);
    return leaf;
  }

  nextChild(): Leaf | null {
    if (this.currChild < this.children.length) {
      const leaf = this.children[this.currChild];
      this.currChild++;
      return leaf;
    } else {
      return null;
    }
  }

  getAllChildren(): Leaf[] {
    return [...this.children];
  }

  reset() {
    this.currChild = 0;
  }

  countChildren(): number {
    return this.children.length;
  }
}


// create the tree
// add a new directory
// add some files to the directory
// list the files in the directory

// const tree = new Tree();
// tree.createDirectory("root", "documents");
// tree.addFile("documents", "secret.txt", Math.floor(Math.random() * 10000));
// tree.addFile("documents", "6502.txt", Math.floor(Math.random() * 10000));
// tree.addFile("documents", "nes.txt", Math.floor(Math.random() * 10000));
// tree.addFile("documents", "assembler.pdf", Math.floor(Math.random() * 10000));

// const files = tree.getFiles("documents");
// files.forEach(file => console.log(file));

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