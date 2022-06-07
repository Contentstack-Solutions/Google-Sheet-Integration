function setTabColor(sheet, locale) {
  TAB_COLOR.forEach((item) => {
    if (item.locale === locale) {
      sheet.setTabColor(item.color);
    }
  });
}
