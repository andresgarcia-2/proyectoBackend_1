const fs = require("fs");
const path = require("path");

class FileManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async read() {
        try {
            const data = await fs.promises.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async write(data) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }
}

module.exports = FileManager