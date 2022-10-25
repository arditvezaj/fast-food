const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "..", "data", "foods.json");

function getStoredData() {
  const fileData = fs.readFileSync(filePath);
  const storedUsers = JSON.parse(fileData);

  return storedUsers;
}

function storeData(storableUsers) {
    fs.writeFileSync(filePath, JSON.stringify(storableUsers));
}

module.exports = {
    getStoredData: getStoredData,
    storeData: storeData
}