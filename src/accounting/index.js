// src/accounting/index.js
// Node.js implementation of the COBOL Student Account Management System
// Preserves original business logic, data integrity, and menu options

const fs = require('fs');
const readline = require('readline');
const BALANCE_FILE = './balance.json';
const DEFAULT_BALANCE = 1000.00;

function readBalance() {
  if (!fs.existsSync(BALANCE_FILE)) {
    fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: DEFAULT_BALANCE }));
    return DEFAULT_BALANCE;
  }
  const data = fs.readFileSync(BALANCE_FILE, 'utf8');
  return JSON.parse(data).balance;
}

function writeBalance(newBalance) {
  fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: newBalance }));
}

async function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = await new Promise(res => rl.question('Enter your choice (1-4): ', res));

    switch (choice.trim()) {
      case '1':
        handleViewBalance();
        break;
      case '2':
        await handleCredit(rl);
        break;
      case '3':
        await handleDebit(rl);
        break;
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
  rl.close();
}

function handleViewBalance() {
  const balance = readBalance();
  console.log(`Current balance: ${balance.toFixed(2)}`);
}

async function handleCredit(rl) {
  const amountStr = await new Promise(res => rl.question('Enter credit amount: ', res));
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount < 0) {
    console.log('Invalid amount.');
    return;
  }
  let balance = readBalance();
  balance += amount;
  writeBalance(balance);
  console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
}

async function handleDebit(rl) {
  const amountStr = await new Promise(res => rl.question('Enter debit amount: ', res));
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount < 0) {
    console.log('Invalid amount.');
    return;
  }
  let balance = readBalance();
  if (balance >= amount) {
    balance -= amount;
    writeBalance(balance);
    console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

if (require.main === module) {
  mainMenu();
}

// Export for testing
module.exports = {
  readBalance,
  writeBalance
};
