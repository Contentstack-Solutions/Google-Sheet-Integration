function isGroupingField(field) {
  return field.data_type === "group" || field.data_type === "blocks";
}

function isSupportedFieldType(field) {
  const unsupported = ["file", "reference"];
  const match = unsupported.find((r) => r === field.data_type);
  return !match;
}

function isGlobalField(field) {
  try {
    if (field?.data_type) {
      return field.data_type === "global_field";
    } else {
      let keys = Object.keys(field);
      if (keys.length) {
        for (key of keys) {
          return key === "reference_to";
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function isFieldUid(field) {
  return field.data_type === "uid";
}

function getFieldDescription(field) {
  let description = "";

  if (field.field_metadata && field.field_metadata.description) {
    description = field.field_metadata.description;
  }

  return description;
}
