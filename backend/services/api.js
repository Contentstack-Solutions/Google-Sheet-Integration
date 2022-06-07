const axios = require("axios");

const getEntry = async (
  base_url,
  authtoken,
  api_key,
  contentTypeUid,
  locale,
  paths,
  skip = 0,
  limit = 100
) => {
  try {
    console.log("🚀 ~ file: api.js ~ line 13 ~ skip", skip);
    const options = {
      method: "GET",
      url: `${base_url}/content_types/${contentTypeUid}/entries?locale=${locale}&include_count=true&skip=${skip}&limit=${limit}`,
      headers: {
        "Content-Type": "application/json",
        api_key: api_key,
        authtoken: authtoken,
      },
    };
    return await axios(options);
  } catch (error) {
    console.error("Error while getting Entry", error);
  }
};

const updateEntry = async ({
  entry,
  contentTypeUid,
  entry_uid,
  locale,
  url,
  api_key,
  authtoken,
}) => {
  try {
    const options = {
      url: `${url}/content_types/${contentTypeUid}/entries/${entry_uid}?locale=${locale}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        api_key: api_key,
        authtoken: authtoken,
      },
      data: JSON.stringify(entry),
    };
    return await axios(options);
  } catch (error) {
    error.response.data.notice = error.response.data.error_message;
    return error.response;
  }
};

const importEntry = async ({
  entry,
  contentTypeUid,
  locale,
  url,
  api_key,
  authtoken,
}) => {
  try {
    const options = {
      method: "POST",
      url: `${url}/content_types/${contentTypeUid}/entries?locale=${locale}`,
      headers: {
        api_key: api_key,
        authtoken: authtoken,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(entry),
    };
    return await axios(options);
  } catch (err) {
    err.response.data.notice = err.response.data.error_message;
    return err.response;
  }
};

const getContentType = async ({ url, authtoken, api_key, contentTypeUid }) => {
  try {
    const options = {
      method: "GET",
      url: `${url}/content_types/${contentTypeUid}?include_global_field_schema=true`,
      headers: {
        api_key: api_key,
        authtoken: authtoken,
        "Content-Type": "application/json",
      },
    };

    return await axios(options);
  } catch (err) {
    console.log("🚀 ~ file: api.js ~ line 103 ~ getContentType ~ err", err);
  }
};

module.exports = { getEntry, updateEntry, importEntry, getContentType };
