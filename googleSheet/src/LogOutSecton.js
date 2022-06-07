function logOutButton() {
  const action = CardService.newAction().setFunctionName("onLogOutClicked");
  return CardService.newCardSection().addWidget(
    CardService.newDecoratedText()
      .setText("Logout From Contentstack")
      .setButton(
        // CardService.newTextButton().setText("logout").setOnClickAction(action)
        CardService.newImageButton()
          .setAltText("Logout")
          .setIconUrl(LOGOUT_LOGO)
          .setOnClickAction(action)
      )
  );
}

function onLogOutClicked() {
  onDeleteSheetsClicked();
  setCurrentUser({});
  const logout = onLogOut();
  const actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popToRoot().updateCard(logout))
    .setStateChanged(true)
    .build();
  return actionResponse;
}
