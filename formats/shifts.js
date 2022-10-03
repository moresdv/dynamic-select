const Choice = require("dynamic-select").Choice;

/* Assuming that the html has a form with a select field with the id select-1 */

const shifts = {
  select_elem: {
    1: window.document.getElementById("example"),
    2: window.document.getElementById("example-two")
  },
  events: {
    1: {}
  }
};
shifts.events["1"].Foo = [new Choice(shifts.select_elem["2"], "Bar")]
shifts.events["1"].Spam = [new Choice(shifts.select_elem["2"], "Eggs")]
shifts.events["1"].Metal = [
  new Choice(shifts.select_elem["2"], "Aluminum"),
  new Choice(shifts.select_elem["2"], "Plumb"),
  new Choice(shifts.select_elem["2"], "Silver"),
  new Choice(shifts.select_elem["2"], "Gold")
]
const ds = new SelectionOrder(shifts);