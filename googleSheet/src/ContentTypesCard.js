function createContentTypesCard(hide = false) {
  const stack = getCurrentStack();
  const contentTypes = getCurrentStackContentTypes();
  if (contentTypes && contentTypes.length) {
    sortByProp(contentTypes, "title");

    const ctSection = CardService.newCardSection().setHeader("Content Types");
    const ctButtons = createContentTypesButtons(contentTypes);

    for (const button of ctButtons) {
      ctSection.addWidget(button);
    }

    const getPrevContentAction = CardService.newAction().setFunctionName(
      "getPrevContentAction"
    );

    const getNextContentsAction = CardService.newAction().setFunctionName(
      "getNextContentsAction"
    );
    const fixedFooter = CardService.newFixedFooter();
    const card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle(stack.name)
          .setImageStyle(CardService.ImageStyle.CIRCLE)
          .setImageUrl(SMALL_LOGO)
      )
      .addSection(logOutButton())
      .addSection(searchContentType())
      .addSection(ctSection);

    if (hide === false) {
      fixedFooter
        .setSecondaryButton(
          CardService.newTextButton()
            .setText("Prev")
            .setBackgroundColor("#fff")
            .setOnClickAction(getPrevContentAction)
        )
        .setPrimaryButton(
          CardService.newTextButton()
            .setText("Next")
            .setBackgroundColor(THEME_COLOR)
            .setOnClickAction(getNextContentsAction)
        );
      card.setFixedFooter(fixedFooter);
    }

    return card.build();
  } else {
    const card = CardService.newCardBuilder()
      .setHeader(
        CardService.newCardHeader()
          .setTitle(stack.name)
          .setImageStyle(CardService.ImageStyle.CIRCLE)
          .setImageUrl(SMALL_LOGO)
          .setSubtitle("No content types!")
      )
      .addSection(logOutButton())
      .build();

    return card;
  }
}

function createContentTypesButtons(contentTypes) {
  const buttons = [];

  for (const contentType of contentTypes) {
    const action = CardService.newAction()
      .setFunctionName("onContentTypeClicked")
      .setParameters({ title: contentType.title, uid: contentType.uid });
    const button = CardService.newTextButton()
      .setText(contentType.title)
      .setOnClickAction(action);

    buttons.push(button);
  }

  return buttons;
}

function onContentTypeClicked(e) {
  const allContentTypes = getCurrentStackContentTypes();
  const prevContentType = getCurrentContentType();
  const currentContentType = allContentTypes.find(
    (r) => r.uid === e.parameters.uid
  );
  if (prevContentType?.uid !== currentContentType.uid) {
    onDeleteSheetsClicked();
  }
  setCurrentContentType(currentContentType);

  const contentTypeFieldsCard = createRootContentTypeFieldsCard();
  const nav = CardService.newNavigation().pushCard(contentTypeFieldsCard);

  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}

function getPrevContentAction() {
  const user = getCurrentUser();
  const stack = getCurrentStack();
  let page = getTotalCount();
  let skip = page.skip >= 15 ? page.skip - 15 : 0;

  if (page.skip > 0) {
    const ctResponse = cmaGetContentTypes(
      user.authtoken,
      stack.apiKey,
      skip,
      page.limit
    );
    setTotalCount({ count: page.count, skip: skip, limit: page.limit });
    setCurrentStackContentTypes(ctResponse.content_types);
  } else {
    Browser.msgBox("Please Click On Next Button For New Content Types!!");
  }
  const ContentTypesCard = createContentTypesCard(false);
  const actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(ContentTypesCard))
    .setStateChanged(true)
    .build();
  return actionResponse;
}

function getNextContentsAction() {
  const user = getCurrentUser();
  const stack = getCurrentStack();
  let page = getTotalCount();
  let skip = 15 + page.skip;

  if (page.count - skip > 0) {
    const ctResponse = cmaGetContentTypes(
      user.authtoken,
      stack.apiKey,
      skip,
      page.count - skip > 15 ? 15 : page.count - skip
    );
    setTotalCount({ count: page.count, skip: skip, limit: page.limit });
    setCurrentStackContentTypes(ctResponse.content_types);
  } else {
    Browser.msgBox("There is No More Content Types!!");
  }
  const ContentTypesCard = createContentTypesCard(false);
  const actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(ContentTypesCard))
    .setStateChanged(true)
    .build();
  return actionResponse;
}
