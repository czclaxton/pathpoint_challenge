const fs = require("fs");
const readline = require("readline");

Array.prototype.getLastDuplicate = function (obj) {
  for (let i = 0; i < this.length; i++) {
    if (this[i].score === obj.score) return { obj, i };
  }
  return null;
};

(async function parseFileLines() {
  try {
    let output = [];
    const inputFile = process.argv[3] || "data.txt";

    if (process.argv[3] === undefined) process.argv[3] = "data.txt";

    console.log(`Input File: ${inputFile}`);

    const rl = readline.createInterface({
      input: fs.createReadStream(inputFile),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const isolatedJSON = line.substring(
        line.indexOf("{") - 1,
        line.lastIndexOf("}") + 1
      );

      if (!isolatedJSON) {
        console.log("THIS IS NOT JSON");
        process.exit(9);
      }

      const formattedObj = {
        score: parseInt(line.match(/\d+/g)[0]),
        id: JSON.parse(isolatedJSON).id,
      };

      const checkForDupes = output.getLastDuplicate(formattedObj);

      if (checkForDupes === null) {
        output.push(formattedObj);
      } else {
        output[checkForDupes.i] = checkForDupes.obj;
      }
    });

    rl.on("close", () => {
      output.sort((a, b) => {
        return b.score - a.score;
      });
      console.log("FINAL OUTPUT: ", output.slice(0, process.argv[2]));
    });
  } catch (err) {
    console.error(err);
  }
})();
