function referenceButton(currentContentType, path) {
  const result = [];
  const buttons = [];

  for (let i = 0; i < path.length; i++) {
    let data = getData(
      currentContentType,
      path[i].replace(".reference_to", "")
    );
    if (data && data.data_type === "reference") {
      if (typeof data.reference_to === "string") {
        let uid = data.reference_to.toString();
        // const action = CardService.newAction()
        //   .setFunctionName("onClickReference")
        //   .setParameters({ title: uid, uid: uid });
        // const button = CardService.newTextButton()
        //   .setText(data.reference_to)
        //   .setOnClickAction(action);
        result.push(uid);
      } else {
        for (let ref = 0; ref < data.reference_to.length; ref++) {
          let uid = data.reference_to[ref].toString();
          // const action = CardService.newAction()
          //   .setFunctionName("onClickReference")
          //   .setParameters({ title: uid, uid: uid });
          // const button = CardService.newTextButton()
          //   .setText(data.reference_to[ref])
          //   .setOnClickAction(action);
          // buttons.push(button);
          result.push(uid);
        }
      }
    }
  }

  if (result.length > 0) {
    let uniqueChars = [...new Set(result)];
    if (uniqueChars && uniqueChars.length) {
      for (let i = 0; i < uniqueChars.length; i++) {
        const action = CardService.newAction()
          .setFunctionName("onClickReference")
          .setParameters({ title: uniqueChars[i], uid: uniqueChars[i] });
        const button = CardService.newTextButton()
          .setText(uniqueChars[i])
          .setOnClickAction(action);
        buttons.push(button);
      }
    }
  }
  return buttons;
}

function onClickReference(e) {
  const allContentTypes = getCurrentStackContentTypes();
  const prevContentType = getCurrentContentType();
  const currentContentType = allContentTypes.find(
    (r) => r.uid === e.parameters.uid
  );

  if (currentContentType) {
    if (prevContentType?.uid !== currentContentType.uid) {
      onDeleteSheetsClicked();
    }

    setCurrentContentType(currentContentType);
    const contentTypeFieldsCard = createRootContentTypeFieldsCard();
    const nav = CardService.newNavigation().updateCard(contentTypeFieldsCard);
    return CardService.newActionResponseBuilder().setNavigation(nav).build();
  } else {
    const user = getCurrentUser();
    const stack = getCurrentStack();
    const singleContenType = cmaGetSingleContentType(
      user.authtoken,
      stack.apiKey,
      e.parameters.uid
    );
    if (prevContentType?.uid !== singleContenType?.content_type?.uid) {
      onDeleteSheetsClicked();
    }
    setCurrentContentType(singleContenType.content_type);
    const contentTypeFieldsCard = createRootContentTypeFieldsCard();
    const nav = CardService.newNavigation().updateCard(contentTypeFieldsCard);
    return CardService.newActionResponseBuilder().setNavigation(nav).build();
  }
}
