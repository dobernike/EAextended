console.clear('console clear')
const elem = document.getElementsByClassName('header-wrap')[0].remove();
const elem2 = document.getElementById('footer').remove();
const elem3 = document.getElementsByClassName('chat-item')[0].remove();
const elem4 = document.getElementsByClassName('target_zapis_na_sto')[0].remove();
const rows = document.querySelectorAll('#costOfWorkList tbody tr');
const rows2 = document.querySelectorAll('#workListSelected tbody tr');
const button = document.getElementsByClassName('target-add-work');
const buttonRemove = document.getElementsByClassName('btn-primary');
console.log(buttonRemove);
let totalArray = [];

getPrice(rows);
getPrice(rows2);

if (totalArray.length != 0) {
  let total = totalArray.reduce(function (a, b) {
    return a + b;
  });
  let total1 = total + "";
  let summ = NumSplitter(total1);
  document.querySelectorAll('span#work-sum')[0].innerText = summ;
}

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", someOtherFunction);
}

for (let i = 1; i < buttonRemove.length; i++) {
  buttonRemove[i].addEventListener("click", someOtherFunction);
}

//functions
function someOtherFunction() {
  document.location.reload( /*true*/ )
}

function getPrice(array) {
  array.forEach(value => {
    if (value.cells[1]) {
      el = value.cells[1].textContent.replace(' ', '');
      el2 = parseInt(el);
      if (el2 >= 30000) {
        el3 = roundDown(el2, 7000);
      } else if (el2 >= 20000) {
        el3 = roundDown(el2, 5000);
      } else if (el2 >= 13000) {
        el3 = roundDown(el2, 4000);
      } else if (el2 >= 8000) {
        el3 = roundDown(el2, 2000);
      } else if (el2 >= 4500) {
        el3 = roundDown(el2, 1500);
      } else if (el2 >= 3000) {
        el3 = roundDown(el2, 800);
      } else if (el2 >= 1500) {
        el3 = roundDown(el2, 500);
      } else if (el2 >= 900) {
        el3 = roundDown(el2, 300);
      } else if (el2 >= 500) {
        el3 = roundDown(el2, 150);
      } else if (el2 >= 250) {
        el3 = roundDown(el2, 50);
      } else {
        el3 = el2;
      }
      el4 = el3 + "";
      el5 = NumSplitter(el4);
      value.cells[1].textContent = el5;
      if (value.cells[2].innerText) {
        el6 = value.cells[2].textContent;
        el7 = parseInt(el6);
        el8 = el7 * el3;
        el9 = el8 + "";
        el10 = NumSplitter(el9);
        value.cells[3].textContent = el10;
        totalArray.push(el8);
      }
    }
  });
}

function NumSplitter(str) {
  return str
    .split("")
    .reverse()
    .join("")
    .replace(/(\d\d\d)/, " $1 ")
    .split("")
    .reverse()
    .join("");
}

function roundDown(num, precision) {
  return Math.floor(num - precision);
}