function createRootContentTypeFieldsCard() {
  setRemovedPath([]);
  const currentContentType = getCurrentContentType();
  currentContentType.schema.unshift({
    display_name: "UID",
    data_type: "uid",
    uid: "uid",
  });

  return createContentTypeFieldsCard(
    currentContentType,
    currentContentType.title
  );
}

function createContentTypeFieldsCard(contentType, title) {
  const groupSection =
    CardService.newCardSection().setHeader("Reference Fields");

  let reference = findPathsToKey({
    obj: contentType,
    key: "reference_to",
  });

  if (reference.length) {
    const refButtonList = referenceButton(contentType, reference);
    if (refButtonList.length) {
      for (const control of refButtonList) {
        groupSection.addWidget(control);
      }
    } else {
      let emptyControl = CardService.newDecoratedText()
        .setText("There are no References in this content_type.")
        .setWrapText(true);

      groupSection.addWidget(emptyControl);
    }
  } else {
    let emptyControl = CardService.newDecoratedText()
      .setText("There are no References in this content_type")
      .setWrapText(true);

    groupSection.addWidget(emptyControl);
  }

  const fieldSection = CardService.newCardSection().setHeader("Fields");
  const fieldControls = createFieldControls(contentType.schema);

  for (
    let control = 0;
    fieldControls.length > 80 ? 80 > control : fieldControls.length > control;
    control++
  ) {
    fieldSection.addWidget(fieldControls[control]);
  }

  const editEntriesAction = CardService.newAction()
    .setFunctionName("onEditEntries")
    .setParameters({ schema: JSON.stringify(contentType.schema) });

  const saveEntriesAction = CardService.newAction()
    .setFunctionName("onSaveEntries")
    .setParameters({ schema: JSON.stringify(contentType.schema) });

  const fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Fetch")
        .setBackgroundColor(THEME_COLOR)
        .setOnClickAction(editEntriesAction)
    )
    .setSecondaryButton(
      CardService.newTextButton()
        .setText("Push")
        .setBackgroundColor("#edf1f7")
        .setOnClickAction(saveEntriesAction)
    );

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(title)
        .setImageStyle(CardService.ImageStyle.CIRCLE)
        .setImageUrl(SMALL_LOGO)
    )
    .addSection(logOutButton())
    .addSection(deleteButton())
    .addSection(selectLocale())
    .addSection(groupSection)
    .addSection(fieldSection)
    .setFixedFooter(fixedFooter)
    .build();

  return card;
}

function createGroupControls(schema) {
  const buttons = [];

  for (const field of schema) {
    if (!isGroupingField(field)) {
      continue;
    }

    const action = CardService.newAction()
      .setFunctionName("onGroupClicked")
      .setParameters({
        field: JSON.stringify(field),
        displayName: field.display_name,
        uid: field.uid,
      });
    const button = CardService.newTextButton()
      .setText(field.display_name)
      .setOnClickAction(action);

    buttons.push(button);
  }

  return buttons;
}

function createFieldControls(schema) {
  const controls = [];
  let list = [];
  const user = getCurrentUser();
  const contentType = getCurrentContentType();
  const stack = getCurrentStack();

  list = content_typeField(schema);

  // let entries = cmaGetEntries(
  //   user.authtoken,
  //   stack.apiKey,
  //   contentType.uid,
  //   "en-us"
  // );

  // if (entries && entries?.entries?.length > 0) {
  //   entries.entries.forEach((entry, index) => {
  //     fieldsToBeIgnoreWhileUpdatingEntry.forEach((item) => {
  //       removePath({ data: entry, path: item });
  //     });
  //     entry = flatten(entry);
  //     Object.keys(entry).forEach((key) => {
  //       list.push({
  //         uid: key,
  //         display_name: key,
  //       });
  //     });
  //   });
  // }

  if (list.length) {
    // list = list.filter((v, i, a) => a.findIndex((v2) => v2 === v) === i);
    setList(list);
    for (i = 0; list.length > i; i++) {
      let fieldControl = CardService.newDecoratedText()
        .setText(list[i])
        .setWrapText(true);

      fieldControl.setSwitchControl(
        CardService.newSwitch()
          .setFieldName(list[i])
          .setValue(true)
          .setSelected(CHECKED_UIDS.includes(list[i]))
          .setControlType(CardService.SwitchControlType.CHECK_BOX)
          .setOnChangeAction(
            CardService.newAction()
              .setFunctionName("handleSwitchChange")
              .setParameters({ list: JSON.stringify(list) })
          )
      );

      controls.push(fieldControl);
    }
    return controls;
  } else {
    let emptyControl = CardService.newDecoratedText()
      .setText("There are no entries in this content_type.")
      .setWrapText(true);
    return new Array(emptyControl);
  }
}

