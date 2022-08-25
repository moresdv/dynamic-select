const assert = require('chai').assert;
const main = require("../main.js");

// TODO: real shifts examples instead of null

describe('SelectionOrder', function () {
    it('Create a new SelectionOrder', function () {
        let o = new main.SelectionOrder(null);
    });

    it('Execute a setup function', function () {
        let o = new main.SelectionOrder(null, function () {
            assert.equal(this.shifts, null);
        });
    });
    it('Handler override', function () {
        let o = new main.SelectionOrder(null);
        o.handlerOverride = () => {return null};
        assert.equal(o.handlerOverride(), null)
    });
});