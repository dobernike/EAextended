var profile = document.getElementsByClassName('dropdown-toggle')[1].innerText;
setTimeout(function () {
    if (profile == 'Продавец ') {
        console.clear('console clear');
        console.log(profile);
        var opt = document.getElementsByClassName('old-listing-group')[0];
        var price = opt.getElementsByClassName('old-appraise-item-price use-price-level blue');
        for (var i = 0; i < price.length; i++) {
            // var eaPrice = Number(price[i].getAttribute('data-price-ea').replace(' ', ''));
            // price[i].innerText = roundUp(eaPrice[i] * 0.85, 50);
        }
    } else {
        console.log('Включи продавец');
    }
}, 5000);

function roundUp(num, precision) {
    return Math.round(num / precision) * precision;
}