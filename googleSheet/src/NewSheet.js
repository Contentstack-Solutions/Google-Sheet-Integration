function sheetnames(activeSpreadsheet) {
  const out = new Array();
  let sheets = activeSpreadsheet.getSheets();
  for (let i = 0; i < sheets.length; i++) out.push([sheets[i].getName()]);
  return out;
}

async function createSpreadsheetForSchema(schema, entries, locale) {
  let environments = { name: locale };
  await createFromEnvironments(environments, schema, entries);
}

async function createFromEnvironments(environments, schema, entries) {
  const date = new Date();
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet;
  sheet = activeSpreadsheet.getSheetByName(environments.name);
  if (sheet == null) {
    sheet = activeSpreadsheet.insertSheet();
    sheet.setName(environments.name);
    setTabColor(sheet, environments.name);
  }
  sheet.clear();
  let newSchema = { schema };
  await newAddHeadersToSheet(
    sheet,
    newSchema,
    environments.name,
    entries,
    "",
    date
  );
  await newAddRowsToSheet(sheet, schema, entries);
}

async function newAddHeadersToSheet(
  sheet,
  schema,
  name,
  entries,
  path = "",
  date
) {
  // if (Date.now() >= date.getTime() + 40000) {
  //   throw new Error("break");
  // }
  const headers = [];
  let col = 0;
  for (const field of schema.schema) {
    if (field === null) {
      continue;
    } else if (field.data_type === "blocks") {
      for (let blocks = 0; blocks < field.blocks.length; blocks++) {
        if (field.blocks[blocks]?.schema) {
          const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
          let newPath =
            path === ""
              ? `${field.uid}[${blocks}].${field.blocks[blocks].uid}`
              : `${path}.${field.uid}[${blocks}].${field.blocks[blocks].uid}`;

          let newSheet;
          newSheet = activeSpreadsheet.getSheetByName(name);

          // if (newSheet == null) {
          //   newSheet = activeSpreadsheet.insertSheet();
          //   newSheet.setName(`${name}`);
          //   setTabColor(newSheet, name);
          // }
          // newSheet.clear();

          // if (field.blocks[blocks].schema[0]?.uid !== "uid") {
          //   field.blocks[blocks].schema.unshift({
          //     display_name: "UID",
          //     data_type: "uid",
          //     uid: "uid",
          //   });
          // }

          await newAddHeadersToSheet(
            newSheet,
            field.blocks[blocks],
            name,
            entries,
            newPath,
            date
          );
          // await addModulerRowsToSheet(
          //   newSheet,
          //   field.blocks[blocks],
          //   newPath,
          //   entries,
          //   blocks,
          //   name,
          //   date
          // );
        } else {
          continue;
        }
      }
    } else if (field.data_type === "group") {
      const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let newPath = path === "" ? `${field.uid}` : `${path}.${field.uid}`;
      let newSheet;
      newSheet = activeSpreadsheet.getSheetByName(name);
      // if (newSheet == null) {
      //   newSheet = activeSpreadsheet.insertSheet();
      //   newSheet.setName(`${name}/${newPath}`);
      //   setTabColor(newSheet, name);
      // }
      // newSheet.clear();

      // if (field?.schema[0]?.uid !== "uid") {
      //   field.schema.unshift({
      //     display_name: "UID",
      //     data_type: "uid",
      //     uid: "uid",
      //   });
      // }

      if (field.multiple) {
        const valueSend = [];
        let fieldCount = 0;
        entries.forEach((entry, index) => {
          const appendValues = [];
          let entryCos = 0;
          let data = getData(entry, newPath);
          for (let entryPos = 0; entryPos < data.length; entryPos++) {
            for (
              let schemaPos = 0;
              schemaPos < field.schema.length;
              schemaPos++
            ) {
              const fieldNested = field.schema[schemaPos];
              if (fieldNested === null) {
                continue;
              } else if (
                fieldNested.data_type === "file" ||
                fieldNested.data_type === "global_fieldNested" ||
                fieldNested.data_type === "reference" ||
                fieldNested.data_type === "group" ||
                fieldNested.data_type === "blocks" ||
                fieldNested.data_type === "json" ||
                fieldNested.data_type === "link"
              ) {
                continue;
              } else {
                entryCos++;
                appendValues.push(data[entryPos][fieldNested.uid]);
              }
            }
          }
          if (appendValues.length) {
            valueSend.push(appendValues);
          }
          fieldCount = data.length > fieldCount ? data.length : fieldCount;
        });

        console.log(valueSend);

        for (let i = 0; i < fieldCount; i++) {
          await newAddHeadersToSheet(
            newSheet,
            field,
            name,
            entries,
            newPath,
            date
          );
        }

        // if (newPath.split(".").length === 1) {
        //   await addGroupRowsToSheet(
        //     newSheet,
        //     field,
        //     newPath,
        //     entries,
        //     false,
        //     "",
        //     name,
        //     date
        //   );
        // }
      } else {
        await newAddHeadersToSheet(
          newSheet,
          field,
          name,
          entries,
          newPath,
          date
        );
        if (newPath.split(".").length === 1) {
          await addGroupRowsToSheet(
            newSheet,
            field,
            newPath,
            entries,
            false,
            "",
            name,
            date
          );
        }
      }
    } else if (field.data_type === "global_field") {
      if (field.schema) {
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        let newPath = path === "" ? `${field.uid}` : `${path}.${field.uid}`;
        let newSheet;
        newSheet = activeSpreadsheet.getSheetByName(`${name}`);
        // if (newSheet == null) {
        //   newSheet = activeSpreadsheet.insertSheet();
        //   newSheet.setName(name);
        //   setTabColor(newSheet, name);
        // }

        // if (field?.schema[0]?.uid !== "uid") {
        //   field.schema.unshift({
        //     display_name: "UID",
        //     data_type: "uid",
        //     uid: "uid",
        //   });
        // }
        await newAddHeadersToSheet(
          newSheet,
          field,
          name,
          entries,
          newPath,
          date
        );
        if (schema.data_type === "group" && schema.multiple) {
          for (let ent = 0; ent < entries.length; ent++) {
            let global_entry = getData(entries[ent], path);
            if (global_entry && global_entry.length) {
              for (let nested = 0; nested < global_entry.length; nested++) {
                await addGroupRowsToSheet(
                  newSheet,
                  field,
                  `${path}[${nested}].${field.uid}`,
                  entries,
                  false,
                  "",
                  name,
                  date
                );
              }
            }
          }
        } else {
          await addGroupRowsToSheet(
            newSheet,
            field,
            newPath,
            entries,
            false,
            "",
            name,
            date
          );
        }
      } else {
        continue;
      }
    } else if (
      field.data_type === "file" ||
      field.data_type === "reference" ||
      field.data_type === "json" ||
      field.data_type === "link"
    ) {
      continue;
    } else {
      col++;
      headers.push(
        path !== "" ? `${path}.${field.display_name}` : field.display_name
      );
    }
  }

  // if (Date.now() >= date.getTime() + 40000) {
  //   throw new Error("break");
  // }

  // if (sheet.getRange(1, 1).getValue()) {
  //   return;
  // }
  // else {
  const data = [];
  data.push(headers);
  if (data.length > 0 && col > 0) {
    try {
      sheet.getRange(1, sheet.getLastColumn() + 1, 1, col).setValues(data);
    } catch (err) {
      console.log(err);
    }
    // sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    const fontStyle = SpreadsheetApp.newTextStyle()
      .setBold(true)
      .setFontSize(SHEET_HEADER_FONT_SIZE)
      .build();

    sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .setBackground(SHEET_HEADER_BG)
      .setFontColor(SHEET_HEADER_FG)
      .setTextStyle(fontStyle)
      .protect();
  }

  // }
}

