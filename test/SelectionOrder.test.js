const assert = require('chai').assert;
const main = require("../main.js");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const AddChoice = require("../main.js").AddChoice;

const dom = new JSDOM("<body></body>");

describe('SelectionOrder', function () {
    const elem = dom.window.document.createElement("p");
    dom.window.document.body.appendChild(elem);
    const shifts = {
        select_elem: {
            "2": elem
        },
        events: {
            "1": {
                "Foo": new AddChoice(this.select_elem, "Bar")
            }
        }
    };
    it('Create a new SelectionOrder', function () {
        let o = new main.SelectionOrder(shifts);
    });
    it('Execute a setup function', function () {
        let o = new main.SelectionOrder(null, function () {
            assert.equal(this.shifts, null);
        });
    });
    it('Handler override', function () {
        let o = new main.SelectionOrder(shifts);
        o.handlerOverride = () => {return null};
        assert.equal(o.handlerOverride(), null)
    });
});