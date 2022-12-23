"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const tree_1 = require("./tree");
function loadInput(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield (0, promises_1.readFile)(filename, { encoding: "utf-8" });
        return input;
    });
}
function executeCD(command, currentDirName, fileSystem) {
    const [cmd, opt] = command.split(" ");
    // make sure not to create the root directory again - the constructor already does it.
    if (opt === "/") {
        return fileSystem.getRoot();
    }
    // when we change to a new directory we should actually just create it
    return fileSystem.createDirectory(currentDirName, opt);
}
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileSystem = new tree_1.Tree();
        fileSystem.createDirectory("/", "first");
        const input = (yield loadInput("test-input.txt")).split("\n");
        let currentDirName = "/";
        input.forEach(line => {
            var _a;
            const command = line.split(" ");
            if (command[0] === "$") {
                switch (command[1]) {
                    case "cd":
                        console.log("Changing Directory");
                        if (command[2] === "..") {
                            currentDirName = (_a = fileSystem.getParentDirectory(currentDirName)) === null || _a === void 0 ? void 0 : _a.data.name;
                        }
                        else {
                            executeCD(line.substring(1), currentDirName, fileSystem);
                            currentDirName = command[2];
                        }
                        break;
                    case "ls":
                        // we can kind of ignore this?
                        console.log("Listing files");
                        break;
                }
            }
            else {
                if (command[0] === "dir") {
                    console.log("Creating a new directory:", command[1]);
                    fileSystem.createDirectory(currentDirName, command[1]);
                }
                else {
                    // it's a file 
                    console.log("Adding file:", command[1]);
                    fileSystem.addFile(currentDirName, command[1], parseInt(command[0]));
                }
            }
        });
        // const files = fileSystem.getFiles("d");
        // files.forEach(file => console.log(`${file.name} : ${file.size}`));
        const p = fileSystem.getParentDirectory("d");
        console.log(p === null || p === void 0 ? void 0 : p.data.name);
    });
})();
//# sourceMappingURL=day7.js.map