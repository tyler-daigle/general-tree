import { readFile } from "fs/promises";
import { Tree, Leaf, ItemType } from "./tree";

async function loadInput(filename: string) {
  const input = await readFile(filename, { encoding: "utf-8" });
  return input;
}

function executeCD(command: string, currentDirName: string, fileSystem: Tree): Leaf | null {
  const [cmd, opt] = command.split(" ");

  // make sure not to create the root directory again - the constructor already does it.
  if (opt === "/") {
    return fileSystem.getRoot();
  }
  // when we change to a new directory we should actually just create it
  return fileSystem.createDirectory(currentDirName, opt);
}

(async function main() {
  const fileSystem = new Tree();
  fileSystem.createDirectory("/", "first");

  const input = (await loadInput("test-input.txt")).split("\n");
  let currentDirName = "/";

  input.forEach(line => {
    const command = line.split(" ");
    if (command[0] === "$") {
      switch (command[1]) {
        case "cd":
          console.log("Changing Directory");
          if (command[2] === "..") {
            currentDirName = fileSystem.getParentDirectory(currentDirName)?.data.name!;
          } else {
            executeCD(line.substring(1), currentDirName, fileSystem);
            currentDirName = command[2];
          }
          break;
        case "ls":
          // we can kind of ignore this?
          console.log("Listing files");
          break;
      }
    } else {
      if (command[0] === "dir") {
        console.log("Creating a new directory:", command[1]);
        fileSystem.createDirectory(currentDirName, command[1]);
      } else {
        // it's a file 
        console.log("Adding file:", command[1]);
        fileSystem.addFile(currentDirName, command[1], parseInt(command[0]));
      }
    }
  });

  // const files = fileSystem.getFiles("d");
  // files.forEach(file => console.log(`${file.name} : ${file.size}`));
  const p = fileSystem.getParentDirectory("d");
  console.log(p?.data.name);
})();
