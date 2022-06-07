function getData(obj, path, defaultValue = undefined) {
  function travel(regexp) {
    return String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  }
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

function findPathsToKey(options) {
  let results = [];
  (function findKey({ key, obj, pathToKey }) {
    const oldPath = `${pathToKey ? pathToKey + "." : ""}`;
    if (obj.hasOwnProperty(key)) {
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
}

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
  let newPath = findPathsToKey({ obj: data, key: path });
  let str = path.split(".");
  if (str.length > 1) {
    let laststr = str.length - 1;
    let strPath = findPathsToKey({ obj: data, key: str[laststr] });
    strPath.forEach((string, i) => {
      let strPresent = string.split(".");
      let newstart = strPresent.filter((item) => str.includes(item));
      if (newstart.length === str.length) unset(data, strPath[i]);
    });
  }
  if (newPath.length > 0) {
    newPath.forEach((i) => {
      unset(data, i);
    });
    removePath({ data, path });
  }
};

function unset(obj, path) {
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  pathArray.reduce((acc, key, i) => {
    if (i === pathArray.length - 1) delete acc[key];
    return acc[key];
  }, obj);
  return obj;
}

function removeEmptyElements(obj) {
  if (Array.isArray(obj)) {
    obj.forEach((element, index) =>
      obj.splice(index, 1, removeEmptyElements(element))
    );
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) =>
        Array.isArray(v)
          ? v.length !== 0
          : v !== null && v !== "" && v !== undefined
      )
      .map(([k, v]) => [k, v === Object(v) ? removeEmptyElements(v) : v])
  );
}
