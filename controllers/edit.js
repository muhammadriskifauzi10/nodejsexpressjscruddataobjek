const { json } = require("body-parser");
const fs = require("fs");

const loadData = () => {
  const data = fs.readFileSync("./model/data.json", "utf-8");
  return JSON.parse(data);
};

const findData = (id) => {
  const data = loadData();

  return data.find((value) => value.id == id);
};

const editData = (data) => {
  fs.writeFileSync("./model/data.json", JSON.stringify(data));
};

module.exports = { findData, editData };