async function newAddRowsToSheet(sheet, schema, entries) {
  const result = [];
  let colConter = 0;

  for (let row = 0; row < entries.length; row++) {
    const appendValues = [];
    let col = 0;
    let entry = entries[row];
    for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
      const field = schema[schemaPos];
      if (field === null) {
        continue;
      } else if (
        field.data_type === "file" ||
        field.data_type === "global_field" ||
        field.data_type === "reference" ||
        field.data_type === "group" ||
        field.data_type === "blocks" ||
        field.data_type === "json" ||
        field.data_type === "link"
      ) {
        continue;
      } else {
        col++;
        let offset = entry;
        appendValues.push(offset[field.uid]);
      }
    }
    colConter = col;
    result.push(appendValues);
  }
  if (result.length) {
    sheet
      .getRange(2, sheet.getLastColumn() - 1, entries.length, colConter)
      .setValues(result);
  }
}

async function addGroupRowsToSheet(
  sheet,
  schema,
  path,
  entries,
  nested,
  uid,
  name,
  date
) {
  if (Date.now() >= date.getTime() + 40000) {
    throw new Error("break");
  }

  const result = [];
  const multiResult = [];
  const nestedResult = [];
  let colConter = 0;
  let colMulConter = 0;
  let colNestedCounter = 0;
  let simpleKeyCounter = 0;
  let keyConter = 0;
  let nestedKeyConter = 0;
  // if (schema.multiple && nested) {
  //   let range = sheet.getRange(sheet.getLastRow() + 1, sheet.getLastColumn());
  //   console.log("🚀 ~ file: NewSheet.js ~ line 315 ~ range", range);
  // }
  for (let i = 0; i < entries.length; i++) {
    const addSameLineValue = [];
    let entry = entries[i];
    if (schema.multiple) {
      if (nested) {
        if (entry.uid === uid) {
          let keyEntry = getData(entry, path);
          if (keyEntry && keyEntry.length) {
            for (let row = 0; row < keyEntry.length; row++) {
              const appendRow = [];
              let col = 0;
              for (
                let schemaPos = 0;
                schemaPos < schema.schema.length;
                schemaPos++
              ) {
                const field = schema.schema[schemaPos];
                if (
                  field.data_type === "file" ||
                  field.data_type === "global_field" ||
                  field.data_type === "reference" ||
                  field.data_type === "group" ||
                  field.data_type === "blocks" ||
                  field.data_type === "json" ||
                  field.data_type === "link"
                ) {
                  continue;
                } else {
                  col++;
                  if (field.uid === "uid") {
                    appendRow.push(entry.uid);
                  } else if (
                    typeof keyEntry[row][field.uid] === "boolean" ||
                    keyEntry[row][field.uid]
                  ) {
                    appendRow.push(keyEntry[row][field.uid]);
                  } else {
                    appendRow.push("");
                  }
                }
              }
              colNestedCounter = col;
              nestedKeyConter++;
              nestedResult.push(appendRow);
            }
          }
        }
      } else {
        const sheetWrite = sheet.getRange(2, 1).getValue();
        let keyEntry = getData(entry, path);
        if (keyEntry && keyEntry.length) {
          for (let row = 0; row < keyEntry.length; row++) {
            const appendValues = [];
            let col = 0;
            for (
              let schemaPos = 0;
              schemaPos < schema.schema.length;
              schemaPos++
            ) {
              const field = schema.schema[schemaPos];
              if (field.data_type === "group") {
                if (field.multiple) {
                  const activeSpreadsheet =
                    SpreadsheetApp.getActiveSpreadsheet();
                  let newPath = `${path}.${field.uid}`;
                  let newPathNested = `${path}[${row}].${field.uid}`;
                  let newSheet;
                  newSheet = activeSpreadsheet.getSheetByName(
                    `${name}/${newPath}`
                  );
                  await addGroupRowsToSheet(
                    newSheet,
                    field,
                    newPathNested,
                    entries,
                    true,
                    entry.uid,
                    name,
                    date
                  );
                } else {
                  const activeSpreadsheet =
                    SpreadsheetApp.getActiveSpreadsheet();
                  let newPath = `${path}.${field.uid}`;
                  let newPathNested = `${path}[${row}].${field.uid}`;
                  let newSheet = activeSpreadsheet.getSheetByName(
                    `${name}/${newPath}`
                  );

                  let groupEntryData = getData(entry, newPathNested);
                  const groupResult = [];
                  let colGroup = 0;
                  if (groupEntryData) {
                    let appendRowgroup = [];
                    let col = 0;
                    for (
                      let schemaPos = 0;
                      schemaPos < field.schema.length;
                      schemaPos++
                    ) {
                      const newField = field.schema[schemaPos];
                      if (
                        newField.data_type === "file" ||
                        newField.data_type === "global_field" ||
                        newField.data_type === "reference" ||
                        newField.data_type === "blocks" ||
                        newField.data_type === "json" ||
                        newField.data_type === "group" ||
                        newField.data_type === "link"
                      ) {
                        continue;
                      } else {
                        col++;
                        if (newField.uid === "uid") {
                          appendRowgroup.push(entry.uid);
                        } else if (
                          typeof groupEntryData[newField.uid] === "boolean" ||
                          groupEntryData[newField.uid]
                        ) {
                          appendRowgroup.push(groupEntryData[newField.uid]);
                        } else {
                          appendRowgroup.push("");
                        }
                      }
                    }
                    colGroup = col;
                    groupResult.push(appendRowgroup);
                  }
                  if (groupResult.length > 0) {
                    try {
                      newSheet
                        .getRange(newSheet.getLastRow() + 1, 1, 1, colGroup)
                        .setValues(groupResult);
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }
              } else if (
                field.data_type === "file" ||
                field.data_type === "global_field" ||
                field.data_type === "reference" ||
                field.data_type === "blocks" ||
                field.data_type === "json" ||
                field.data_type === "link"
              ) {
                continue;
              } else {
                col++;
                if (field.uid === "uid") {
                  appendValues.push(entry.uid);
                } else if (
                  typeof keyEntry[row][field.uid] === "boolean" ||
                  keyEntry[row][field.uid]
                ) {
                  appendValues.push(keyEntry[row][field.uid]);
                } else {
                  appendValues.push("");
                }
              }
            }
            colMulConter = col;
            keyConter++;
            if (sheetWrite) {
              return;
            } else {
              addSameLineValue.push(appendValues);
            }
          }
        }
        try {
          sheet
            .getRange(i + 2, sheet.getLastColumn() - 3, 1, colMulConter)
            .setValues(addSameLineValue);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      const sheetWrite = sheet.getRange(2, 1).getValue();
      const appendRow = [];
      let col = 0;
      let offset = getData(entry, path);
      if (offset) {
        for (let schemaPos = 0; schemaPos < schema.schema.length; schemaPos++) {
          const field = schema.schema[schemaPos];
          if (field === null) {
            continue;
          } else if (field.data_type === "group") {
            if (field.multiple) {
              const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
              let newPath = `${path}.${field.uid}`;
              let newSheet = activeSpreadsheet.getSheetByName(
                `${name}/${newPath}`
              );
              await addGroupRowsToSheet(
                newSheet,
                field,
                newPath,
                entries,
                false,
                "",
                name,
                date
              );
            } else {
              const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
              let newPath = `${path}.${field.uid}`;
              let newSheet = activeSpreadsheet.getSheetByName(
                `${name}/${newPath}`
              );
              await addGroupRowsToSheet(
                newSheet,
                field,
                newPath,
                entries,
                false,
                "",
                name,
                date
              );
            }
          } else if (
            field.data_type === "file" ||
            field.data_type === "global_field" ||
            field.data_type === "reference" ||
            field.data_type === "blocks" ||
            field.data_type === "json" ||
            field.data_type === "link"
          ) {
            continue;
          } else {
            col++;
            if (field.data_type === "uid") {
              appendRow.push(entry.uid);
            } else if (
              typeof offset[field.uid] === "boolean" ||
              offset[field.uid]
            ) {
              appendRow.push(offset[field.uid]);
            } else {
              appendRow.push("");
            }
          }
        }
        colConter = col;
        simpleKeyCounter++;
        if (sheetWrite) {
          return;
        } else {
          result.push(appendRow);
        }
      }
    }
  }
  if (schema.multiple) {
    if (nested) {
      if (nestedResult.length) {
        try {
          sheet
            .getRange(
              sheet.getLastRow() + 1,
              1,
              nestedKeyConter,
              colNestedCounter
            )
            .setValues(nestedResult);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      if (multiResult.length) {
        // try {
        //   sheet
        //     .getRange(sheet.getLastRow() + 1, 1, keyConter, colMulConter)
        //     .setValues(multiResult);
        // } catch (err) {
        //   console.log(err);
        // }
      }
    }
  } else {
    if (result.length && colConter > 0) {
      try {
        sheet
          .getRange(sheet.getLastRow() + 1, 1, simpleKeyCounter, colConter)
          .setValues(result);
      } catch (err) {
        console.log(err, "hello");
      }
    }
  }
}

async function addModulerRowsToSheet(
  sheet,
  schema,
  path,
  entries,
  index,
  name,
  date
) {
  if (Date.now() >= date.getTime() + 40000) {
    throw new Error("break");
  }

  const sheetWrite = sheet.getRange(2, 1).getValue();
  const result = [];
  let count = 0;
  let colCount = 0;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const nestedEntry = getData(
      entry,
      path.replace(`[${index}].${schema.uid}`, "")
    );

    if (nestedEntry && nestedEntry.length > 0) {
      for (let row = 0; row < nestedEntry.length; row++) {
        if (Object.keys(nestedEntry[row])[0] === schema.uid) {
          let col = 0;
          const appendValues = [];
          for (
            let schemaPos = 0;
            schemaPos < schema.schema.length;
            schemaPos++
          ) {
            const field = schema.schema[schemaPos];
            if (field.data_type === "group") {
              if (field.multiple) {
                const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
                let newPath = `${path}.${field.uid}`;
                let newSheet;
                newSheet = activeSpreadsheet.getSheetByName(
                  `${name}/${newPath}`
                );
                await addGroupRowsToSheet(
                  newSheet,
                  field,
                  newPath.replace(`[${index}]`, `[${row}]`),
                  entries,
                  true,
                  entry.uid,
                  name,
                  date
                );
              } else {
                const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
                let newPath = `${path}.${field.uid}`;
                let newSheet;
                newSheet = activeSpreadsheet.getSheetByName(
                  `${name}/${newPath}`
                );
                let newOffset = getData(
                  entry,
                  newPath.replace(`[${index}]`, `[${row}]`)
                );
                const simpleGroupResult = [];
                let countGroupCOl = 0;
                if (newOffset) {
                  let appendRowData = [];
                  let col = 0;
                  for (
                    let schemaPos = 0;
                    schemaPos < field.schema.length;
                    schemaPos++
                  ) {
                    let newField = field.schema[schemaPos];
                    if (
                      newField.data_type === "global_field" ||
                      newField.data_type === "reference" ||
                      newField.data_type === "file" ||
                      newField.data_type === "blocks" ||
                      newField.data_type === "json" ||
                      newField.data_type === "group" ||
                      newField.data_type === "link"
                    ) {
                      continue;
                    } else {
                      col++;
                      if (newField.uid === "uid") {
                        appendRowData.push(entry.uid);
                      } else if (
                        typeof newOffset[newField.uid] === "boolean" ||
                        newOffset[newField.uid]
                      ) {
                        appendRowData.push(newOffset[newField.uid]);
                      } else {
                        appendRowData.push("");
                      }
                    }
                  }
                  countGroupCOl = col;
                  simpleGroupResult.push(appendRowData);
                }
                if (simpleGroupResult.length) {
                  try {
                    newSheet
                      .getRange(newSheet.getLastRow() + 1, 1, 1, countGroupCOl)
                      .setValues(simpleGroupResult);
                  } catch (err) {
                    console.log(err);
                  }
                }
              }
            } else if (
              field.data_type === "file" ||
              field.data_type === "global_field" ||
              field.data_type === "reference" ||
              field.data_type === "blocks" ||
              field.data_type === "json" ||
              field.data_type === "link"
            ) {
              continue;
            } else {
              col++;
              let offset = nestedEntry[row][schema.uid];
              if (field.uid === "uid") {
                appendValues.push(entry.uid);
              } else if (
                typeof offset[field.uid] === "boolean" ||
                offset[field.uid]
              ) {
                appendValues.push(offset[field.uid]);
              } else {
                appendValues.push("");
              }
            }
          }
          colCount = col;
          count++;
          if (sheetWrite) {
            return;
          } else {
            result.push(appendValues);
          }
        }
      }
    }
  }

  if (result.length) {
    try {
      sheet
        .getRange(sheet.getLastRow() + 1, 1, count, colCount)
        .setValues(result);
    } catch (err) {
      console.log(err);
    }
  }
}

function newGetEntriesForSaving(entries, schema, sheet, locale) {
  const result = [];
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  for (let i = 0; i < entries.length; i++) {
    for (let row = 2; row <= sheet.getLastRow(); row++) {
      let col = 0;
      let isEntryRow = sheet.getRange(row, 1).getValue() === entries[i].uid;

      if (!isEntryRow) {
        continue;
      }

      for (let schemaPos = 0; schemaPos < schema.length; schemaPos++) {
        const field = schema[schemaPos];
        if (field.data_type === "blocks") {
          let newValue = getModulerEntriesForSaving(
            entries[i],
            field.uid,
            field,
            i,
            locale
          );
          entries[i][field.uid] = newValue;
        } else if (field.data_type === "group") {
          let newUid = `${field.uid}`;
          let sheet = activeSpreadsheet.getSheetByName(
            `${locale}/${field.uid}`
          );
          let newValue = getGroupEntriesForSaving(
            entries[i],
            field.uid,
            field,
            i,
            locale,
            false,
            "",
            sheet
          );
          entries[i][field.uid] = newValue;
        } else if (field.data_type === "global_field") {
          let newUid = `${field.uid}`;
          let sheet = activeSpreadsheet.getSheetByName(
            `${locale}/${field.uid}`
          );
          let newValue = getGroupEntriesForSaving(
            entries[i],
            newUid,
            field,
            i,
            locale,
            false,
            "",
            sheet
          );
          entries[i][field.uid] = newValue;
        } else if (field.data_type === "file") {
          if (entries[i][field.uid] !== null) {
            entries[i][field.uid] = entries[i][field.uid]["uid"];
          } else {
            continue;
          }
        } else if (
          field.data_type === "link" ||
          field.data_type === "reference" ||
          field.data_type === "json"
        ) {
          continue;
        } else {
          col++;
          const value = sheet.getRange(row, col).getValue();
          // if (field.data_type === "link") {
          //   if (entries[i][field.uid]) {
          //     let path = value
          //       .replace("{href=", "")
          //       .replace("title=", "")
          //       .replace("}", "")
          //       .split(",");
          //     entries[i][field.uid] = {
          //       href: path[1],
          //       title: path[0],
          //     };
          //   }
          // } else {
          entries[i][field.uid] = value;
          // }
        }
      }
      result.push(entries[i]);
    }
  }

  return result;
}

function getGroupEntriesForSaving(
  entry,
  uid,
  schema,
  index,
  locale,
  nstd = false,
  blocks,
  sheet
) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let newEntry = getData(entry, uid);
  if (schema.multiple) {
    if (nstd) {
      let nestedEntry = getData(
        entry,
        uid.replace(`[${blocks}]`, `[${index}]`)
      );
      let newAllValues = sheet
        .getRange(2, 1, sheet.getLastRow(), schema.schema.length + 1)
        .getValues();
      let filteredValues = newAllValues.filter((item) => item[0] === entry.uid);
      if (nestedEntry && nestedEntry.length > 0) {
        for (let nested = 0; nested < nestedEntry.length; nested++) {
          let col = 0;
          let newValues =
            filteredValues[
              filteredValues.length > index ? nested + index : nested
            ];
          for (
            let schemaPos = 0;
            schemaPos < schema.schema.length;
            schemaPos++
          ) {
            const field = schema.schema[schemaPos];
            if (field.data_type === "group") {
              continue;
            } else if (field.data_type === "blocks") {
              continue;
            } else if (field.data_type === "file") {
              if (nestedEntry[nested][field.uid] !== null) {
                nestedEntry[nested][field.uid] =
                  nestedEntry[nested][field.uid]["uid"];
              } else {
                continue;
              }
            } else if (
              field.data_type === "global_field" ||
              field.data_type === "reference" ||
              field.data_type === "json" ||
              field.data_type === "link"
            ) {
              continue;
            } else {
              col++;
              nestedEntry[nested][field.uid] = newValues[col];
            }
          }
        }
      }
      return nestedEntry;
    } else {
      let newAllValues = sheet
        .getRange(2, 1, sheet.getLastRow(), schema.schema.length + 1)
        .getValues();

      let filteredValues = newAllValues.filter((item) => item[0] === entry.uid);

      if (newEntry && newEntry.length > 0) {
        for (let nested = 0; nested < newEntry.length; nested++) {
          let newValues = filteredValues[nested];
          let col = 0;
          for (
            let schemaPos = 0;
            schemaPos < schema.schema.length;
            schemaPos++
          ) {
            const field = schema.schema[schemaPos];
            if (field.data_type === "group") {
              if (field.multiple) {
                let nestedUid = `${uid}[${nested}].${field.uid}`;
                let newsheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newgroupValues = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  nested,
                  locale,
                  true,
                  nested,
                  newsheet
                );
                newEntry[nested][field.uid] = newgroupValues;
              } else {
                let nestedUid = `${uid}[${nested}].${field.uid}`;
                let newsheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newgroupValues = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  nested,
                  locale,
                  true,
                  nested,
                  newsheet
                );
                newEntry[nested][field.uid] = newgroupValues;
              }
            } else if (field.data_type === "blocks") {
              continue;
            } else if (field.data_type === "file") {
              if (newEntry[nested][field.uid] !== null) {
                newEntry[nested][field.uid] =
                  newEntry[nested][field.uid]["uid"];
              } else {
                continue;
              }
            } else if (field.data_type === "global_field") {
              if (field.multiple) {
                let nestedUid = `${uid}[${nested}].${field.uid}`;
                let newsheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newgroupValues = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  nested,
                  locale,
                  true,
                  nested,
                  newsheet
                );
                newEntry[nested][field.uid] = newgroupValues;
              } else {
                let nestedUid = `${uid}[${nested}].${field.uid}`;
                let newsheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newgroupValues = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  nested,
                  locale,
                  true,
                  nested,
                  newsheet
                );
                newEntry[nested][field.uid] = newgroupValues;
              }
            } else if (
              field.data_type === "reference" ||
              field.data_type === "json" ||
              field.data_type === "link"
            ) {
              continue;
            } else {
              col++;
              newEntry[nested][field.uid] = newValues[col];
            }
          }
        }
      }
    }
  } else {
    if (newEntry) {
      if (nstd) {
        let nstdAllValues = sheet
          .getRange(2, 1, sheet.getLastRow(), schema.schema.length + 1)
          .getValues();
        let filteredValues = nstdAllValues.filter(
          (item) => item[0] === entry.uid
        );

        let col = 0;
        for (let schemaPos = 0; schemaPos < schema.schema.length; schemaPos++) {
          const field = schema.schema[schemaPos];
          if (filteredValues && filteredValues.length) {
            if (blocks >= index) {
              let newValues = filteredValues[index];
              if (newValues) {
                if (field.data_type === "group") {
                  continue;
                } else if (field.data_type === "blocks") {
                  continue;
                } else if (field.data_type === "file") {
                  if (newEntry[nested][field.uid] !== null) {
                    newEntry[field.uid] = newEntry[field.uid]["uid"];
                  } else {
                    continue;
                  }
                } else if (
                  field.data_type === "global_field" ||
                  field.data_type === "reference" ||
                  field.data_type === "json" ||
                  field.data_type === "link"
                ) {
                  continue;
                } else {
                  col++;
                  newEntry[field.uid] = newValues[col];
                }
              }
            }
          }
        }
      } else {
        let newAllValues = sheet
          .getRange(2, 1, sheet.getLastRow(), schema.schema.length + 1)
          .getValues();
        let filteredValues = newAllValues.filter(
          (item) => item[0] === entry.uid
        );
        if (filteredValues && filteredValues.length) {
          let col = 0;
          for (
            let schemaPos = 0;
            schemaPos < schema.schema.length;
            schemaPos++
          ) {
            const field = schema.schema[schemaPos];
            if (field === null) {
              continue;
            } else if (field.data_type === "group") {
              if (field.multiple) {
                let nestedUid = `${uid}.${field.uid}`;
                let sheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newGroupValue = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  index,
                  locale,
                  false,
                  "",
                  sheet
                );
                newEntry[field.uid] = newGroupValue;
              } else {
                let nestedUid = `${uid}.${field.uid}`;
                let sheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newGroupValue = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  index,
                  locale,
                  false,
                  "",
                  sheet
                );
                newEntry[field.uid] = newGroupValue;
              }
            } else if (field.data_type === "blocks") {
              continue;
            } else if (field.data_type === "file") {
              if (newEntry[field.uid] !== null) {
                newEntry[field.uid] = newEntry[field.uid]["uid"];
              } else {
                continue;
              }
            } else if (field.data_type === "global_field") {
              if (field.multiple) {
                let nestedUid = `${uid}.${field.uid}`;
                let sheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newGroupValue = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  index,
                  locale,
                  false,
                  "",
                  sheet
                );
                newEntry[field.uid] = newGroupValue;
              } else {
                let nestedUid = `${uid}.${field.uid}`;
                let sheet = activeSpreadsheet.getSheetByName(
                  `${locale}/${uid}.${field.uid}`
                );
                let newGroupValue = getGroupEntriesForSaving(
                  entry,
                  nestedUid,
                  field,
                  index,
                  locale,
                  false,
                  "",
                  sheet
                );
                newEntry[field.uid] = newGroupValue;
              }
            } else if (
              field.data_type === "reference" ||
              field.data_type === "json" ||
              field.data_type === "link"
            ) {
              continue;
            } else {
              col++;
              newEntry[field.uid] = filteredValues[0][col];
            }
          }
        }
      }
    }
  }
  return newEntry;
}

