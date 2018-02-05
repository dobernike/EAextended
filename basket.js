let elId = document.getElementById('eaopt_opts_pricing');
let pricingEa = elId[1].getAttribute('selected');

///////////////////////////////////// Корзина: Основной склад ///////////////////////////////////////////
let priceEa = document.querySelectorAll('.eaOptList tbody tr');
// Проверка, что режим включен "EA розница" 
if (pricingEa == 'selected' && priceEa.length > 0) 
{
    
    console.log('I`m here');
    let priceEa = document.querySelectorAll('.eaOptList tbody tr');
    let x = 0;
    let price;
    let realSumm = document.getElementsByTagName('h3')[0].innerText.match(/Итого: \b(\d*)/)[1];

    switch(priceEa.length) { //костыль
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        timeout = 3600;
        console.log("5, timeout is: "+timeout);
        break;
        default:
        timeout = 4500;
        console.log("default, timeout is: "+timeout);
    }

    for (let i = 0; i < priceEa.length; i++) 
    {
        let firm = priceEa[i].cells[2].innerText;
        let art = priceEa[i].cells[3].innerText;
        let itemName = priceEa[i].cells[4].innerText;
        let cost = priceEa[i].cells[5].innerText;
        let url = "https://euroauto.ru/searchnr/"+art;
        let url2 = "https://euroauto.ru/firms/" + firm + "/" + art + "/";

        // cross xhr для выявления розничной цены
        getAjax(url, function(data){ 
           let price = data.match(
                /(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*?)<\/span>/
              );

              if (price) {
                price = price[2].replace(" ", "");

                if (itemName.toLowerCase().indexOf("масло") > -1) {
                     price = roundDown((price), 100);
                } else {
                    // Устанавливается скидка 15%
                     price = roundUp((price) * 0.85, 50); 
                }
                // Заменяется цена и сумма на скидочную
                 priceEa[i].cells[5].innerText = price;
                 priceEa[i].cells[7].innerText = (price * priceEa[i].cells[6].innerText);
                 // Высчитывается общая сумма
                x += Number(priceEa[i].cells[7].innerText);
                   
                } else {
                    console.log('search with firm');
                    getAjax(url2, function(data){ 
                        price = data.match(/(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*?)<\/span>/);
            
                          if (price) {
                            price = price[2].replace(" ", "");
            
                            if (itemName.toLowerCase().indexOf("масло") > -1) {
                                 price = roundDown((price), 100);
                            } else {
                                // Устанавливается скидка 15%
                                 price = roundUp((price) * 0.85, 50); 
                            }
                            // Заменяется цена и сумма на скидочную
                             priceEa[i].cells[5].innerText = price;
                             priceEa[i].cells[7].innerText = (price * priceEa[i].cells[6].innerText);
                             // Высчитывается общая сумма
                            x += Number(priceEa[i].cells[7].innerText);

                } else {
                    console.log('error');
                }})
            }})

            if (i == (priceEa.length - 1)) {                                                    
                setTimeout(function(){                                                         
                    if (x < 3000){                                                         
                    document.getElementsByTagName('h3')[0].innerText = "Итого с доставкой: "+(x+300)+" руб. "+" Прибыль: " + roundUp((((x+300)-realSumm)/2), 10);
                } else {
                    document.getElementsByTagName('h3')[0].innerText = "Итого: "+x+" руб. "+ " Прибыль: " + roundUp(((x-realSumm)/2), 10);
                }
                }, timeout); //костыль                                                                   
             }                                                                                  

        }
} else {
    alert('Выбери "ЕА розница" и добавьте товары в корзину!');
}

//////////////////////////////////////////////functions///////////////////////////////////////////////////////

function getAjax(url, success) {
   let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);                                                   //ассинхронность?
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function toNumber(string) {
    return parseFloat(string.replace(",", "."));
}

function roundUp(num, precision) {
    return Math.round(num / precision) * precision;
}

  function roundDown(num, precision) {
    return Math.floor(num / precision) * precision;
}

