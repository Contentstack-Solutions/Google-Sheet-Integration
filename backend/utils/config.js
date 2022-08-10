const get = require("lodash.get");
const unset = require("lodash.unset");

const FILESYSTEM_BASE_PATH = "/tmp/Contents";
//add your url of aws EFS

const fieldsToBeIgnoreWhileUpdatingEntry = [
  "locale",
  "created_by",
  "updated_by",
  "created_at",
  "updated_at",
  "ACL",
  "_version",
  "_in_progress",
  "_metadata",
  "_version",
  "tags",
  "file_size",
  "is_dir",
  "parent_uid",
  "filename",
];

const findPathsToKey = (options) => {
  let results = [];
  (function findKey({ key, obj, pathToKey }) {
    const oldPath = `${pathToKey ? pathToKey + "." : ""}`;
    if (obj && obj.hasOwnProperty(key)) {
      results.push(`${oldPath}${key}`);
      return;
    }

    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
      for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (Array.isArray(obj[k])) {
            for (let j = 0; j < obj[k].length; j++) {
              findKey({
                obj: obj[k][j],
                key,
                pathToKey: `${oldPath}${k}[${j}]`,
              });
            }
          }

          if (obj[k] !== null && typeof obj[k] === "object") {
            findKey({
              obj: obj[k],
              key,
              pathToKey: `${oldPath}${k}`,
            });
          }
        }
      }
    }
  })(options);
  return results;
};

function unflatten(table) {
  var result = {};

  for (var path in table) {
    var cursor = result,
      length = path.length,
      property = "",
      index = 0;

    while (index < length) {
      var char = path.charAt(index);

      if (char === "[") {
        var start = index + 1,
          end = path.indexOf("]", start),
          cursor = (cursor[property] = cursor[property] || []),
          property = path.slice(start, end),
          index = end + 1;
      } else {
        var cursor = (cursor[property] = cursor[property] || {}),
          start = char === "." ? index + 1 : index,
          bracket = path.indexOf("[", start),
          dot = path.indexOf(".", start);

        if (bracket < 0 && dot < 0) var end = (index = length);
        else if (bracket < 0) var end = (index = dot);
        else if (dot < 0) var end = (index = bracket);
        else var end = (index = bracket < dot ? bracket : dot);

        var property = path.slice(start, end);
      }
    }

    cursor[property] = table[path];
  }

  return result[""];
}

const AssetsUidChanger = (data) => {
  let path = findPathsToKey({ obj: data, key: "content_type" });
  if (path.length > 0) {
    path.forEach((i) => {
      let str = i.replace(".content_type", "");
      setAssetsUid({
        data: data,
        path: str,
        value: get(data, str).uid.toLowerCase(),
      });
    });
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

module.exports = {
  fieldsToBeIgnoreWhileUpdatingEntry,
  findPathsToKey,
  unflatten,
  flatten,
  removePath,
  FILESYSTEM_BASE_PATH,
};
