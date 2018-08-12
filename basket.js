let profile = document.getElementsByClassName("dropdown-toggle")[1].innerText;

if (profile == "Продавец ") {
  let div = document.getElementsByTagName("hr")[0].nextElementSibling;

  if (div.getAttribute("style") == "display: none") {
    /**
     *  Корзина: Основной склад
     **/

    let priceEa = document.getElementsByClassName("cart-store-brand");
    // console.log(priceEa);
    let priceOpt = document.getElementsByClassName("cart-store-price-value");
    let summ = 0;
    let cnt = 0;

    // let x = 0;
    // let price;
    // let realSumm = document
    //   .getElementsByTagName("h3")[0]
    //    .innerText.match(/Итого: \b(\d*)/)[1];
    //   switch (priceEa.length) {
    //     case 1:
    //     case 2:
    //     case 3:
    //     case 4:
    //     case 5:
    //       timeout = 4000;
    //       break;
    //     case 6:
    //     case 7:
    //     case 8:
    //     case 9:
    //     case 10:
    //       timeout = 4500;
    //       break;
    //     default:
    //       timeout = 5000;
    //   }
    // var itemName = '';

    for (let i = 0; i < priceEa.length; i++) {
      // console.log(priceEa[i]);
      let firm = priceEa[i].innerText;
      let art = priceEa[i].previousElementSibling.innerText;
      let itemName = priceEa[i].nextElementSibling;
      let itemProp = itemName.innerText;
      // Временный костыль для розницы
      if (itemName.innerText == "Новый") {
        itemName = priceEa[i].nextElementSibling.nextElementSibling;

      }
      let cost = priceOpt[i].innerText;
      // console.log(firm);
      // console.log(art);
      // console.log(itemName);
      // console.log(cost);
      let itemNameOil = itemName.innerText;
      itemNameOil = itemNameOil.match(/\Масло/);
      //  console.log(itemName);

      let url = "https://euroauto.ru/searchnr/" + art;
      //    console.log(url);
      //     let url2 = "https://euroauto.ru/firms/" + firm + "/" + art + "/";

      // cross xhr для выявления розничной цены
      fetch(url)
        .then(resp => resp.text())
        .then(function (data) {
          // console.log("request succeeded with JSON response");
          //  console.log(itemName);
          let price = data.match(
            /<span\W*itemprop="price"\W*content=".*">(\d.*)<\/span><span itemprop="priceCurrency" content="RUB">руб.<\/span>/m
            // /<div.class="num-from-block main-store">.*\W.*<div.class="num-price">(\d.*)/
          );
          //console.log(data);
          //console.log(price);

          if (!price) {
            price = data.match(
              /<div.class="text-left btn btn-default active">\W.*\W.*\W.*\W.*<span.class="price">(\d.*)<\/span>.*<\/span>/
            );
          }
          //console.log('cost is: ' + cost);
          price = price[1].replace(" ", "");
          // console.log('price is: ' + price);
          var newPrice = 0;
          //  console.log(itemName.previousSibling.innerText);
          if (itemNameOil == "Масло") {
            //console.log("good");
            newPrice = roundDown(price, 50);
          } else if (itemProp == "Новый") {
            // console.log('good');
            newPrice = price;
          } else {
            // console.log("bad");
            // Устанавливается скидка 15%
            newCurentPrice = roundUp(price * 0.85, 50);
            var newFixedPrice = roundDown(price, 50);
            if (newCurentPrice > cost) {
              newPrice = newCurentPrice;
            } else if (newFixedPrice > cost) {
              newPrice = newFixedPrice;
            }
          }

          priceOpt[i].innerText = newPrice;
          summ += Number(newPrice);
          return summ;
          //  console.log('new is: ' + newPrice);
        }).then(function (summ) {
          cnt += 1;
          if (cnt == priceEa.length) {
            let total = document.getElementsByClassName('cart-store-total-sum-value');
            let totalsum = 0;
            let deliveryPrice = document.getElementsByClassName('delivery-price');
            for (let j = 0; j < total.length; j++) {
              totalsum += Number(total[j].innerText);
              // console.log(totalsum);
              totalsum += Number(deliveryPrice[j].innerText);
            }
            let sklad = '';
            if (total.length > 1) {
              sklad = " | " + total.length + " точки";
            }
            total[0].innerText = summ + sklad + " | Прибыль: " + (roundUp((summ - totalsum) / 2, 50));
            console.log(summ);
            console.log(totalsum);
            console.log(summ - totalsum);
            // console.log(totalsum);
            //  console.log(summ);
            // document.getElementsByClassName('cart-store-total-sum-value')[0].innerText
          }
        })
        .catch(function (error) {
          console.log(
            "There has been a problem with your fetch operation: " +
            error.message
          );
          //  alert('Включи mixed content');
        });
    }
    // console.log(summ);
  } else {
    console.log("Добавь товары в корзину");
  }
} else {
  console.log("Включи продавец");
}
//===============================================//

//
//           // Заменяется цена и сумма на скидочную
//           priceEa[i].cells[5].innerText = price;
//           priceEa[i].cells[7].innerText = price * priceEa[i].cells[6].innerText;
//           // Высчитывается общая сумма
//           x += Number(priceEa[i].cells[7].innerText);
//         } else {
//           console.log("search with firm");
//           fetch(url2)
//             .then(resp => resp.text())
//             .then(function(data) {
//               price = data.match(
//                 /(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*\d)<\/span>/
//               );

//               if (price) {
//                 price = price[2].replace(" ", "");

//                 if (itemName.toLowerCase().indexOf("масло") > -1) {
//                   price = roundDown(price, 100);
//                 } else {
//                   // Устанавливается скидка 15%
//                   price = roundUp(price * 0.85, 50);
//                 }
//                 // Заменяется цена и сумма на скидочную
//                 priceEa[i].cells[5].innerText = price;
//                 priceEa[i].cells[7].innerText =
//                   price * priceEa[i].cells[6].innerText;
//                 // Высчитывается общая сумма
//                 x += Number(priceEa[i].cells[7].innerText);
//               } else {
//                 console.log("error");
//               }
//             });
//         }
//       })
//       .catch(function(error) {
//         console.log("request failed", error);
//       });

//     if (i == priceEa.length - 1) {
//       setTimeout(function() {
//         if (x < 3000) {
//           document.getElementsByTagName("h3")[0].innerText =
//             "Итого с доставкой: " +
//             (x + 300) +
//             " руб. " +
//             " Прибыль: " +
//             roundUp((x + 300 - realSumm) / 2, 10);
//         } else {
//           document.getElementsByTagName("h3")[0].innerText =
//             "Итого: " +
//             x +
//             " руб. " +
//             " Прибыль: " +
//             roundUp((x - realSumm) / 2, 10);
//         }
//       }, timeout);
//     }
//   }

//   console.log("end");
// } else {
//   alert('Выбери "ЕА розница" и добавьте товары в корзину!');
// }

/**
 *  Функции
 **/
// function toNumber(string) {
//   return parseFloat(string.replace(",", "."));
// }

function roundUp(num, precision) {
  return Math.round(num / precision) * precision;
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}