const set = require("lodash.set");
const fs = require("fs");
const path = require("path");
const unset = require("lodash.unset");
const get = require("lodash.get");
const { updateEntry, importEntry } = require("../services/api");
const has = require("lodash.has");
const flattenDeep = require("lodash.flattendeep");
const {
  findPathsToKey,
  fieldsToBeIgnoreWhileUpdatingEntry,
  unflatten,
} = require("./config");
const { flatten } = require("./cleanEntries");
const { getCsvEntries } = require("./jsonToCsv");
const { FILESYSTEM_BASE_PATH } = require("./config");
const { JSDOM } = require("jsdom");
const { htmlToJson } = require("@contentstack/json-rte-serializer");

function applyDirtyAttributesToBlock(block) {
  if (block.hasOwnProperty("text")) {
    return block;
  }
  let children = flattenDeep(
    [...(block.children || [])].map(applyDirtyAttributesToBlock)
  );
  if (block.hasOwnProperty("type")) {
    set(block, "attrs.dirty", true);
  }
  block.children = children;
  return block;
}

const setAssetsUid = ({ data, path, value }) => {
  return set(data, path, value !== "" ? value : null);
};

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

const creatJsonObject = (entry) => {
  try {
    let path = findPathsToKey({ obj: entry, key: "children" });
    if (path && path.length > 0) {
      path.forEach((item) => {
        const dom = new JSDOM(`${get(entry, item)}`);
        let htmlDoc = dom.window.document.querySelector("body");
        const jsonValue = htmlToJson(htmlDoc);
        set(entry, item.replace(".children", ""), jsonValue);
      });
    } else {
      return;
    }
  } catch (err) {
    console.log(
      "🚀 ~ file: updateEntry.js ~ line 69 ~ creatJsonObject ~ err",
      err
    );
  }
};

const AssetsUidChanger = (data) => {
  let path = findPathsToKey({ obj: data, key: "content_type" });
  if (path.length > 0) {
    path.forEach((i) => {
      let str = i.replace(".content_type", "");
      setAssetsUid({
        data: data,
        path: str,
        value: get(data, str)?.uid?.toLowerCase()
          ? get(data, str).uid.toLowerCase()
          : null,
      });
    });
  }
};

