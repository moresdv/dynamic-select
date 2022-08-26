let shifts = {
  "select": {
    "1": document.GetElementById("select-one"),
    "2": document.GetElementById("select-two")
  },
  "events": {
    "1": {
      "Foo": Add("2", "Bar")
    }
  }
};