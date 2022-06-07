function selectLocale() {
  const user = getCurrentUser();
  const stack = getCurrentStack();
  const data = cmaGetLocale(user.authtoken, stack.apiKey);
  const localeSection =
    CardService.newCardSection().setHeader("Select Locales");

  const checkboxGroup = CardService.newSelectionInput();
  checkboxGroup
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setFieldName("locale_check")
    .setOnChangeAction(
      CardService.newAction().setFunctionName("checkedLocale")
    );
  for (locale of data.locales) {
    if (locale.code === "en-us") {
      setCurrentLocales("en-us");
    }
    checkboxGroup.addItem(
      locale.name,
      locale.code,
      locale.code === "en-us" ? true : false
    );
  }

  // const localeControls = createCheckBox(data);
  // for(const chackBox of  localeControls ) {
  //   localeSection.addWidget(chackBox)
  // }
  return localeSection.addWidget(checkboxGroup);
}

function checkedLocale(e) {
  if (e.formInput.locale_check) setCurrentLocales(e.formInput.locale_check);
}

function createCheckBox(data) {
  const localCheck = [];
  for (const locale of data.locales) {
    let fieldControl = CardService.newDecoratedText()
      .setText(locale.name)
      .setWrapText(true);
    fieldControl.setSwitchControl(
      CardService.newSwitch()
        .setFieldName(locale.code)
        .setValue(true)
        .setSelected(locale.code === "en-us" ? true : false)
        .setControlType(CardService.SwitchControlType.SWITCH)
    );
    localCheck.push(fieldControl);
  }
  return localCheck;
}