function getModulerEntriesForSaving(entry, uid, schema, index, locale) {
  for (let blocks = 0; blocks < schema.blocks.length; blocks++) {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = activeSpreadsheet.getSheetByName(
      `${locale}/${schema.uid}[${blocks}].${schema.blocks[blocks].uid}`
    );

    let newAllValues = sheet
      .getRange(
        2,
        1,
        sheet.getLastRow(),
        schema.blocks[blocks].schema.length + 1
      )
      .getValues();

    let filteredValues = newAllValues.filter((item) => item[0] === entry.uid);
    let newEntry = getData(entry, `${schema.uid}`);

    if (newEntry && newEntry.length > 0) {
      let indexofValues = 0;
      for (let i = 0; i < newEntry.length; i++) {
        if (Object.keys(newEntry[i])[0] === schema.blocks[blocks].uid) {
          let newValues = filteredValues[indexofValues];
          let col = 0;
          if (newEntry[i][schema.blocks[blocks].uid]) {
            for (
              let schemaPos = 0;
              schemaPos < schema.blocks[blocks].schema.length;
              schemaPos++
            ) {
              const field = schema.blocks[blocks].schema[schemaPos];
              if (field.data_type === "group") {
                if (field.multiple) {
                  let newUid = `${schema.uid}[${blocks}].${schema.blocks[blocks].uid}.${field.uid}`;
                  let sheet = activeSpreadsheet.getSheetByName(
                    `${locale}/${newUid}`
                  );
                  let newValue = getGroupEntriesForSaving(
                    entry,
                    newUid,
                    field,
                    i,
                    locale,
                    true,
                    blocks,
                    sheet
                  );
                  newEntry[i][schema.blocks[blocks].uid][field.uid] = newValue;
                } else {
                  let newUid = `${schema.uid}[${blocks}].${schema.blocks[blocks].uid}.${field.uid}`;
                  let sheet = activeSpreadsheet.getSheetByName(
                    `${locale}/${newUid}`
                  );
                  let newValue = getGroupEntriesForSaving(
                    entry,
                    newUid.replace(`[${blocks}]`, `[${i}]`),
                    field,
                    indexofValues,
                    locale,
                    true,
                    i,
                    sheet
                  );
                  newEntry[i][schema.blocks[blocks].uid][field.uid] = newValue;
                }
              } else if (field.data_type === "blocks") {
                continue;
              } else if (field.data_type === "file") {
                if (
                  newEntry[i][schema.blocks[blocks].uid][field.uid] !== null
                ) {
                  newEntry[i][schema.blocks[blocks].uid][field.uid] =
                    newEntry[i][schema.blocks[blocks].uid][field.uid]["uid"];
                } else {
                  continue;
                }
              } else if (
                field.data_type === "global_field" ||
                field.data_type === "reference" ||
                field.data_type === "json" ||
                field.data_type === "link"
              ) {
                continue;
              } else {
                col++;
                if (newValues && newValues.length) {
                  newEntry[i][schema.blocks[blocks].uid][field.uid] =
                    newValues[col];
                }
              }
            }
          }
          indexofValues++;
        }
      }
    }
    entry[schema.uid] = newEntry;
  }

  return entry[schema.uid];
}
