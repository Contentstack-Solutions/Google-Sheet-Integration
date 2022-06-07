function deleteButton() {
  const action = CardService.newAction().setFunctionName(
    "onDeleteSheetsClicked"
  );
  return CardService.newCardSection().addWidget(
    CardService.newDecoratedText()
      .setText("Clear All Sheets")
      .setButton(
        CardService.newImageButton()
          .setAltText("clear")
          .setIconUrl(CLEAR_LOGO)
          .setOnClickAction(action)
      )
  );
}

function onDeleteSheetsClicked() {
  const selectedLocale = getCurrentLocales();
  try {
    setFetchButton(true);
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheets = activeSpreadsheet.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].getName() === selectedLocale) {
        continue;
      } else {
        const sheet = activeSpreadsheet.getSheetByName(sheets[i].getName());
        activeSpreadsheet.deleteSheet(sheet);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