const createEntry = async (
  entry,
  content_type,
  authtoken,
  api_key,
  locale,
  url
) => {
  try {
    let response = [];
    for (let i = 0; i < entry.length; i++) {
      fieldsToBeIgnoreWhileUpdatingEntry.forEach((item) => {
        if (entry[i]?.uid) {
          removePath({ data: entry[i], path: item });
        } else {
          if (item !== "attrs") {
            removePath({ data: entry[i], path: item });
          }
        }
      });
      AssetsUidChanger(entry[i]);
      if (entry[i]?.uid) {
        let res = await updateEntry({
          entry: {
            entry: entry[i],
          },
          contentTypeUid: content_type,
          entry_uid: entry[i].uid,
          authtoken: authtoken,
          locale: locale,
          url: url,
          api_key: api_key,
        });
        response.push(res.data);
      } else {
        let res = await importEntry({
          entry: {
            entry: entry[i],
          },
          contentTypeUid: content_type,
          authtoken: authtoken,
          locale: locale,
          url: url,
          api_key: api_key,
        });
        response.push(res.data);
      }
    }
    return Promise.all(response).then((data) => data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

async function initializeEntry(json, headers) {
  const result = [];

  try {
    filePath = path.join(
      `${FILESYSTEM_BASE_PATH}/${headers.locale}/${headers.contentTypeUid}.json`
    );
    const entries = JSON.parse(
      fs.readFileSync(filePath, { encoding: "utf-8" })
    );
    json.forEach((item) => {
      let prevEntry = entries.entries.find((entry) => item.uid === entry.uid);
      if (prevEntry && Object.keys(prevEntry).length > 0) {
        if (item?.Updated === true) {
          delete item.Updated;
          let length = 0;
          length = prevEntry?.modular_blocks?.length;
          Object.entries(item).forEach(([key, value]) => {
            try {
              if (item[key] === "") {
                if (!has(prevEntry, key)) delete item[key];
              }
              if (has(prevEntry, key)) {
                set(prevEntry, key, value);
              } else {
                if (value !== "") {
                  if (key.includes("modular_blocks")) {
                  } else {
                    set(prevEntry, key, value);
                  }
                }
              }
            } catch (err) {
              console.log(err);
            }
          });
          let entry = unflatten(item)?.modular_blocks;
          let newEntry = unflatten(item);
          let path = findPathsToKey({ obj: newEntry, key: "children" });
          if (path && path.length > 0) {
            path.forEach((item) => {
              const dom = new JSDOM(`${get(newEntry, item)}`);
              let htmlDoc = dom.window.document.querySelector("body");
              const attrs = {
                allowNonStandardTypes: true,
              };
              let jsonValue = htmlToJson(htmlDoc, attrs);
              applyDirtyAttributesToBlock(jsonValue);
              set(prevEntry, item.replace(".children", ""), jsonValue);
            });
          }
          if (entry && entry.length > 0) {
            prevEntry.modular_blocks = compaireArray(
              prevEntry?.modular_blocks,
              entry
            );
          }
          result.push(prevEntry);
        }
      } else {
        Object.keys(item).forEach((key) => {
          if (item[key] === "" || item["uid"]) {
            if (key !== "title") delete item[key];
          }
        });
        let newEntry = unflatten(item);
        creatJsonObject(newEntry);
        if (newEntry && newEntry?.modular_blocks?.length > 0) {
          newEntry.modular_blocks = compaireArray([], newEntry.modular_blocks);
        }
        result.push(newEntry);
      }
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      json.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (item[key] === "" || item["uid"]) {
            if (key !== "title") delete item[key];
          }
        });
        let newEntry = unflatten(item);
        creatJsonObject(newEntry);
        AssetsUidChanger(newEntry);
        if (newEntry && newEntry?.modular_blocks?.length > 0) {
          newEntry.modular_blocks = compaireArray([], newEntry.modular_blocks);
        }
        result.push(newEntry);
      });
    } else {
      throw err;
    }
  }

  if (result.length > 0) {
    try {
      let res = await createEntry(
        result,
        headers.contentTypeUid,
        headers.authtoken,
        headers.api_key,
        headers.locale,
        headers.url
      );
      let filePath = path.join(
        `${FILESYSTEM_BASE_PATH}/${headers.locale}/${headers.contentTypeUid}.json`
      );
      fs.rmSync(filePath, {
        force: true,
      });
      const flattenData = res.map((data) => {
        return flatten(data);
      });

      return await getCsvEntries(flattenData);
    } catch (err) {
      throw err;
    }
  } else {
    return {
      message: "there is noting to update",
      flag: true,
    };
  }
}

const compaireArray = (modular, entry) => {
  if (modular?.length) {
    const length = modular.length;
    modular.forEach((item, index) => {
      let newfield = entry[index] && Object.keys(entry[index]);
      if (newfield.length === 1) {
        if (Object.keys(item)[0] === newfield[0]) {
          modular[index] = entry[index];
          delete entry[index];
        } else {
          console.log(entry[index], "idhr");
        }
      } else {
        newfield.forEach((key) => {
          if (key === Object.keys(item)[0]) {
            modular[index][key] = entry[index][key];
            delete entry[index][key];
          } else {
            modular.push(...entry);
          }
        });
      }
    });
    return modular.filter((element) => element !== undefined);
  } else {
    const result = [];
    entry.forEach((item, index) => {
      let newKeysLength = Object.keys(item);
      if (newKeysLength.length === 1) {
        result.push(item);
      } else {
        newKeysLength.forEach((key) => {
          let object = {};
          object[key] = item[key];
          result.push(object);
        });
      }
    });
    return result;
  }
};

module.exports = { initializeEntry, AssetsUidChanger };
