let priceEa = document.querySelectorAll("#pr .pricing-ea");
let elId = document.getElementById("eaopt_opts_pricing");
let pricingEa = elId[1].getAttribute("selected");

if (pricingEa == "selected") {
  for (let i = 0; i < priceEa.length; i++) {
    var itemName = priceEa[i].previousElementSibling.previousElementSibling.innerHTML;
    itemName = itemName.replace(/ .*/, '');
    let price = priceEa[i].innerText;
    price = price.replace(" ", "");

    console.log(itemName);

    if (itemName.toLowerCase().indexOf("масло") > -1) {
      priceEa[i].innerText = roundDown(price, 100);
    } else {
      let c = price * 0.85;
      let d = roundR(c, 50);
      priceEa[i].innerText = d;
    }


  }
} else {
  alert('Выбери "ЕА розница"!');
}

function roundR(num, precision) {
  return Math.round(num / precision) * precision;
}

function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}

function toNumber(string) {
  return parseFloat(string.replace(",", "."));
}