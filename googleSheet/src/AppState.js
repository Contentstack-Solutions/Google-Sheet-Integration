const userProperties = PropertiesService.getUserProperties();

const USER_KEY = "user";
const ORG_STACKS_KEY = "stacks";
const STACK_KEY = "stack";
const ORG_KEY = "org";
const STACK_CT_KEY = "stack_cts";
const CT_KEY = "ct";
const ENVS_KEY = "envs";
const ENTRIES_KEY = "entries";
const DIRTY_KEY = "dirty";
const SCHEMA_STACK_KEY = "schema_stack";
const BASE_URL = "base_url";
const LOCALES = "locales";
const COUNT = "totalCount";
const FETCHBUTTON = "fetchButton";
const CT_DEL = "ct_delete";
const PATHS = "paths";
const LIST = "list";

function setRegionUrl(url) {
  userProperties.setProperty(BASE_URL, JSON.stringify(url));
}

function getRegionUrl() {
  return JSON.parse(userProperties.getProperty(BASE_URL));
}

function setCurrentUser(user) {
  userProperties.setProperty(USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(userProperties.getProperty(USER_KEY));
}

function setCurrentOrg(org) {
  userProperties.setProperty(ORG_KEY, JSON.stringify(org));
}

function getCurrentOrg() {
  return JSON.parse(userProperties.getProperty(ORG_KEY));
}

function setOrgStacks(stacks) {
  userProperties.setProperty(ORG_STACKS_KEY, JSON.stringify(stacks));
}

function getOrgStacks() {
  return JSON.parse(userProperties.getProperty(ORG_STACKS_KEY));
}

function setCurrentStack(stack) {
  userProperties.setProperty(STACK_KEY, JSON.stringify(stack));
}

function getCurrentStack() {
  return JSON.parse(userProperties.getProperty(STACK_KEY));
}

function setCurrentStackContentTypes(contentTypes) {
  userProperties.setProperty(STACK_CT_KEY, JSON.stringify(contentTypes));
}

function getCurrentStackContentTypes() {
  return JSON.parse(userProperties.getProperty(STACK_CT_KEY));
}

function setCurrentContentType(contentType) {
  userProperties.setProperty(CT_KEY, JSON.stringify(contentType));
}

function getCurrentContentType() {
  return JSON.parse(userProperties.getProperty(CT_KEY));
}

function setCurrentLocales(locale) {
  userProperties.setProperty(LOCALES, JSON.stringify(locale));
}

function getCurrentLocales() {
  return JSON.parse(userProperties.getProperty(LOCALES));
}

function setStackEnvironments(environments) {
  userProperties.setProperty(ENVS_KEY, JSON.stringify(environments));
}

function getStackEnvironments() {
  return JSON.parse(userProperties.getProperty(ENVS_KEY));
}

function setDraftEntries(entries) {
  userProperties.setProperty(ENTRIES_KEY, JSON.stringify(entries));
}

function getDraftEntries() {
  return JSON.parse(userProperties.getProperty(ENTRIES_KEY));
}

function setDirtyEntries(entries) {
  userProperties.setProperty(DIRTY_KEY, JSON.stringify(entries));
}

function getDirtyEntries() {
  return JSON.parse(userProperties.getProperty(DIRTY_KEY));
}

function setTotalCount(entries) {
  userProperties.setProperty(COUNT, JSON.stringify(entries));
}

function getTotalCount() {
  return JSON.parse(userProperties.getProperty(COUNT));
}

function setFetchButton(prop) {
  userProperties.setProperty(FETCHBUTTON, JSON.stringify(prop));
}

function getFetchButton() {
  return JSON.parse(userProperties.getProperty(FETCHBUTTON));
}

function setCurrentContentTypeDeleted(content_type) {
  userProperties.setProperty(CT_DEL, JSON.stringify(content_type));
}

function getCurrentContentTypeDeleted() {
  return JSON.parse(userProperties.getProperty(CT_DEL));
}
function setRemovedPath(paths) {
  userProperties.setProperty(PATHS, JSON.stringify(paths));
}

function getRemovedPath() {
  return JSON.parse(userProperties.getProperty(PATHS));
}

function setList(list) {
  userProperties.setProperty(LIST, JSON.stringify(list));
}

function getList() {
  return JSON.parse(userProperties.getProperty(LIST));
}
