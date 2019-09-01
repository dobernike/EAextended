let profile = document.querySelector(`.header-finance-icon .badge`);

if (profile.textContent.trim() !== "П") {
  console.log("Включи продавец");
} else {
  // Загрузка цен Основной 
  changePrimary();
  // Загрузка цен Розница
  changeSecondary();
}

function changePrimary() {
  let setIntervalId = setInterval(function () {
    const blockContentLc = document.querySelector('#block-content-lc');
    const oldListingGroup = blockContentLc.querySelector('.old-listing-group');
    // Подгрузка контента Основной склад
    if (oldListingGroup) {
      clearTimeout(timeoutId);
      clearInterval(setIntervalId);

      const itemPrices = oldListingGroup.querySelectorAll('.old-appraise-item-price.use-price-level.blue');
      const itemNames = oldListingGroup.querySelectorAll('.old-appraise-item-description');
      let firstItemName = itemNames[1].textContent.toLowerCase();
      const isOil = /\масло/.test(firstItemName);

      for (const itemPrice of itemPrices) {
        const eaPrice = +itemPrice.dataset.priceEa;
        const optPrice = +itemPrice.dataset.priceOpt;

        if (isOil) {
          itemPrice.textContent = roundDown(eaPrice, 50);
        } else {
          let newPrice = roundUp(eaPrice * 0.85, 50);
          let newFixedPrice = roundDown(eaPrice, 50);

          if (newPrice > optPrice) {
            itemPrice.textContent = newPrice;
          } else if (newFixedPrice > optPrice) {
            itemPrice.textContent = newFixedPrice;
          }
        }
        let finalPrice = +itemPrice.textContent;
        let profit = +itemPrice.textContent - optPrice;

        itemPrice.innerHTML = finalPrice + "<span style='color: red'>|</span><span style='color: green;'>" + profit + "</span>";
      }
    }
  }, 100);
  let timeoutId = setTimeout(() => { clearInterval(setIntervalId) }, 10000); // 10s
}

function changeSecondary() {
  let setIntervalId2 = setInterval(function () {
    var h3Roznica = document.getElementsByTagName("h3")[1];

    if (h3Roznica && h3Roznica.textContent === "Новые запчасти под заказ") {
      h3Roznica = document.getElementsByTagName("h3")[0];
    }

    if (h3Roznica && h3Roznica.textContent === "Розничная сеть") {
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
        var clearPriceRetail = priceRetail[j].textContent
          .replace(" a", "")
          .replace(" ", "");
        var clearOriginalRetailPrice = originalRetailPrice[j].textContent
          .replace(" a ", "")
          .replace(" ", "");
        // infoRetail[j].setAttribute("style", "color:green");

        if (Number(clearOriginalRetailPrice) != 0) {
          profitRetail =
            Number(clearOriginalRetailPrice) - Number(clearPriceRetail);
          priceRetail[j].textContent = clearOriginalRetailPrice;
        } else {
          profitRetail = 0;
          priceRetail[j].textContent = Number(clearPriceRetail);
        }

        var finalRetainPrice = Number(priceRetail[j].textContent);
        priceRetail[j].innerHTML = finalRetainPrice + "<span style='color: red'>|</span><span style='color: green;'>" + profitRetail + "</span>";
      }
    }
  }, 100);
  let timeoutID2 = setTimeout(() => { clearInterval(setIntervalId2) }, 10000);
}

function allInOne() {

}

function roundUp(num, precision) {
  return num > precision ? Math.round(num / precision) * precision
    : Math.round(num);
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}
