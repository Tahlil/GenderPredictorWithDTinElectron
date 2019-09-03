const fs = require('fs');
const csvsync = require('csvsync');
const getNameToGenderData = () => {
  const csvFilePath = '../data/name_gender.csv';
  const data = csvsync.parse(fs.readFileSync(csvFilePath));
  const totalNumberOfData = data.length;
  let columnOfNames = [], columnOfGenders = [];
  for (let index = 1; index < totalNumberOfData; index++) {
    columnOfNames.push(data[index][0]);
    columnOfGenders.push(data[index][1]);
  }
  return {
    columnOfNames: columnOfNames,
    columnOfGenders: columnOfGenders
  };  
}
module.exports = {
  getNameToGenderData:getNameToGenderData
};