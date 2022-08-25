class SelectionOrder {
  constructor(shifts, setup=null) {
    this.shifts = shifts;

    // Handles custom setup function
    if (setup instanceof Function) {
      setup.apply(null, shifts);
      setup();
    } else {
      this.#setup__default();
    }
  }

  #setup__default() {
    if (! this.shifts instanceof Object) {
      throw TypeError("Shifts is not an instance of Object");
    }
    for (let i in Object.keys(this.shifts.select)) {
      if (! this.shifts.select[i] instanceof Element) {
        throw TypeError(`shifts.select.${i} is not an instance of Element`);
      }
      // TODO: add event listeners
      /* this.shifts.select[i].addEventListener("change", (event) => {
        this.#on_selection__default(event.target, event.target.value);
      }); */
    }
  }

  #on_selection__default() {
    // TODO: default selection handler
  }

  on_selection(selElem, sel) {
    if (! selElem instanceof Element)
    if (! this.handlerOverride instanceof undefined) {
      this.handlerOverride();
    } else {
      this.#on_selection__default();
    }
  }

  override_on_selection(handler) {
    if (! handler instanceof Function) {
      throw TypeError("Handler must be a function");
    }
    this.handlerOverride = handler;
    handler(this);
  }
}

module.exports = { SelectionOrder: SelectionOrder };
