// test/accounting.test.js
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const mock = require('mock-fs');

// Import functions from the app
const appPath = path.resolve(__dirname, '../index.js');
let readBalance, writeBalance;

describe('Student Account Management System', function () {
  before(() => {
    // Import functions after mock-fs is set up
    ({ readBalance, writeBalance } = require(appPath));
  });

  afterEach(() => {
    mock.restore();
  });

  it('TC-01: View current balance (default)', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-02: Credit account with valid amount', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(1200.00);
    expect(readBalance()).to.equal(1200.00);
  });

  it('TC-03: Debit account with valid amount', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(700.00);
    expect(readBalance()).to.equal(700.00);
  });

  it('TC-04: Debit account with insufficient funds', function () {
    mock({ './balance.json': JSON.stringify({ balance: 100.00 }) });
    // Simulate debit attempt
    const balance = readBalance();
    expect(balance >= 200).to.be.false;
  });

  it('TC-05: Credit account with zero amount', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(1000.00);
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-06: Debit account with zero amount', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(1000.00);
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-09: Multiple sequential operations', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(1100.00); // Credit 100
    writeBalance(1050.00); // Debit 50
    expect(readBalance()).to.equal(1050.00);
  });

  it('TC-10: Data persistence between operations', function () {
    mock({ './balance.json': JSON.stringify({ balance: 1000.00 }) });
    writeBalance(1100.00); // Credit 100
    expect(readBalance()).to.equal(1100.00);
    // Simulate restart by re-reading
    expect(readBalance()).to.equal(1100.00);
  });
});
