if (typeof window == 'undefined') {
  // We are in nodejs, simulate the browser environment
  const jsdom = require("jsdom");
  const {JSDOM} = jsdom;
  const dom = new JSDOM();
  var {window} = dom.window;
}

function find_key(object, value) {
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value)
        return prop;
    }
  }
  return "undefined";
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
    if (typeof this.handlerOverride != "undefined") {
      this.handlerOverride(selElem, sel);
    } else {
      this.on_selection__default(selElem, sel);
    }
  }

  on_selection__default(selElem, sel) {
    const elem_name = find_key(this.shifts.select_elem, selElem);
    if (typeof this.shifts.events[elem_name] === "undefined") {
      throw Error(`Element "${elem_name}" doesn't have any events`);
    }
    if (typeof this.shifts.events[elem_name][sel] === "undefined") {
      throw Error(`"${sel}" choice is not defined under element "${elem_name}"`);
    }

    let child;
    this.shifts.events[elem_name][sel].forEach((elem) => {
      elem.innerHTML = "";
    });
    this.shifts.events[elem_name][sel].forEach((choice) => {
      child = window.document.createElement("option");
      child.value = choice.add;
      child.innerText = choice.add;
      choice.sE.appendChild(child);
    });
  }

  override_on_selection(handler) {
    if (! handler instanceof Function) {
      throw TypeError("Handler must be a function");
    }
    this.handlerOverride = handler;
    handler(this);
  }
}

class Choice {
  constructor(selElem, addition) {
    if (! selElem instanceof window.HTMLElement || ! addition instanceof String) {
      throw TypeError("Invalid type of selElem or addition");
    }
    this.sE = selElem;
    this.add = addition;
  }
}


module.exports = { SelectionOrder: SelectionOrder, Choice: Choice};