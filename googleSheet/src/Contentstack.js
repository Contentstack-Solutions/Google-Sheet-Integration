// const cmaBaseApi = 'https://api.contentstack.io/v3';

function cmaLogin(email, password) {
  const url = getRegionUrl();
  const userSessionApi = `${url}/user-session`;

  const data = {
    user: {
      email: email,
      password: password,
    },
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };

  return parseResponse(UrlFetchApp.fetch(userSessionApi, options));
}

function cmaGetStacks(authtoken, orgUid) {
  const url = getRegionUrl();
  const stacksApi = `${url}/stacks`;

  const options = {
    method: "get",
    headers: {
      authtoken: authtoken,
      organization_uid: orgUid,
    },
  };

  return parseResponse(UrlFetchApp.fetch(stacksApi, options));
}

function cmaGetContentTypes(authtoken, apiKey, skip, limit, search) {
  const url = getRegionUrl();
  // let query = { title: { $regex: `^${search}`, $options: "i" } };
  // const stacksApi = search
  //   ? `${url}/content_types?include_count=true&include_global_field_schema=true&limit=${limit}&skip=${skip}&asc=uid&query=${encodeURIComponent(
  //       Utilities.jsonStringify(query)
  //     )}`
  //   : `${url}/content_types?include_count=true&include_global_field_schema=true&limit=${limit}&skip=${skip}&asc=uid`;

  const stacksApi = search
    ? `${url}/content_types?include_count=true&include_global_field_schema=true&limit=${limit}&skip=${skip}&asc=uid&typeahead=${search}`
    : `${url}/content_types?include_count=true&include_global_field_schema=true&limit=${limit}&skip=${skip}&asc=uid`;

  const options = {
    method: "get",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
    },
  };

  return parseResponse(UrlFetchApp.fetch(stacksApi, options));
}

function cmaGetLocale(authtoken, apiKey) {
  const url = getRegionUrl();
  const localeApi = `${url}/locales`;

  const options = {
    method: "get",
    contentType: "application/json",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
    },
  };

  return parseResponse(UrlFetchApp.fetch(localeApi, options));
}

function cmaGetEnvironments(authtoken, apiKey) {
  const url = getRegionUrl();
  const environmentsApi = `${url}/environments`;

  const options = {
    method: "get",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
    },
  };

  return parseResponse(UrlFetchApp.fetch(environmentsApi, options));
}

function cmaGetEntries(authtoken, apiKey, contentTypeUid, locale) {
  const url = getRegionUrl();
  const entriesApi = `${url}/content_types/${contentTypeUid}/entries?locale=${locale}`;

  const options = {
    method: "get",
    contentType: "application/json",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
    },
  };

  return parseResponse(UrlFetchApp.fetch(entriesApi, options));
}

function cmaUpdateEntry(authtoken, apiKey, contentTypeUid, entry, locale) {
  try {
    const url = getRegionUrl();
    const updateApi = `${url}/content_types/${contentTypeUid}/entries/${entry.uid}?locale=${locale}`;

    let payload = JSON.stringify({
      entry: entry,
    });

    const options = {
      method: "put",
      contentType: "application/json",
      headers: {
        authtoken: authtoken,
        api_key: apiKey,
      },
      payload: payload,
    };
    let res = parseResponse(UrlFetchApp.fetch(updateApi, options));
    return res;
  } catch (err) {
    let removedErr = err.message.split("server response:")[1];
    let error = JSON.parse(removedErr.split("(")[0]);
    Browser.msgBox(`${error.error_message}${JSON.stringify(error.errors)}`);
  }
}

function cmaGetSingleContentType(authtoken, apiKey, contentTypeUid) {
  const url = getRegionUrl();
  const localeApi = `${url}/content_types/${contentTypeUid}?include_global_field_schema=true`;

  const options = {
    method: "get",
    contentType: "application/json",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
    },
  };

  return parseResponse(UrlFetchApp.fetch(localeApi, options));
}

function cmauploadeAsset(authtoken, api_key, file, fileName) {
  try {
    const url = getRegionUrl();
    const updateApi = `${url}/assets`;
    let meta = {
      name: fileName,
    };

    const payload = {
      metadata: Utilities.newBlob(JSON.stringify(meta), "multipart/form-data"),
      file: file,
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: payload,
    };

    return parseResponse(UrlFetchApp.fetch(updateApi, options));
  } catch (err) {
    Browser.msgBox(err.message);
    console.log(err.message);
  }
}

function cmaGetCsvOfEntry(
  authtoken,
  apiKey,
  contentTypeUid,
  locale,
  paths = []
) {
  try {
    const url = getRegionUrl();
    const csvCreateApi = `${CSV_BACKEND}?target=fetch`;

    let payload = JSON.stringify(paths);

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        authtoken: authtoken,
        api_key: apiKey,
        locale: locale,
        contentTypeUid,
        url: url,
      },
      payload: payload,
    };
    const csv = parseResponse(UrlFetchApp.fetch(csvCreateApi, options));
    console.log("🚀 ~ file: Contentstack.js ~ line 204 ~ csv", csv);
    const sanitizedString = csv?.data
      .replace(/\\/g, "::back-slash::")
      .replace(
        /(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]\r?\n(?:\\[\s\S][^'\\]\r?\n)*')/g,
        (match) => match.replace(/\r?\n/g, "::newline::")
      );
    return Utilities.parseCsv(sanitizedString);
  } catch (err) {
    console.log(
      "🚀 ~ file: Contentstack.js ~ line 181 ~ cmaGetCsvOfEntry ~ err",
      err
    );
  }
}

function cmaUpdateCSVEntry(authtoken, apiKey, contentTypeUid, locale, csv) {
  const url = getRegionUrl();
  const csvUpdateApi = `${CSV_BACKEND}?target=update`;

  const options = {
    method: "post",
    contentType: "application/json",
    // "Content-type": "data:text/csv;charset=utf-8",
    // "Content-disposition": "attachment; filename=testing.csv",
    headers: {
      authtoken: authtoken,
      api_key: apiKey,
      locale: locale,
      contentTypeUid,
      url: url,
    },
    payload: JSON.stringify(csv),
  };
  const data = parseResponse(UrlFetchApp.fetch(csvUpdateApi, options));
  console.log(
    "🚀 ~ file: Contentstack.js ~ line 239 ~ cmaUpdateCSVEntry ~ csv",
    data
  );
  if (data && data?.data?.flag === true) {
    Browser.msgBox(data.data.message);
  } else {
    const sanitizedString = data?.data
      .replace(/\\/g, "::back-slash::")
      .replace(
        /(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]\r?\n(?:\\[\s\S][^'\\]\r?\n)*')/g,
        (match) => match.replace(/\r?\n/g, "::newline::")
      );
    return Utilities.parseCsv(sanitizedString);
  }
}

function parseResponse(response) {
  const responseString = response.getContentText();
  return JSON.parse(responseString);
}
