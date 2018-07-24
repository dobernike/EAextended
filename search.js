var profile = document.getElementsByClassName('dropdown-toggle')[1].innerText;

if (profile == 'Продавец ') {
    //  console.clear('console clear');
    var setIntervalId = setInterval(function () {

        var h3 = document.getElementsByTagName('h3')[0];

        if (h3 && h3.innerText === 'Основной склад') {

            clearInterval(setIntervalId);

            var opt = document.getElementsByClassName('old-listing-group')[0];
            var price = opt.getElementsByClassName('old-appraise-item-price use-price-level blue');
            var itemName = opt.getElementsByClassName('old-appraise-item-description')[1].innerText;
            itemName = itemName.match(/\Масло/);
            var info = opt.getElementsByClassName('fa fa-info-circle');

            for (var i = 0; i < price.length; i++) {

                var eaPrice = Number(price[i].getAttribute('data-price-ea').replace(' ', ''));
                var optPrice = Number(price[i].getAttribute('data-price-opt').replace(' ', ''));
                // console.log(typeof eaPrice);
                // console.log(eaPrice);
                if (itemName && itemName[0].toLowerCase() === 'масло') {
                    price[i].innerText = roundDown(eaPrice, 50);
                } else {

                    var newPrice = roundUp(eaPrice * 0.85, 50);
                    var newFixedPrice = roundDown(eaPrice, 50);
                    if (newPrice > optPrice) {
                        price[i].innerText = newPrice;
                    } else if (newFixedPrice > optPrice) {
                        price[i].innerText = newFixedPrice;
                    }
                    // console.log('newPrice : ' + newPrice);
                }
                var profit = Number(price[i].innerText) - optPrice;
                console.log('Прибыль = ' + profit);

            }

        }

    }, 100);

} else {
    console.log('Включи продавец');
}

function roundUp(num, precision) {
    return Math.round(num / precision) * precision;
}

function roundDown(num, precision) {
    return Math.floor(num / precision) * precision;
}