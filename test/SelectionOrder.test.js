const assert = require('chai').assert;
const main = require("../main.js");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Choice = require("../main.js").Choice;

const dom = new JSDOM("<body><select id='example'><option value='Foo'>Foo</option></select><select id='example-two'><option></option><option></option></select></body>");
var {window} = dom.window;

describe('SelectionOrder', function () {
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
        assert.equal(o.handlerOverride(), null);
    });
});