if (typeof window == 'undefined') {
  // We are in nodejs, simulate the browser environment
  const jsdom = require("jsdom");
  const {JSDOM} = jsdom;
  const dom = new JSDOM();
  var {window} = dom.window;
}

class SelectionOrder {
  constructor(shifts, setup=null) {
    this.shifts = shifts;


    // Handles custom setup function
    if (setup instanceof Function) {
      setup.apply(null, shifts);
      setup();
    } else {
      this.setup__default();
    }
  }

  setup__default() {
    if (! this.shifts instanceof Object) {
      throw TypeError("Shifts is not an instance of Object");
    }
    if (typeof this.shifts.select_elem === "undefined") {
      /* Todo: In test case 3 of SelectionOrder.test.js if null supplied as shifts
           TypeError: Cannot read properties of null (reading 'select_elem') */
      throw TypeError("shifts.select_elem undefined");
    } if (typeof this.shifts.events === "undefined") {
      throw TypeError("shifts.events undefined");
    }
    Object.keys(this.shifts.select_elem).forEach((i) => {
      if (! this.shifts.select_elem[i] instanceof window.HTMLElement) {
        throw TypeError(`shifts.select_elem.${i} is not an instance of Element`);
      }
      this.shifts.select_elem[i].addEventListener("change", (event) => {
        this.on_selection(event.target, event.target.value);
      });
    })
  }

  on_selection(selElem, sel) {
    if (! typeof this.handlerOverride === "undefined") {
      this.handlerOverride(selElem, sel);
    } else {
      this.on_selection__default(selElem, sel);
    }
  }

  on_selection__default(selElem, sel) {
    // TODO: default selection handler
    return ;
  }

  override_on_selection(handler) {
    if (! handler instanceof Function) {
      throw TypeError("Handler must be a function");
    }
    this.handlerOverride = handler;
    handler(this);
  }
}

class AddChoice {
  constructor(selElem, addition) {
    if (! selElem instanceof window.HTMLElement || ! addition instanceof String) {
      throw TypeError("Invalid type of selElem or addition");
    }
    this.sE = selElem;
    this.add = addition;
  }

  get addition() {return this.add}
  get selElem() {return this.sE}
}


module.exports = { SelectionOrder: SelectionOrder, AddChoice: AddChoice};