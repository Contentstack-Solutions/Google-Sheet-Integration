function createOnEditTrigger(e) {
  let contentType = getCurrentContentType();
  const returnValues = ["Card123", "run", "away"];

  let spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getActiveSheet();
  let cellRange = sheet.getActiveCell();
  let lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();
  let selectedColumn = cellRange.getColumn();
  let selectedRow = cellRange.getRow();
  let range = sheet.getRange(1, selectedColumn);
  let data = range.getValue();
  let name = sheet.getName();
  // let path = name.split("/");
  // let findedSchema = getData(contentType, path[1]);
  // console.log(
  //   path[1],
  //   "🚀 ~ file: OnEdit.js ~ line 17 ~ createOnEditTrigger ~ findedSchema",
  //   findedSchema
  // );

  if (
    cellRange.getValue() &&
    selectedColumn <= lastColumn &&
    selectedRow <= lastRow
  ) {
    // let rule = SpreadsheetApp.newDataValidation()
    //   .requireValueInList(returnValues)
    //   .build();
    // cellRange.setDataValidation(rule);
    // const html = HtmlService.createHtmlOutputFromFile("AssetsUploader")
    //   .setWidth(400)
    //   .setHeight(300);
    // SpreadsheetApp.getUi().showModalDialog(html, "Upload Asset");
  }
}

function onUploadAsset(file, fileName) {
  try {
    const stack = getCurrentStack();
    const user = getCurrentUser();
    console.log(file);
    let res = cmauploadeAsset(user.authtoken, stack.apiKey, file, fileName);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
