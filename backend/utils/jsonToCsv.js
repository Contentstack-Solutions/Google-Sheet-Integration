const { Parser } = require("json2csv");

async function getCsvEntries(entries) {
  try {
    const json2csvParser = new Parser();
    const csv = await json2csvParser.parse(entries);
    return csv;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getCsvEntries,
};
