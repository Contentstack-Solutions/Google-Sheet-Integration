function createOrganizationsCard() {
  const user = getCurrentUser();
  const orgSection = CardService.newCardSection().setHeader("Organizations");
  if (user) {
    const orgButtons = createOrganizationButtons(user);

    for (const button of orgButtons) {
      orgSection.addWidget(button);
    }

    const card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle(
            `Hi, ${capitlizeFirst(user.first_name)} ${capitlizeFirst(
              user.last_name
            )}!`
          )
          .setImageStyle(CardService.ImageStyle.CIRCLE)
          .setImageUrl(SMALL_LOGO)
      )
      .addSection(logOutButton())
      .addSection(orgSection)
      .build();

    return card;
  }
}

function createOrganizationButtons(user) {
  const organizations = user.organizations;
  sortByProp(organizations, "name");

  const buttons = [];

  for (const org of organizations) {
    const action = CardService.newAction()
      .setFunctionName("onOrganizationClicked")
      .setParameters({ name: org.name, uid: org.uid });
    const button = CardService.newTextButton()
      .setText(org.name)
      .setOnClickAction(action);

    buttons.push(button);
  }

  return buttons;
}

function onOrganizationClicked(e) {
  const user = getCurrentUser();
  const response = cmaGetStacks(user.authtoken, e.parameters.uid);
  setFetchButton(true);

  setCurrentOrg({ name: e.parameters.name, uid: e.parameters.uid });
  setOrgStacks(response.stacks);

  const stacksCard = createStacksCard();
  const nav = CardService.newNavigation().pushCard(stacksCard);

  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}

function capitlizeFirst(str) {
  if (!str) return;
  return str.match("^[a-z]")
    ? str.charAt(0).toUpperCase() + str.substring(1)
    : str;
}
