function searchContentType() {
  const section = CardService.newCardSection();
  const action = CardService.newAction().setFunctionName("OnSearchClick");
  const textInput = CardService.newTextInput()
    .setFieldName("search")
    .setTitle("Search Content-Type");
  const textButton = CardService.newTextButton()
    .setText("Search")
    .setOnClickAction(action);
  section.addWidget(textInput);
  section.addWidget(textButton);
  return section;
}

function OnSearchClick(e) {
  if (e.formInput.search) {
    let regExp = /[^a-z]/g;
    let newString = e.formInput.search.toLowerCase().replace(regExp, "");
    if (newString !== "") {
      const user = getCurrentUser();
      const stack = getCurrentStack();
      // let page = getTotalCount();
      // let skip = page.skip >= 15 ? page.skip - 15 : 0;

      // if (page.count > skip + page.limit) {
      const ctResponse = cmaGetContentTypes(
        user.authtoken,
        stack.apiKey,
        0,
        15,
        newString
      );
      console.log(ctResponse);
      if (ctResponse && ctResponse.content_types.length) {
        setTotalCount({
          count: ctResponse.count,
          skip: 0,
          limit: 15,
        });
        setCurrentStackContentTypes(ctResponse.content_types);
        const ContentTypesCard = createContentTypesCard(true);
        const actionResponse = CardService.newActionResponseBuilder()
          .setNavigation(
            CardService.newNavigation().updateCard(ContentTypesCard)
          )
          .setStateChanged(true)
          .build();
        return actionResponse;
      } else {
        Browser.msgBox("no Data found");
      }
      // }
    }
  }
}
