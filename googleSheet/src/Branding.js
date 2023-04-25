const SMALL_LOGO =
  "https://images.contentstack.io/v3/assets/blt1c11a1ad74628afa/bltef44905e337f6f93/6447743331281610d8efa1d9/00000163-51db-5cf5-2090-5c4936ef029e_(2).jpg";
const SHEET_HEADER_BG = "#6c5ce7";
const SHEET_HEADER_FG = "#FFFFFF";
const SHEET_HEADER_FONT_SIZE = 11;
const THEME_COLOR = "#6c5ce7";
const CSV_BACKEND = "add your aws url";

const LOGIN_LOGO =
  "https://images.contentstack.io/v3/assets/blt768ba725e641b87f/blt078d12688636f0c0/624592f4f9d6630f26a71c7e/outline_login_black_24dp.png";

const LOGOUT_LOGO =
  "https://images.contentstack.io/v3/assets/blt768ba725e641b87f/blt4434e70dfe4ae64e/6245939b7aaaae0f340345c6/outline_logout_black_24dp.png";

const SEARCH_LOGO =
  "https://images.contentstack.io/v3/assets/blt768ba725e641b87f/blt8c54b817d7f237b3/6245975971dd7f0f223e882f/outline_search_black_24dp.png";

const CLEAR_LOGO =
  "https://images.contentstack.io/v3/assets/blt768ba725e641b87f/blt3154c0c77f6502d9/624595217aaaae0f340345ce/outline_layers_clear_black_24dp.png";
const TAB_COLOR = [
  {
    locale: "en-us",
    color: "#ff132f",
  },
  {
    locale: "fr",
    color: "#8a0890",
  },
  {
    locale: "hi-in",
    color: "#ff7e22",
  },
  {
    locale: "de",
    color: "#96ed2d",
  },
  {
    locale: "fr-ch",
    color: "#ad4918",
  },
  {
    locale: "fr-fr",
    color: "#ffed23",
  },
];

const fieldsToBeIgnoreWhileUpdatingEntry = [
  "locale",
  "created_by",
  "updated_by",
  "created_at",
  "updated_at",
  "ACL",
  "_version",
  "_in_progress",
  "_metadata",
  "_version",
  "tags",
  "file_size",
  "is_dir",
  "parent_uid",
  "filename",
];

const CHECKED_UIDS = ["title", "url", "uid"];
