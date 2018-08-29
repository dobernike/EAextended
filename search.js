var profile = document.getElementsByClassName("dropdown-toggle")[1].innerText;
profile = profile.trim();
if (profile == "Продавец") {
  var setIntervalId = setInterval(function () {
    var h3 = document.getElementsByTagName("h3")[0];
    // Подгрузка всего контента
    if (h3 && h3.innerText === "Основной склад") {
      // Основной склад
      clearTimeout(timeoutID);
      clearInterval(setIntervalId);

      var opt = document.getElementsByClassName("old-listing-group")[0];
      var price = opt.getElementsByClassName(
        "old-appraise-item-price use-price-level blue"
      );
      var itemName = opt.getElementsByClassName(
        "old-appraise-item-description"
      )[1].innerText;
      itemName = itemName.match(/\Масло/);
      // var info = opt.getElementsByClassName("fa fa-info-circle");

      for (var i = 0; i < price.length; i++) {
        // info[i].setAttribute("style", "color:green");
        var eaPrice = Number(
          price[i].getAttribute("data-price-ea").replace(" ", "")
        );
        var optPrice = Number(
          price[i].getAttribute("data-price-opt").replace(" ", "")
        );
        if (itemName && itemName[0].toLowerCase() === "масло") {
          price[i].innerText = roundDown(eaPrice, 50);
        } else {
          var newPrice = roundUp(eaPrice * 0.85, 50);
          var newFixedPrice = roundDown(eaPrice, 50);
          if (newPrice > optPrice) {
            price[i].innerText = newPrice;
          } else if (newFixedPrice > optPrice) {
            price[i].innerText = newFixedPrice;
          }
        }
        var finalPrice = Number(price[i].innerText);
        var profit = Number(price[i].innerText) - optPrice;
        price[i].innerHTML = finalPrice + " | <span style='color: green;'>" + profit + "</span>";

      }
    }
    var timeoutID = setTimeout(() => {
      clearInterval(setIntervalId);
    }, 5000);
  }, 100);
  // Розница
  var setIntervalId2 = setInterval(function () {
    var h3Roznica = document.getElementsByTagName("h3")[1];
    if (h3Roznica && h3Roznica.innerText === "Новые запчасти под заказ") {
      h3Roznica = document.getElementsByTagName("h3")[0];
    }
    if (h3Roznica && h3Roznica.innerText === "Розничная сеть") {
      clearTimeout(timeoutID2);
      clearInterval(setIntervalId2);

      var retail = document.getElementById("block-content-ldc");
      var priceRetail = retail.getElementsByClassName(
        "old-appraise-item-price"
      );
      var originalRetailPrice = retail.getElementsByClassName(
        "old-appraise-item-retail-price-num"
      );
      // var infoRetail = retail.getElementsByClassName("fa fa-info-circle");
      var profitRetail = 0;

      for (var j = 0; j < priceRetail.length; j++) {
        var clearPriceRetail = priceRetail[j].innerText
          .replace(" a", "")
          .replace(" ", "");
        var clearOriginalRetailPrice = originalRetailPrice[j].innerText
          .replace(" a ", "")
          .replace(" ", "");
        // infoRetail[j].setAttribute("style", "color:green");
        if (Number(clearOriginalRetailPrice) != 0) {
          profitRetail =
            Number(clearOriginalRetailPrice) - Number(clearPriceRetail);
          priceRetail[j].innerText = clearOriginalRetailPrice;
        } else {
          profitRetail = 0;
          priceRetail[j].innerText = Number(clearPriceRetail);
        }
        var finalRetainPrice = Number(priceRetail[j].innerText);
        priceRetail[j].innerHTML = finalRetainPrice + " | <span style='color: green;'>" + profitRetail + "</span>";
      }
    }
    var timeoutID2 = setTimeout(() => {
      clearInterval(setIntervalId2);
    }, 5000);
  }, 100);
} else {
  console.log("Включи продавец");
}

function roundUp(num, precision) {
  return Math.round(num / precision) * precision;
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}