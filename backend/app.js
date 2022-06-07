const express = require("express");
const { getCsvEntries } = require("./utils/jsonToCsv");
const cors = require("cors");
const app = express();
const handler = require("./index");
const { initializeEntry } = require("./utils/updateEntry");

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.text({ type: "text/csv" }));

// app.post("/", async (req, res) => {
//   try {
//     req.headers.contentTypeUid = req.headers.contenttypeuid;
//     const response = await handler.handler({
//       headers: req.headers,
//       body: JSON.stringify(req.body),
//       httpMethod: "POST",
//     });
//     console.log(response.body);
//     res.status(200).send(response.body);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

app.post("/", async (req, res) => {
  try {
    req.headers.contentTypeUid = req.headers.contenttypeuid;
    const response = await handler.handler({
      queryStringParameters: req.query,
      headers: req.headers,
      body: JSON.stringify(req.body),
      httpMethod: "POST",
    });
    res.status(200).send(response.body);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(3000, () => {
  console.log(`http://localhost:${3000}/`);
});
