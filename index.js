const fs = require("fs");
const DB_FILE_PATH = "./db";

console.log("[CRUD]");

function create(content) {
  fs.writeFileSync(DB_FILE_PATH, content);
  return content;
}

//[Simulation]
console.log(create("Hoje eu precisso gravar aulas!"));
