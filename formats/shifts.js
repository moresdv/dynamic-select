const AddChoice = require("../main.js").AddChoice;

/* Assuming that the html has a form with a select field with the id select-1 */

let shifts = {
  "select_elem": {
    "2": document.getElementById("select-1")
  },
  "events": {
    "1": {
      "Foo": new AddChoice(this.events["2"], "Bar")
    }
  }
};