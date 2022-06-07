// function onShowLoginDialog(e) {
//   let html = HtmlService
//     .createHtmlOutputFromFile('LoginForm')
//     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
//     .setWidth(500).setHeight(400);

//   SpreadsheetApp
//     .getUi()
//     .showModalDialog(html, 'Login');
//   return html;
// }

function onLoginClicked(email, password, base_url) {
  try {
    setRegionUrl(base_url);
    onDeleteSheetsClicked();
    const response = cmaLogin(email, password);
    setCurrentUser(response.user);
    return response;
  } catch (err) {
    setCurrentUser({});
    let msg = err.message.split("{")[1];
    let newmsg = msg.split(".")[0];
    let test = msg.split(".")[1];
    let finalMsg = `${newmsg},${test}"`;
    throw new Error(finalMsg.split(":")[1]);
  }
}
