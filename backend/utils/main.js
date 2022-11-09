const { getEntry, getContentType } = require("../services/api");
const { cleanEntries } = require("./cleanEntries");
const { getCsvEntries } = require("./jsonToCsv");
const { writeFile, deleteFolder } = require("./file");
const { content_typeField } = require("./contentTypeUid");
const { FILESYSTEM_BASE_PATH } = require("./config");
const path = require("path");

const convertEntry = async (
  base_url,
  authtoken,
  api_key,
  contentTypeUid,
  locale,
  paths
) => {
  const response = await getEntry(
    base_url,
    authtoken,
    api_key,
    contentTypeUid,
    locale,
    paths
  );
  try {
    if (response?.data && response?.data?.entries?.length > 0) {
      const result = [];
      let skip = 0;
      result.push(...response.data.entries);
      if (response.data.count > 100) {
        let totalCount = response.data.count;
        for (let i = 0; Math.floor(totalCount / 100) > i; i++) {
          const res = await getEntry(
            base_url,
            authtoken,
            api_key,
            contentTypeUid,
            locale,
            paths,
            (skip =
              totalCount - skip > 100
                ? (skip += 100)
                : totalCount - skip + skip)
          );
          if (res?.data && res?.data?.entries?.length > 0) {
            result.push(...res.data.entries);
          }
        }
      }
      return Promise.all(result).then(async (data) => {
        console.log(
          "🚀 ~ file: main.js ~ line 51 ~ returnPromise.all ~ data",
          data.length
        );
        await writeFile(contentTypeUid, { entries: data }, locale);
        const clEntries = await cleanEntries(
          data,
          locale,
          contentTypeUid,
          paths
        );
        return await getCsvEntries(clEntries);
      });
    } else {
      let filePath = path.join(`${FILESYSTEM_BASE_PATH}`);
      await deleteFolder({ path: filePath });
      const res = await getContentType({
        url: base_url,
        authtoken: authtoken,
        contentTypeUid: contentTypeUid,
        api_key: api_key,
      });
      let uids = await content_typeField(res.data.content_type.schema);
      let ctObj = uids.reduce(function (obj, v) {
        if (typeof v === "object") {
          Object.entries(v).forEach(([key, value]) => {
            obj[key] = value;
          });
        } else {
          obj[v] = "";
        }
        return obj;
      }, {});
      return await getCsvEntries(ctObj);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  convertEntry,
};