function onGroupClicked(e) {
  const group = JSON.parse(e.parameters.field);
  const card = createContentTypeFieldsCard(group, group.display_name);
  const nav = CardService.newNavigation().pushCard(card);

  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}

async function onEditEntries(e) {
  const user = getCurrentUser();
  const schema =
    getCurrentContentTypeDeleted() &&
    getCurrentContentTypeDeleted().schema.length > 0
      ? getCurrentContentTypeDeleted().schema
      : JSON.parse(e.parameters.schema);
  const contentType = getCurrentContentType();
  const stack = getCurrentStack();
  const selectedLocale = getCurrentLocales();
  let getpath = getRemovedPath();
  const list = getList();
  if (getpath.length === 0) {
    getpath = list.filter((item) => !CHECKED_UIDS.includes(item));
  }

  if (selectedLocale) {
    try {
      const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const csv = cmaGetCsvOfEntry(
        user.authtoken,
        stack.apiKey,
        contentType.uid,
        selectedLocale,
        getpath
      );
      onDeleteSheetsClicked();
      let sheet = activeSpreadsheet.getActiveSheet().setName(selectedLocale);
      if (sheet === null) {
        sheet = activeSpreadsheet.insertSheet();
        sheet.setName(selectedLocale);
      }
      sheet.clear();
      sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
      const fontStyle = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .setFontSize(SHEET_HEADER_FONT_SIZE)
        .build();
      sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .setBackground(SHEET_HEADER_BG)
        .setFontColor(SHEET_HEADER_FG)
        .setFontSize(10)
        .setTextStyle(fontStyle)
        .protect();
      setFetchButton(true);
    } catch (err) {
      console.log(
        "🚀 ~ file: ContentTypeFieldsCard.js ~ line 246 ~ onEditEntries ~ err",
        err
      );
    }
  }
}

async function onSaveEntries(e) {
  const user = getCurrentUser();
  const stack = getCurrentStack();
  const contentType = getCurrentContentType();
  const selectedLocale = getCurrentLocales();
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = activeSpreadsheet.getSheetByName(selectedLocale);
  const activeRange = sheet.getDataRange();
  const data = activeRange.getValues();
  const jsonDAta = getJsonArrayFromData(data);
  if (getFetchButton() === true) {
    let res = cmaUpdateCSVEntry(
      user.authtoken,
      stack.apiKey,
      contentType.uid,
      selectedLocale,
      jsonDAta
    );
    if (res) {
      let updateSheet = activeSpreadsheet.getSheetByName(
        `${selectedLocale}-Updated-logs`
      );
      if (updateSheet === null) {
        updateSheet = activeSpreadsheet.insertSheet();
        updateSheet.setName(`${selectedLocale}-Updated-logs`);
      }
      updateSheet.clear();
      updateSheet.getRange(1, 1, res.length, res[0].length).setValues(res);
      const fontStyle = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .setFontSize(SHEET_HEADER_FONT_SIZE)
        .build();
      updateSheet
        .getRange(1, 1, 1, updateSheet.getLastColumn())
        .setBackground(SHEET_HEADER_BG)
        .setFontColor(SHEET_HEADER_FG)
        .setFontSize(10)
        .setTextStyle(fontStyle)
        .protect();
    }
    setFetchButton(false);
  } else {
    Browser.msgBox(
      "The records are updated successfully.so for new entry updation or creation please first fetch the data."
    );
  }
}

