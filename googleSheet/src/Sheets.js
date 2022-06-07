function initSpreadsheetForSchema(schema, entries) {
  let environments;
  if (entries.length > 0 && entries[0].locale) {
    environments = [{ name: entries[0].locale }];
  } else {
    const currentSheet = SpreadsheetApp.getActiveSpreadsheet()
      .getActiveSheet()
      .getName();
    environments = [{ name: currentSheet }];
  }
  // createOnEditTrigger();
  createSheetsFromEnvironments(environments, schema, entries);
}

function createSheetsFromEnvironments(environments, schema, entries) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  for (const env of environments) {
    let sheet = activeSpreadsheet.getSheetByName(env.name);

    if (sheet == null) {
      sheet = activeSpreadsheet.insertSheet();
    }

    sheet.clear();
    sheet.setName(env.name);
    addHeadersToSheet(sheet, schema);
    addRowsToSheet(sheet, schema, entries);
  }
}

function addHeadersToSheet(sheet, schema) {
  const headers = [];

  for (const field of schema) {
    if (isGroupingField(field) || !isSupportedFieldType(field)) {
      continue;
    }

    headers.push(field.display_name);
  }

  sheet.appendRow(headers);
  sheet.setFrozenRows(1);

  for (let col = 1; col <= headers.length; col++) {
    let range = sheet.getRange(1, col);

    range.setBackground(SHEET_HEADER_BG).setFontColor(SHEET_HEADER_FG);

    const fontStyle = SpreadsheetApp.newTextStyle()
      .setBold(true)
      .setFontSize(SHEET_HEADER_FONT_SIZE)
      .build();

    range.setTextStyle(fontStyle).protect();
  }
}

function addRowsToSheet(sheet, schema, entries) {
  for (let row = 0; row < entries.length; row++) {
    const entry = entries[row];
    let col = 0;

    for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
      const field = schema[schemaPos];

      if (isGroupingField(field) || !isSupportedFieldType(field)) {
        continue;
      } else {
        col++;
      }

      let offset = entry;

      sheet.getRange(row + 2, col).setValue(offset[field.uid]);
      sheet.autoResizeColumn(col);
    }
  }
}

function getEntriesForSaving(dirty, entries, schema) {
  let sheet = SpreadsheetApp.getActiveSheet();

  const result = [];

  for (const entry of entries) {
    for (let row = 2; row <= sheet.getLastRow(); row++) {
      let col = 0;
      let isEntryRow = sheet.getRange(row, 1).getValue() === entry.uid;

      if (!isEntryRow) {
        continue;
      }

      for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
        const field = schema[schemaPos];

        if (isGroupingField(field) || !isSupportedFieldType(field)) {
          continue;
        } else {
          col++;
        }

        const value = sheet.getRange(row, col).getValue();
        entry[field.uid] = value;
      }

      result.push(entry);
    }
  }

  return result;
}

/*
function getEntriesForSaving(dirty, entries, schema) {
  let sheet = SpreadsheetApp.getActiveSheet();

  const result = [];

  for (const uid of dirty) {
    let entry = entries.find(r => r.uid === uid);

    for (let row = 2; row <= sheet.getLastRow(); row++) {
      let col = 0;
      let isEntryRow = sheet.getRange(row, 1).getValue() === uid;

      if (!isEntryRow) {
        continue;
      }      

      for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
        const field = schema[schemaPos];

        if (isGroupingField(field) || !isSupportedFieldType(field)) {
          continue;
        } else {
          col++;
        }

        const value = sheet.getRange(row, col).getValue();
        entry[field.uid] = value;
      }

      result.push(entry);
    }
  }

  return result;
}
*/

// function createOnEditTrigger() {
//   var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
//   status = authInfo.getAuthorizationStatus();
//   url = authInfo.getAuthorizationUrl();
//   let triggers = ScriptApp.getProjectTriggers();
//   let shouldCreateTrigger = true;

//   triggers.forEach(function (trigger) {
//     if (trigger.getEventType() === ScriptApp.EventType.ON_EDIT && trigger.getHandlerFunction() === "onCellEdited") {
//       shouldCreateTrigger = false;
//     }
//   });

//   if (shouldCreateTrigger) {
//     ScriptApp.newTrigger("onCellEdited")
//       .forSpreadsheet(SpreadsheetApp.getActive())
//       .onEdit()
//       .create();
//   }
// }

// function onCellEdited(e) {
//   let sheet = SpreadsheetApp.getActiveSheet();
//   let current = getDirtyEntries() || [];
//   let edited = [];

//   for (let i = e.range.rowStart; i <= e.range.rowEnd; i++) {
//     let uid = sheet.getRange(e.range.rowStart, 1).getValue();
//     edited.push(uid);
//   }

//   const unique = new Set([...current, ...edited]);
//   setDirtyEntries([...unique]);
// }
