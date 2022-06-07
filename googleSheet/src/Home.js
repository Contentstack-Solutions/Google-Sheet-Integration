function onHomepage() {
  const user = getCurrentUser();
  if (user && Object.keys(user).length > 0) {
    return createOrganizationsCard();
  } else {
    return onLogOut();
  }
}
