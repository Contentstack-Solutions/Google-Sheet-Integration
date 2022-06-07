function sortByProp(array, name) {
  return array?.sort((a, b) => (a[name] > b[name]) ? 1 : -1);
}

function assign(obj, prop, value) {
  if (typeof prop === "string")
      prop = prop.split(".");

  if (prop.length > 1) {
      var e = prop.shift();
      assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === "[object Object]"
                ? obj[e]
                : {},
              prop,
              value);
  } else
      obj[prop[0]] = value;
}