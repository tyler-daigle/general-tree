"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = require("./tree");
// function executeCommand(command: "cd" | "ls", filesystem: Tree) {
//   if (command === "cd") {
//   }
// }
const fileSystem = new tree_1.Tree();
fileSystem.createDirectory("/", "first");
const dir = fileSystem.createDirectory("first", "second");
console.log("Created: ", dir === null || dir === void 0 ? void 0 : dir.data.name);
const parent = fileSystem.getParentDirectory("second");
console.log(parent === null || parent === void 0 ? void 0 : parent.data.name);
//# sourceMappingURL=day7.js.map