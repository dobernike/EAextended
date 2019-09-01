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
    //----------------------
    const blockContentLc = document.querySelector('#block-content-lc');
    //---------------------- /
    const oldListingGroup = blockContentLc.querySelector('.old-listing-group');

    // Подгрузка контента Основной склад
    if (oldListingGroup) {
      clearTimeout(timeoutId);
      clearInterval(setIntervalId);

      const itemPrices = oldListingGroup.querySelectorAll('.old-appraise-item-price.use-price-level');
      //----------------------
      const itemNames = oldListingGroup.querySelectorAll('.old-appraise-item-description');
      let firstItemName = itemNames[1].textContent.toLowerCase();
      const isOil = /\масло/.test(firstItemName);
      //---------------------- /

      for (const itemPrice of itemPrices) {
        const eaPrice = +itemPrice.dataset.priceEa;
        const optPrice = +itemPrice.dataset.priceOpt;
        //---------------------- 
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
        const finalPrice = +itemPrice.textContent;
        const profit = +itemPrice.textContent - optPrice;
        //---------------------- /

        itemPrice.innerHTML = finalPrice + "<span style='color: red'>|</span><span style='color: green;'>" + profit + "</span>";
      }
    }
  }, 100);
  let timeoutId = setTimeout(() => { clearInterval(setIntervalId) }, 10000); // 10s
}

function changeSecondary() {
  let setIntervalId = setInterval(function () {
    //----------------------
    const blockContentLdc = document.querySelector('#block-content-ldc');
    //---------------------- /
    const oldListingGroup = blockContentLdc.querySelector('.old-listing-group');

    // Подгрузка контента Розница склад
    if (oldListingGroup) {
      clearTimeout(timeoutId);
      clearInterval(setIntervalId);

      const itemPrices = oldListingGroup.querySelectorAll('.old-appraise-item-price.use-price-level');

      for (const itemPrice of itemPrices) {
        const eaPrice = +itemPrice.dataset.priceEa;
        const optPrice = +itemPrice.dataset.priceOpt;

        const profit = eaPrice - optPrice;

        itemPrice.innerHTML = eaPrice + "<span style='color: red'>|</span><span style='color: green;'>" + profit + "</span>";
      }
    }
  }, 100);
  let timeoutId = setTimeout(() => { clearInterval(setIntervalId) }, 10000); // 10s
}

function roundUp(num, precision) {
  return num > precision ? Math.round(num / precision) * precision
    : Math.round(num);
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}
