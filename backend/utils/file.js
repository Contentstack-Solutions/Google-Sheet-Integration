const fs = require("fs");
const mkdirp = require("mkdirp");
const { FILESYSTEM_BASE_PATH } = require("./config");

const writeFile = (fileName, json, locale) =>
  new Promise((resolve, reject) => {
    try {
      deleteFolder({ path: FILESYSTEM_BASE_PATH });
      const fullFilePath = `${FILESYSTEM_BASE_PATH}/${locale}`;
      if (!fs.existsSync(fullFilePath)) {
        mkdirp.sync(fullFilePath);
      }
      fs.writeFile(
        `${fullFilePath}/${fileName}.json`,
        JSON.stringify(json),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });

const deleteFolder = ({ path }) => {
  new Promise((resolve, reject) => {
    try {
      fs.rmSync(path, { recursive: true, force: true });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { writeFile, deleteFolder };
