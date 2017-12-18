
let elem = $('.header-wrap');
let elem2 = $('#footer');
let elem3 = $('.chat-item');
let elem4 = $('.target_zapis_na_sto');
let rows = $('#costOfWorkList tbody tr');
let el = '';
let el1 = '';
let el2 = 0;
let el3 = 0;
let el4 = '';
let el5 = '';

elem.remove();
elem2.remove();
elem3.remove();
elem4.remove();

$.each(rows, function (index, value) {
  
  if (index != this.length) {
    el = value.cells[1].textContent ;
    el1 = el.replace(' ', '');
    el2 = parseInt(el1);
    if (el2 >= 30000) {
      el3 = roundDown(el2, 7000);
    } else if (el2 >= 20000) {
      el3 = roundDown(el2, 5000);
    } else if (el2 >= 13000) {
      el3 = roundDown(el2, 4000);
    } else if (el2 >= 8000){
      el3 = roundDown(el2, 2000);
    } else if (el2 >= 4500){
      el3 = roundDown(el2, 1500);
    } else if (el2 >= 3000){
      el3 = roundDown(el2, 800);
    } else if (el2 >= 1500){
      el3 = roundDown(el2, 500);
    } else if (el2 >= 900){
      el3 = roundDown(el2, 300);
    } else if (el2 == 737){
      el3 = 700;
    } else if (el2 == 550){
      el3 = 650;
    } else if (el2 >= 500){
      el3 = roundDown(el2, 150);
   } else if (el2 >= 250){
      el3 = roundDown(el2, 50);
    } else {
      el3 = el2;
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
  if (index > this.length) {
  //  Reload();
  };

  if (index != this.length) {
    el = value.cells[1].textContent ;
    el1 = el.replace(' ', '');
    el2 = parseInt(el1);
    if (el2 >= 30000) {
      el3 = roundDown(el2, 7000);
    } else if (el2 >= 20000) {
      el3 = roundDown(el2, 5000);
    } else if (el2 >= 13000) {
      el3 = roundDown(el2, 4000);
    } else if (el2 >= 8000){
      el3 = roundDown(el2, 2000);
    } else if (el2 >= 4500){
      el3 = roundDown(el2, 1500);
    } else if (el2 >= 3000){
      el3 = roundDown(el2, 800);
    } else if (el2 >= 1500){
      el3 = roundDown(el2, 500);
    } else if (el2 >= 900){
      el3 = roundDown(el2, 300);
    } else if (el2 == 737){
      el3 = 700;
    } else if (el2 == 550){
      el3 = 650;
    } else if (el2 >= 500){
      el3 = roundDown(el2, 150);
   } else if (el2 >= 250){
      el3 = roundDown(el2, 50);
    } else {
      el3 = el2;
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

//дожидаемся полной загрузки страницы
  
      //получаем идентификатор элемента
      let a = $('.target-add-work');
    
     // Document.getElementsByClassName('.target-add-work').addEventListener('click',Reload);
     console.log(document.getElementsByClassName('target-add-work').onclick);
     
      //вешаем на него событие
      /*a.onclick = function() {
          //производим какие-то действия
          a = Reload;
          //предотвращаем переход по ссылке href
      };*/

      function roundDown(num, precision){
        return Math.floor(num - precision);
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

      function Reload() {
        window.location.reload();
      };