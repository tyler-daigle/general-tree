import { Tree, Leaf, ItemType } from "./tree";

// function executeCommand(command: "cd" | "ls", filesystem: Tree) {
//   if (command === "cd") {

//   }


// }

const fileSystem = new Tree();
fileSystem.createDirectory("/", "first");
const dir = fileSystem.createDirectory("first", "second");
console.log("Created: ", dir?.data.name);
const parent = fileSystem.getParentDirectory("second");
console.log(parent?.data.name);