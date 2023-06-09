'use strict';
const account1 = {
  owner: 'Minhaz Halim',
  movements: [200,455.23,-306.5,25000,-642.21,-133.9,79.97,1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000,3400,-150,-790,-3210,-1000,8500,-30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1,account2];
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApplication = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const buttonLogin = document.querySelector('.login__btn');
const buttonTransfer = document.querySelector('.form__btn--transfer');
const buttonLoan = document.querySelector('.form__btn--loan');
const buttonClose = document.querySelector('.form__btn--close');
const buttonSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const formatMovementDate = function (date,locale){
  const calculateDaysPassed = (date1,date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calculateDaysPassed(new Date(),date);
  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCurrency = function(value,locale,currency){
  return new Intl.NumberFormat(locale,{
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc,sort = false){
  containerMovements.innerHTML = "";
  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;
  movs.forEach(function (mov,i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date,acc.locale);
    const formattedMovement = formatCurrency(mov,acc.locale,acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};
const calculateDisplayBalance = function (acc){
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov,0);
  labelBalance.textContent = formatCurrency(acc.balance,acc.locale,acc.currency);
};
const calculateDisplaySummary = function (acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent = formatCurrency(incomes,acc.locale,acc.currency);
  const out = acc.movements.filter((mov) => mov < 0).reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = formatCurrency(Math.abs(out),acc.locale,acc.currency);
  const interest = acc.movements.filter((mov) => mov > 0).map((deposit) => (deposit * acc.interestRate) / 100).filter((int,i,arr) => {
      return int >= 1;
    }).reduce((acc,int) => acc + int,0);
  labelSumInterest.textContent = formatCurrency(interest,acc.locale,acc.currency);
};
const createUsernames = function (accs){
  accs.forEach(function (acc){
    acc.username = acc.owner.toLowerCase().split(" ").map(name => name[0]).join("");
  });
};
createUsernames(accounts);
const updateUI = function (acc){
  displayMovements(acc);
  calculateDisplayBalance(acc);
  calculateDisplaySummary(acc);
};
const startLogOutTimer = function (){
  const tick = function (){
    const minutes = String(Math.trunc(time / 60)).padStart(2,0);
    const seconds = String(time % 60).padStart(2,0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to Get Started';
      containerApplication.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick,1000);
  return timer;
};
let currentAccount;
let timer;
buttonLogin.addEventListener('click',function (event){
  event.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === +inputLoginPin.value){
    labelWelcome.textContent = `Welcome Back,${currentAccount.owner.split(" ")[0]}`;
    containerApplication.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});
buttonTransfer.addEventListener('click',function (event){
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
buttonLoan.addEventListener('click',function (event){
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)){
    setTimeout(function (){
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    },2500);
  }
  inputLoanAmount.value = "";
});
buttonClose.addEventListener('click',function (event){
  event.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin){
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    accounts.splice(index,1);
    containerApplication.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
let sorted = false;
buttonSort.addEventListener('click',function (event){
  event.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
});