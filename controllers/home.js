const fs = require("fs");

const loadData = () => {
  const data = fs.readFileSync("./model/data.json", "utf-8");
  return JSON.parse(data);
};

const createData = (data) => {
  fs.writeFileSync('./model/data.json', JSON.stringify(data))
}

module.exports = { loadData, createData };
