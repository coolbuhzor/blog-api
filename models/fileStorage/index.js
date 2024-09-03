import fs from "node:fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export class FileStorage {
  object = {};
  fileName = path.join(__dirname, "../../", "blogAppDb.json");

  starter() {
    fs.stat(this.fileName, (err, stat) => {
      if (err == null) {
        console.log("File exists");
        fs.readFile(this.fileName, "utf-8", (error, data) => {
          if (error) {
            console.log({ error });
            return;
          }
          this.object = data ? JSON.parse(data) : null;
          console.log({ data: this.object }, "fs starter");
        });
      } else if (err.code === "ENOENT") {
        // file does not exist
        fs.writeFile(
          this.fileName,
          JSON.stringify({ user: [], blogs: [] }),
          "utf-8",
          (error) => {
            if (error) {
              return console.log({ error }, "erroorrr");
            }
            console.log("file created");
          }
        );
        return this.fileName;
      } else {
        console.log("Some other error: ", err.code);
        return null;
      }
    });
  }

  all() {
    return this.object;
  }

  save(value) {
    fs.writeFile(this.fileName, JSON.stringify(this.object), (err) => {
      if (err) throw new Error(err.message);
      return value;
    });
  }

  update(name, id, value) {
    const obj = this.object;
    if (!obj[name]) {
      throw new Error("Invalid data object");
    }

    const index = obj[name].findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      return null;
    }

    obj[name][index] = { ...obj[name][index], ...value };
    this.object = obj;

    const updatedItem = obj[name][index];
    this.save(updatedItem);
    return updatedItem;
  }

  new(name, value) {
    // this.object refers to the object from stater
    const obj = this.object;
    // name refers to the name of the object we hope to manipulate in this case(blog)
    // value refers to the content of our post request
    if (obj[name]) {
      obj[name].push(value);
    } else {
      throw new Error("invalid data object");
    }
    this.object = obj;
    const res = this.save(value);
    return res;
  }
  delete(name, id) {
    const obj = this.object;
    if (!obj[name]) {
      throw new Error("Invalid data object");
    }

    const index = obj[name].findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      return null;
    }

    const deletedItem = obj[name].splice(index, 1)[0];
    this.object = obj;

    this.save(deletedItem);
    return deletedItem;
  }
}
