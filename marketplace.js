// Под комментами селекторы jquery, а за ними селекторы es6(js);
// let priceEa = $('#pr .pricing-ea');
let priceEa = document.querySelectorAll("#pr .pricing-ea");
// let elId = $('#eaopt_opts_pricing');
let elId = document.getElementById("eaopt_opts_pricing");
// let pricingEa = $(elId[1]).attr('selected');
let pricingEa = elId[1].getAttribute("selected");

if (pricingEa == "selected") {
  for (let i = 0; i < priceEa.length; i++) {
    let b = priceEa[i].innerText;
    b = b.replace(" ", "");
    let c = b * 0.85;
    let d = roundR(c, 50);
    priceEa[i].innerText = d;
  }
} else {
  alert('Выбери "ЕА розница"!');
}

function roundR(num, precision) {
  return Math.round(num / precision) * precision;
}
