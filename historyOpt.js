//not done
console.clear('console is cleared');

const seller = document.getElementsByClassName('dropdown-toggle')[1].innerText; // = "Продавец "

if (seller == "Продавец ") {

    console.log('good');

const total = document.getElementsByClassName(
    'rubl')[0];
const commentIcon = document.getElementsByClassName('history-action-link order-comment')[0]; //.after text прибыль
let goods = document.getElementsByClassName('history-descr-content');
// goods[i].getEmlementsByTag('a') href
let price = document.getElementsByClassName("history-price-num");
let quantity = document.getElementsByClassName('history-quantity');

//Нужно делать через серч поиск цены розница

} else {
    console.log('bad, seller is: ' + seller);
}