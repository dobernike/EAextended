function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
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

let rows = $('#costOfWorkList tbody tr');
let el = '';
let el1 = '';
let el2 = 0;
let el3 = 0;
let el4 = '';
let el5 = '';

$.each(rows, function (index, value) {
  
  if (index != rows.length) {
    el = value.cells[1].textContent ;
    el1 = el.replace(' ', '');
    el2 = parseInt(el1);
    if (el2 >= 30000) {
      el3 = roundDown(el2, 1000);
    } else if (el2 >= 10000) {
      el3 = roundDown(el2, 500);
    } else if (el2 >= 1000) {
      el3 = roundDown(el2, 250);
    } else {
      el3 = roundDown(el2, 50);
    };
    
    el4 = el3+"";
    el5 = NumSplitter(el4);
    value.cells[1].textContent = "Старая "+el+" Новая "+el5;
  };
});

let rows2 = $('#workListSelected tbody tr'); 
let el6 =0;
let el7 =0;
let el8 =0;
let el9 =0;
let el10 =0;
let el11 =0;
let el12 =0;
let array = [];

$.each(rows2, function (index, value) {
  
  if (index != rows2.length) {
    el = value.cells[1].textContent ;
    el1 = el.replace(' ', '');
    el2 = parseInt(el1);
    if (el2 >= 30000) {
      el3 = roundDown(el2, 1000);
    } else if (el2 >= 10000) {
      el3 = roundDown(el2, 500);
    } else if (el2 >= 1000) {
      el3 = roundDown(el2, 250);
    } else {
      el3 = roundDown(el2, 50);
    };
    
    el4 = el3+"";
    el5 = NumSplitter(el4);
    el6 = value.cells[2].textContent;
    el7 = parseInt(el6);
    el8 = el7*el3;
    el9 = el8+"";
    el10 = NumSplitter(el9);
    value.cells[1].textContent = el5;
    value.cells[3].textContent = el10;
    array.push(el8);
    
  };
});



let total = array.reduce(function(a, b) {
  return a + b;
});
let total1 = total + "";
let summ = NumSplitter(total1)
$('span#work-sum')[0].innerText = summ;
console.log(array);
console.log(total);

console.log(el11);
