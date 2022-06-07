function onLogOut() {
  const section = CardService.newCardSection();
  const action = CardService.newAction().setFunctionName("loginCallback");
  // const login_button = CardService.newTextButton().setOnClickAction(action).setText(whitespaces +'Login'+ whitespaces)
  // .setTextButtonStyle(CardService.TextButtonStyle.FILLED).setBackgroundColor(THEME_COLOR);
  const login_button = CardService.newDecoratedText()
    .setTopLabel("Hello")
    .setText("Login Into Contentstack")
    .setIconUrl(SMALL_LOGO)
    .setButton(
      CardService.newImageButton()
        .setAltText("Login")
        .setIconUrl(LOGIN_LOGO)
        .setOnClickAction(action)
    );
  section.addWidget(login_button);
  section.addWidget(CardService.newDivider());

  const card = CardService.newCardBuilder()
    // .setHeader(
    // CardService.newCardHeader()
    //     .setTitle("Please Login First")
    //     .setImageStyle(CardService.ImageStyle.CIRCLE)
    //     .setImageUrl(SMALL_LOGO))
    .addSection(section)
    .build();

  return card;
}

function loginCallback(e) {
  const html = HtmlService.createHtmlOutputFromFile("LoginForm");
  html.setTitle("Log in to Contentstack");
  SpreadsheetApp.getUi().showSidebar(html);

  const homepage = onHomepage();
  const actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popToRoot().updateCard(homepage))
    .setStateChanged(true)
    .build();
  return actionResponse;
}
