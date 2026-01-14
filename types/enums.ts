enum UserState {
  defaults = 0,
  active = 1,
  Deactive = 2,
  Deleted = 3,
  Blacklist = 4,
  loginfailed = 100,
}

enum CheckEmailStatus {
  EmailNotfound = 0,
  EmailExists = 1,
}

export { CheckEmailStatus, UserState };

