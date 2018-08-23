let profile = document.getElementsByClassName("dropdown-toggle")[1].innerText;

if (profile == "Продавец ") {
  let div = document.getElementsByTagName("hr")[0].nextElementSibling;

  if (div.getAttribute("style") == "display: none") {
    /**
     *  Корзина: Основной склад
     **/
    let priceEa = document.getElementsByClassName("cart-store-brand");
    let priceOpt = document.getElementsByClassName("cart-store-price-value");
    let summ = 0;
    let cnt = 0;
    let count = 0;

    for (let i = 0; i < priceEa.length; i++) {
      let firm = priceEa[i].innerText;
      firm = firm
        .replace(" ", "_")
        .replace("(", "_")
        .replace(")", "")
        .replace("__", "_");
      let art = priceEa[i].previousElementSibling.innerText;
      let artFixed = art.replace("-", "");
      let itemName = priceEa[i].nextElementSibling;
      let itemProp = itemName.innerText;
      //Наименование для розницы
      if (itemName.innerText == "Новый") {
        itemName = priceEa[i].nextElementSibling.nextElementSibling;
      }
      let cost = priceOpt[i].innerText;
      let itemNameOil = itemName.innerText;
      itemNameOil = itemNameOil.match(/\Масло/);

      let url = "https://euroauto.ru/searchnr/" + art;
      let url2 = "https://euroauto.ru/firms/" + firm + "/" + artFixed + "/";

      // cross xhr для выявления розничной цены
      fetch(url)
        .then(resp => resp.text())
        .then(function(data) {
          let price = data.match(
            /<span\W*itemprop="price"\W*content=".*">(\d.*)<\/span><span itemprop="priceCurrency" content="RUB">руб.<\/span>/m
          );

          if (!price) {
            price = data.match(
              /<div.class="text-left btn btn-default active">\W.*\W.*\W.*\W.*<span.class="price">(\d.*)<\/span>.*<\/span>/
            );
            if (!price) {
              // let settimeoutId = setTimeout(function() {

              fetch(url2)
                .then(resp => resp.text())
                .then(function(data) {
                  //   console.log(url2);
                  // http://euroauto.ru/firms/lynx/la-228/
                  // http://euroauto.ru/firms/lynx/la228/
                  // https://euroauto.ru/firms/KYB (Kayaba)/333311/
                  // http://euroauto.ru/firms/kyb_kayaba/333311/
                  price = data.match(
                    /<span\W*itemprop="price"\W*content=".*">(\d.*)<\/span><span itemprop="priceCurrency" content="RUB">руб.<\/span>/m
                  );
                  //  console.log("price1: " + price[1]);
                  if (!price) {
                    price = data.match(
                      /<div.class="text-left btn btn-default active">\W.*\W.*\W.*\W.*<span.class="price">(\d.*)<\/span>.*<\/span>/
                    );
                    //    console.log("price2: " + price[1]);
                  }
                  if (price) {
                    // clearInterval(setIntervalId);
                    // clearTimeout(settimeoutId);

                    //    console.log("good");
                    return price;
                  }
                });

              // }, 10000);
            }
          }
          if (!price) {
            let settimeoutId = setTimeout(function() {
              clearInterval(setIntervalId);

              //  console.log("bad");
              cnt += 1;
              // в функцию
              price = price[1].replace(" ", "");
              //   console.log(price);
              var newPrice = 0;
              if (itemNameOil == "Масло") {
                newPrice = roundDown(price, 50);
              } else if (itemProp == "Новый") {
                newPrice = price;
              } else {
                // Устанавливается скидка 15%
                var num = document.getElementsByName("num")[i].value;
                var newCurentPrice = round(price * 0.85, 50) * Number(num);
                var newFixedPrice = roundDown(price, 50) * Number(num);
                if (newCurentPrice > cost) {
                  //   console.log(newCurentPrice + " cur > " + cost);
                  newPrice = newCurentPrice;
                } else if (newFixedPrice > cost) {
                  //  console.log(newFixedPrice + " fix > " + cost);
                  newPrice = newFixedPrice;
                }
                // console.log(
                //   newCurentPrice +
                //     " cur i " +
                //     newFixedPrice +
                //     " fix != " +
                //     cost +
                //     " cost"
                // );
              }
              priceOpt[i].setAttribute("style", "color: #337ab7;");
              priceOpt[i].innerText = newPrice;
            }, 20000);
            let setIntervalId = setInterval(function() {
              // console.log("good");
              if (price) {
                clearTimeout(settimeoutId);
                clearInterval(setIntervalId);
                //  console.log("very good");
                cnt += 1;
                // в функцию
                price = price[1].replace(" ", "");
                //  console.log(price);
                var newPrice = 0;
                if (itemNameOil == "Масло") {
                  newPrice = roundDown(price, 50);
                } else if (itemProp == "Новый") {
                  newPrice = price;
                } else {
                  // Устанавливается скидка 15%
                  var num = document.getElementsByName("num")[i].value;
                  var newCurentPrice = round(price * 0.85, 50) * Number(num);
                  var newFixedPrice = roundDown(price, 50) * Number(num);
                  if (newCurentPrice > cost) {
                    // console.log(newCurentPrice + " cur > " + cost);
                    newPrice = newCurentPrice;
                  } else if (newFixedPrice > cost) {
                    // console.log(newFixedPrice + " fix > " + cost);
                    newPrice = newFixedPrice;
                  }
                  // console.log(
                  //   newCurentPrice +
                  //     " cur i " +
                  //     newFixedPrice +
                  //     " fix != " +
                  //     cost +
                  //     " cost"
                  // );
                }
                priceOpt[i].setAttribute("style", "color: #337ab7;");
                priceOpt[i].innerText = newPrice;
              }
            }, 100);
          } else {
            cnt += 1;
            // в функцию
            price = price[1].replace(" ", "");
            //    console.log(price);
            var newPrice = 0;
            if (itemNameOil == "Масло") {
              newPrice = roundDown(price, 50);
            } else if (itemProp == "Новый") {
              newPrice = price;
            } else {
              // Устанавливается скидка 15%
              var num = document.getElementsByName("num")[i].value;
              var newCurentPrice = round(price * 0.85, 50) * Number(num);
              var newFixedPrice = roundDown(price, 50) * Number(num);
              if (newCurentPrice > cost) {
                // console.log(newCurentPrice + " cur > " + cost);
                newPrice = newCurentPrice;
              } else if (newFixedPrice > cost) {
                // console.log(newFixedPrice + " fix > " + cost);
                newPrice = newFixedPrice;
              }
              // console.log(
              //   newCurentPrice +
              //     " cur i " +
              //     newFixedPrice +
              //     " fix != " +
              //     cost +
              //     " cost"
              // );
            }
            priceOpt[i].setAttribute("style", "color: #337ab7;");
            priceOpt[i].innerText = newPrice;
          }
        })
        .then(function() {
          //    console.log("i: " + i + " cnt: " + cnt);
          //    console.log(priceEa.length);

          var timerId = setTimeout(function tick() {
            //  console.log("cnt: " + cnt);
            count += 1;
            //    console.log("count " + count);
            if (cnt === priceEa.length && count === 1) {
              clearInterval(timerId);
              let cartStoreWraps = document.getElementsByClassName(
                "cart-store-wrap"
              );

              for (let j = 0; j < cartStoreWraps.length; j++) {
                let cartStoreWrap = cartStoreWraps[j];
                // Основной склад
                if (
                  cartStoreWrap.getAttribute("data-url-history") ===
                  "/cabinet/history/lc"
                ) {
                  let cartStoreWrapOptSum = 0;
                  let cartStoreWrapItem = cartStoreWrap.getElementsByClassName(
                    "cart-store-item-wrap"
                  );
                  let cartStoreWrapOptOriginalSum = cartStoreWrapItem[
                    cartStoreWrapItem.length - 1
                  ].getElementsByClassName("cart-store-total-sum-value")[0]
                    .innerText;

                  for (let k = 0; k < cartStoreWrapItem.length - 1; k++) {
                    let cartStoreWrapItemPrice = cartStoreWrapItem[
                      k
                    ].getElementsByClassName("cart-store-price-value")[0]
                      .innerText;
                    cartStoreWrapOptSum += Number(cartStoreWrapItemPrice);
                  }
                  let deliveryOpt = "";

                  if (cartStoreWrapOptSum < 3000) {
                    deliveryOpt = " c доставой";
                    cartStoreWrapOptSum += 300;
                  }

                  let profitOpt =
                    Number(cartStoreWrapOptSum) -
                    Number(cartStoreWrapOptOriginalSum);
                  let profitOptCeil = roundUp(profitOpt / 2, 50);
                  cartStoreWrapItem[
                    cartStoreWrapItem.length - 1
                  ].getElementsByClassName(
                    "cart-store-total-sum-value"
                  )[0].innerText =
                    cartStoreWrapOptSum +
                    " руб " +
                    deliveryOpt +
                    " | Прибыль: " +
                    profitOptCeil;
                } else {
                  // Остальные склады
                  let cartStoreWrapEaSum = 0;
                  let cartStoreWrapItemEa = cartStoreWrap.getElementsByClassName(
                    "cart-store-item-wrap"
                  );
                  let cartStoreWrapEaOriginalSum = cartStoreWrapItemEa[
                    cartStoreWrapItemEa.length - 1
                  ].getElementsByClassName("cart-store-total-sum-value")[0]
                    .innerText;

                  cartStoreWrapItemEa[
                    cartStoreWrapItemEa.length - 1
                  ].getElementsByClassName(
                    "cart-store-num-comment"
                  )[0].innerText = "";

                  for (let l = 0; l < cartStoreWrapItemEa.length - 1; l++) {
                    let cartStoreWrapItemEaPrice = cartStoreWrapItemEa[
                      l
                    ].getElementsByClassName("cart-store-price-value")[0]
                      .innerText;
                    cartStoreWrapEaSum += Number(cartStoreWrapItemEaPrice);
                  }
                  let profitEa =
                    Number(cartStoreWrapEaSum) -
                    Number(cartStoreWrapEaOriginalSum);
                  let deliveryEa = "";

                  if (cartStoreWrapEaSum < 3000) {
                    deliveryEa = " c доставой";
                    cartStoreWrapEaSum += 300;
                  }
                  let profitEaCeil = 0;
                  if (profitEa >= 800) {
                    profitEaCeil = roundUp(profitEa / 2, 50);
                  } else {
                    profitEaCeil = profitEa;
                  }
                  cartStoreWrapItemEa[
                    cartStoreWrapItemEa.length - 1
                  ].getElementsByClassName(
                    "cart-store-total-sum-value"
                  )[0].innerText =
                    cartStoreWrapEaSum +
                    " руб " +
                    deliveryEa +
                    " | Прибыль: " +
                    profitEaCeil;
                }
              }
            }
          }, 5000);
        })
        .catch(function(error) {
          console.error(
            "There has been a problem with your fetch operation: " +
              error.message
          );
          priceOpt[i].setAttribute("style", "color: #FF0000;");
          document
            .getElementsByClassName("cart-store-total-sum-value")[0]
            .setAttribute("style", "color: #FF0000;");

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
function round(num, precision) {
  return Math.round(num / precision) * precision;
}

function roundUp(num, precision) {
  return Math.ceil(num / precision) * precision;
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}

// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if (new Date().getTime() - start > milliseconds) {
//       break;
//     }
//   }
// }
