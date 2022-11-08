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

function right_side(seq, from) {
  const lower = seq.indexOf(from);
  if (lower === -1) {
    return lower;
  }
  return seq.slice(lower+1, seq.length);
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
    });
    Object.values(this.shifts.select_elem).forEach((selbox) => {
      let child = window.document.createElement("option");
      child.selected = true;
      child.className = "blank-opts-ds";
      selbox.insertBefore(child, selbox.firstChild);
    });
  }

  on_selection(selElem, sel) {
    if (typeof this.handlerOverride != "undefined") {
      this.handlerOverride(selElem, sel);
    } else {
      this.on_selection__default(selElem, sel);
    }
  }

  on_selection__default(selElem, sel) {
    if (sel === "") {
      return;
    }
    const elem_name = find_key(this.shifts.select_elem, selElem);
    if (typeof this.shifts.events[elem_name] === "undefined") {
      throw Error(`Element "${elem_name}" doesn't have any events`);
    }
    if (typeof this.shifts.events[elem_name][sel] === "undefined") {
      throw Error(`"${sel}" choice is not defined under element "${elem_name}"`);
    }
    right_side(Object.keys(this.shifts.select_elem), elem_name).forEach((selbox_name) => {
      this.shifts.select_elem[selbox_name].innerHTML = "";
    });
    let new_child;
    this.shifts.events[elem_name][sel].forEach((elem) => {
      if (Object.prototype.toString.call(elem) === "[object Ok]") {
        return; // May cause problems with adding to left-side selectboxes?
      }
      elem.sE.innerHTML = "";
      new_child = window.document.createElement("option");
      new_child.selected = true;
      new_child.className = "blank-opts-ds";
      elem.sE.insertBefore(new_child, elem.firstChild);
    });
    this.shifts.events[elem_name][sel].forEach((choice) => {
      if (Object.prototype.toString.call(choice) === "[object Ok]") {
        return; // Same as line 90
      }
      new_child = window.document.createElement("option");
      new_child.value = choice.add;
      new_child.innerText = choice.add;
      choice.sE.appendChild(new_child);
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
  get [Symbol.toStringTag]() {
    return 'Choice';
  }
}

class Ok {
  constructor(func, destructor) {
    this.func = func;
    this.args = arguments;
    this.destructor = destructor;
  }
  exec() {
    // May cause problems if no args provided
    this.func.apply(null, Array.from(this.args).slice(2));
  }
  get [Symbol.toStringTag]() {
    return 'Ok';
  }
  get destr() {
    return this.destructor;
  }
}

class ValidatedSelectionOrder extends SelectionOrder {
  constructor(shifts, submitter) {
    super(shifts);
    this.submitter = submitter;
    this.okay = false;
    this.handlerOverride = this.validated_on_selection__default;
    this.submitter.hidden = true;
  }
  validated_on_selection__default(selElem, sel) {
    this.okay = false;
    const elem_name = find_key(this.shifts.select_elem, selElem);
    this.shifts.events[elem_name][sel].forEach((member) => {
       if (Object.prototype.toString.call(member) === "[object Ok]") {
         this.okay = true;
         member.exec();
       }
    });
    this.on_selection__default(selElem, sel)
    if (this.okay) {
      this.submitter.hidden = false;
    }
  }
}

if (! (typeof module === "undefined")) {
  module.exports = {
    SelectionOrder: SelectionOrder,
    Choice: Choice,
    Ok: Ok,
    ValidatedSelectionOrder: ValidatedSelectionOrder,
  };
}