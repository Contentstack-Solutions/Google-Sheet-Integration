const {
  findPathsToKey,
  fieldsToBeIgnoreWhileUpdatingEntry,
} = require("./config");
const unset = require("lodash.unset");
const get = require("lodash.get");
const { jsonToHtml } = require("@contentstack/json-rte-serializer");
const set = require("lodash.set");

const removePath = ({ data, path }) => {
  let str = path.split(".");
  if (str.length > 1) {
    let laststr = str.length - 1;
    if (str[laststr] !== undefined) {
      let strPath = findPathsToKey({ obj: data, key: str[laststr] });
      if (strPath.length) {
        strPath.forEach((string, i) => {
          unset(data, string);
        });
      }
    }
  } else {
    let newPath = findPathsToKey({ obj: data, key: path });
    if (newPath.length > 0) {
      newPath.forEach((i) => {
        unset(data, i);
      });
      removePath({ data, path });
    }
  }
};

function flatten(data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

async function cleanEntries(entries, language, contentTypeUid, paths) {
  try {
    const flatEntries = entries.map((entry) => {
      const children = fieldsToBeIgnoreWhileUpdatingEntry.concat(paths);
      children.push("attrs");
      children.forEach((item) => {
        removePath({ data: entry, path: item });
      });

      let rtePath = findPathsToKey({ obj: entry, key: "children" });
      if (rtePath && rtePath.length > 0) {
        const htmlValue = jsonToHtml(
          get(entry, rtePath[0].replace(".children", ""))
        );
        rtePath.forEach((item) => {
          removePath({ data: entry, path: item });
        });
        set(entry, rtePath[0], htmlValue);
      }

      entry = flatten(entry);
      if (paths && paths.length > 1) {
        Object.entries(entry).forEach(([key, value]) => {
          if (typeof value == "object") {
            delete entry[key];
          }
        });
      }

      delete entry?.stackHeaders;
      delete entry?.update;
      delete entry?.delete;
      delete entry?.fetch;
      delete entry?.publish;
      delete entry?.unpublish;
      delete entry?.import;
      delete entry?.publishRequest;

      if (entry?.title && entry?.uid) {
        entry.Updated = false;
      }
      return entry;
    });

    return flatEntries;
  } catch (err) {
    console.log(
      "🚀 ~ file: cleanEntries.js ~ line 120 ~ cleanEntries ~ err",
      err
    );
  }
}

module.exports = { cleanEntries, flatten };
