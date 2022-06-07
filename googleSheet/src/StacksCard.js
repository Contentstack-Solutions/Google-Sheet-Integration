function createStacksCard() {
  const stacks = getOrgStacks();
  if (stacks && stacks.length) {
    sortByProp(stacks, "name");

    const org = getCurrentOrg();

    const stackSection = CardService.newCardSection().setHeader("Stacks");

    const stackButtons = createStackButtons(stacks);

    for (const button of stackButtons) {
      stackSection.addWidget(button);
    }

    const card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle(org.name)
          .setImageStyle(CardService.ImageStyle.CIRCLE)
          .setImageUrl(SMALL_LOGO)
      )
      .addSection(logOutButton())
      .addSection(stackSection)
      .build();

    return card;
  } else {
    const org = getCurrentOrg();
    const card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle(org.name)
          .setImageStyle(CardService.ImageStyle.CIRCLE)
          .setImageUrl(SMALL_LOGO)
          .setSubtitle("You don't have permission of stacks.")
      )
      .addSection(logOutButton())
      .build();

    return card;
  }
}

function createStackButtons(stacks) {
  const buttons = [];

  for (const stack of stacks) {
    const action = CardService.newAction()
      .setFunctionName("onStackClicked")
      .setParameters({ name: stack.name, apiKey: stack.api_key });
    const button = CardService.newTextButton()
      .setText(stack.name)
      .setOnClickAction(action);

    buttons.push(button);
  }

  return buttons;
}

function onStackClicked(e) {
  let skip = 0;
  let limit = 15;
  const user = getCurrentUser();
  const ctResponse = cmaGetContentTypes(
    user.authtoken,
    e.parameters.apiKey,
    skip,
    limit
  );
  setTotalCount({ count: ctResponse.count, skip: skip, limit: limit });
  const envResponse = cmaGetEnvironments(user.authtoken, e.parameters.apiKey);
  setCurrentStack({ name: e.parameters.name, apiKey: e.parameters.apiKey });
  setCurrentStackContentTypes(ctResponse.content_types);
  setStackEnvironments(envResponse.environments);
  const contentTypesCard = createContentTypesCard(false);
  const nav = CardService.newNavigation().pushCard(contentTypesCard);

  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}