function logges(logs) {
  const html = HtmlService.createHtmlOutput(logs).setWidth(600).setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Successfully Updated Entries Log"
  );
}

function messgae() {
  const html = HtmlService.createHtmlOutputFromFile("AlertModal")
    .setWidth(410)
    .setHeight(310);
  SpreadsheetApp.getUi().showModalDialog(html, "oops!!");
}

function handleSwitchChange(e) {
  let list = JSON.parse(e.parameters.list);
  let content_type = getCurrentContentType();
  content_type.schema.unshift({
    display_name: "UID",
    data_type: "uid",
    uid: "uid",
  });
  if (e.formInput) {
    let seletedPath = Object.entries(e.formInput).map(([key, value]) => {
      if (value === "true") {
        return key;
      } else {
        return;
      }
    });
    let removedPath = list.filter((item) => !seletedPath.includes(item));
    setRemovedPath(["ACL", ...removedPath]);
  }
}

// function createCsvContent(values, delimiter) {
//   // This converts the values 2D array into a simple array of strings delimited by the delimiter
//   const stringArray = values.map((row) => row.join(delimiter));
//   // Then it joins all the strings with newlines
//   const output = stringArray.join("\n");

//   return output;
// }

// function createCsv(locale) {
//   // Get all the values from the sheet as a 2D array
//   const file = SpreadsheetApp.getActive();
//   const sheet = file.getSheetByName(locale);
//   const range = sheet.getDataRange();
//   const values = range.getValues();

//   // call the function to create the csv-like content
//   const csvContent = createCsvContent(values, "|");

//   // create the file in drive
//   return csvContent;
// }

function convertRangeToCsv(csvName, sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  try {
    const data = activeRange.getValues();
    return data;
    // var csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = '"' + data[row][col] + '"';
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length - 1) {
          csv += data[row].join(",") + "\r\n";
        } else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  } catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}

function content_typeField(schema, path = "") {
  const pathsUid = [];
  for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
    if (schema[schemaPos].data_type === "blocks") {
      for (
        let modulerPos = 0;
        modulerPos < schema[schemaPos].blocks.length;
        modulerPos++
      ) {
        let newPath =
          path !== ""
            ? `${path}.${schema[schemaPos].uid}[${modulerPos}].${schema[schemaPos].blocks[modulerPos].uid}`
            : `${schema[schemaPos].uid}[${modulerPos}].${schema[schemaPos].blocks[modulerPos].uid}`;
        pathsUid.push(newPath);
        // const newUids = content_typeField(
        //   schema[schemaPos].blocks[modulerPos].schema,
        //   newPath
        // );
        // if (newUids.length > 0) pathsUid.push(...newUids);
      }
    } else if (
      schema[schemaPos].data_type === "global_field" ||
      schema[schemaPos].data_type === "group"
    ) {
      let newPath =
        path !== ""
          ? `${path}.${schema[schemaPos].uid}`
          : `${schema[schemaPos].uid}`;
      pathsUid.push(newPath);
      // const newUids = content_typeField(schema[schemaPos].schema, newPath);
      // if (newUids.length > 0) pathsUid.push(...newUids);
    } else if (path === "") {
      pathsUid.push(schema[schemaPos].uid);
    }
  }
  return pathsUid;
}

function getJsonArrayFromData(data) {
  var obj = {};
  var result = [];
  var headers = data[0];
  var cols = headers.length;
  var row = [];

  for (var i = 1, l = data.length; i < l; i++) {
    // get a row to fill the object
    row = data[i];
    // clear object
    obj = {};
    for (var col = 0; col < cols; col++) {
      // fill object with new values
      obj[headers[col]] = row[col];
    }
    // add object in a final result
    result.push(obj);
  }

  return result;
}
