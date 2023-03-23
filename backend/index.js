const UNKNOWN_OPERATION = "Unknown Operation";
const { convertEntry } = require("./utils/main");
const { initializeEntry } = require("./utils/updateEntry");

const handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "POST": {
        const { headers, body, queryStringParameters } = event;
        console.log(
          "🚀 ~ file: index.js ~ line 10 ~ exports.handler= ~ event",
          event
        );
        if (queryStringParameters.target === "update") {
          const data = await initializeEntry(JSON.parse(body), headers);
          return {
            headers: {
              "Content-Type": "text/csv",
              "Content-disposition": "attachment; filename=testing.csv",
            },
            body: JSON.stringify({
              data,
            }),
            statusCode: 200,
          };
        } else if (queryStringParameters.target === "fetch") {
          const data = await convertEntry(
            headers.url,
            headers.authtoken,
            headers.api_key,
            headers.contentTypeUid,
            headers.locale,
            JSON.parse(body)
          );
          return {
            headers: {
              "Content-Type": "text/csv",
              "Content-disposition": "attachment; filename=testing.csv",
            },
            body: JSON.stringify({
              data,
            }),
            statusCode: 200,
          };
        }
      }
      default: {
        throw UNKNOWN_OPERATION;
      }
    }
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: err,
    };
  }
};

exports.helloWorld = async (req, res) => {
  try {
    req.headers.contentTypeUid = req.headers.contenttypeuid;
    const response = await handler({
      queryStringParameters: req.query,
      headers: req.headers,
      body: JSON.stringify(req.body),
      httpMethod: "POST",
    });
    res.status(200).send(response.body);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
