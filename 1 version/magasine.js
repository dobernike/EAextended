String.prototype.replaceAll = function(search, replace) {
  return this.split(search).join(replace);
};
function toNumber(string) {
  return parseFloat(string.replace(",", "."));
}
function roundUp(num, precision) {
  return Math.round(num / precision) * precision;
}
function roundDown(num, precision) {
  return Math.floor(num / precision) * precision;
}
function NumSplitter(str) {
  return str
    .split("")
    .reverse()
    .join("")
    .replace(/(\d\d\d)/, " $1 ")
    .split("")
    .reverse()
    .join("");
}
function NumberRise() {
  var tds = $("#order tbody tr td:first-child");
  $.each(tds, function(index, value) {
    if (index + 1 != tds.length && value.getAttribute("colspan") != "5") {
      goodscount = index + 1;
      value.innerHTML = index + 1;
    }
  });
  $("#columns").text(goodscount);
}

function recalculate() {
  finalise();
  var rows = $("#order tbody tr");
  var summ = 0;
  $.each(rows, function(index, value) {
    if (index != rows.length - 1) {
      summ = summ + toNumber(value.cells[5].innerHTML);
      value.cells[4].innerHTML = NumSplitter(value.cells[4].innerHTML);
      value.cells[5].innerHTML = NumSplitter(value.cells[5].innerHTML);
    } else {
      if (summ < 3000) {
        $(
          '<tr class="total"><td colspan="5">Доставка:</td><td>300</td></tr>'
        ).insertBefore(".total");

        summ = summ + 300;
      }
      var summFull = NumSplitter(summ + "");
      value.cells[1].innerHTML = summFull;
      $("#result").text(summFull + "руб.");

      // result

      $.get("http://summa-propisyu.ru/?summ=" + summ, function(data) {
        $("#sum-names").html(
          data.match(/<textarea.*result2>(.*?)<\/textarea>/)[1]
        );
      });
    }
  });
  NumberRise();
  console.log("order "+order+" MaxPrice "+MaxPrice+" summ "+summ+" realsumm " + realsumm);
  document.title =
  "Накладная № " +
  order +
  " " +
  MaxPrice[0] +
  " " +
  (summ - realsumm) / 2 +
  " руб";
}

var a =
  '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Накладная № {{order}}</title><style>table { font-size: 100%; border-collapse: collapse;border-spacing: none;}body { font-size: 10pt; font-family: Arial, Verdana, sans-serif;}h1 { margin : 0 }table#header { width: 100%; margin-bottom: 1ex }#header, #header h1, #pay_till { font-size: 14pt; font-weight: bold; }#pay_till { font-size: 14pt; text-align: right;}table#info {width: 100%;}td#course {text-align: right;font-weight: bold;font-size: 11pt;}ul#receiver, ul#receiver li { list-style-type: none; margin: 0; padding: 0; }body { padding: 1em; }ul {list-style-type: disc;margin: 2ex 1em;}table#order {width: 100%;}table#order td, table#order th {font-size: 9pt;border: 1px solid black;padding: 0.5ex 0.5em;}table#order td {text-align: right;}table#order td.item-name {text-align: left;}table#order tr.total td {border: none;font-weight: bold;}table#order td.units {text-align: center;}#sum-names {font-weight: bold;text-decoration: underline;}table#subscripts {width: 100%;}table#subscripts td {border-bottom: 1px solid black;width: 35%;}table#subscripts th {padding-left: 3em;text-align: left;}</style></head><body><table id="header"><tbody><tr><td><h1>Расходная накладная № {{order}} от {{date}}</h1></td><td id="pay_till"></td></tr></tbody></table><table id="info"><tbody><tr><td><ul id="receiver"><b><li>Адрес поставки: Стрельна, ул. Нижняя Колония, д. 49Б +79626803377</li> <li>Поставщик: Индивидуальный Предприниматель Федюшин П.Д.</li></b></ul></td></tr></tbody></table><table id="order"><thead><tr><th>№</th><th>Товар</th><th>Кол.</th><th>Ед.</th><th>Цена (руб)</th><th>Сумма (руб)</th></tr></thead><tbody>{{goods}}<tr class="total"><td colspan="5">Итого:</td><td>{{result}} </td></tr></tbody></table><p><p>Всего наименований <b id="columns"></b> на сумму <b id="result"></b></p></p><p id="sum-names">{{human_result}}</p><table id="subscripts"><tbody><tr><th>Отпустил</th><td>&nbsp;</td><th>Получил</th><td>&nbsp;</td></tr></tbody></table></body></html>';
var order = "";
var goods = "";
var date = "";
var cnt = 0;
var goodscount = 0;
var MaxPrice = [];

function genRow(res) {
  if (res[1] != "TRANSPORT") {
    var firm = res[1];

    var art = res[2];
    var itemName = res[4];

    if (res[3] == "Б/У") {
      firm = res[3];
      art = res[1];
    }
    var count = toNumber(res[5]);

    var url = "https://euroauto.ru/search/" + art.replace(".", "");

    $.get(url, function(data) {
      var price = data.match(
        /(<span .*price_num_real.*>|<span .* itemprop="price".*>)(.*?)<\/span>/
      );

      if (price) {
        price = price[2].replace(" ", "");

        if (itemName.toLowerCase().indexOf("масло") > -1) {
          price = roundDown(toNumber(price), 100);
        } else {
          price = toNumber(price) * 0.85;
        }

        var totalPrice = roundUp(price * count, 50);
        price = totalPrice / count;

        goods +=
          '<tr><td>-1</td><td class="item-name">' +
          firm +
          " " +
          art +
          " " +
          itemName +
          "</td><td>" +
          count +
          '</td><td class="units">шт.</td><td> ' +
          price +
          " </td><td>" +
          totalPrice +
          " </td></tr>";
        cnt--;

if (MaxPrice.length == 0) {
              MaxPrice[0] = itemName;
              MaxPrice[1] = price;
            } else {
              if (MaxPrice[1] < price) MaxPrice = [itemName, price];
            }

        if (cnt == 0) recalculate();
      }
    });
  } else {
    cnt--;
    if (cnt == 0) recalculate();
  }
}

$("document").ready(function() {
  var realsummt = $('span:contains("Итого:")')
  .html()
.replace(" ", "").match(/(\d{1,16})/)[1];
  console.log(realsummt)
realsumm = toNumber(realsummt);
console.log(realsumm)
  cnt = $("td.currency:odd").length;
  order = $('span:contains("Заказ")')
    .text()
    .match(/Заказ №(.*?)$/)[1];

  //////////////////////////////////{{date}}////////////////////////////////
  var daten = $("body")
    .html()
    .match(/(\d{4})-(\d{2})-(\d{2})/);
  date = daten[3] + "." + daten[2] + "." + daten[1];
  //////////////////////////////////{{date}}////////////////////////////////
  ////////////////////////////////// Brands ////////////////////////////////
  var regr2 = /<option .*?>(.*? .*?)<\/option>/g;
  var doods = "";
  var url3 = "http://euroauto.ru/brand/";

  $.get(url3, function(dataDoods) {
    dataDoods = dataDoods.substring(0, dataDoods.indexOf("</select>"));
    while ((rec = regr2.exec(dataDoods)) != null) {
      if (rec[1] != "Все бренды") {
        doods += rec[1] + "|";
      }
    }
    doods = doods
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("/", "\\/");

    ////////////////////////////////// Brands ////////////////////////////////
    /////////////////////////////////{{goods}}////////////////////////////////

    var row = $(".eaOptList tbody").html();

    //var regx = /<tr>\s*?<td rowspan="2">\s(Great Wall|.*?)\s(.*?)<\/td>\s.*?<\/td>\s*<td>(.*?)<\/td>\s.*?>(\d*?)<\/td>/g;

    var regx = new RegExp(
      '<tr>\\s*?<td rowspan="2">\\s(' +
        doods +
        ".*?)\\s(.*?)<\\/td>\\s*<td align.*>(.*?)</td>\\s*<td>(.*?)<\\/td>\\s*<td .*>(.*?)<\\/td>",
      "g"
    );
    // <tr>\s*?<td rowspan="2">\s(.*?)\s(.*?)<\/td>\s*<td align.*>(.*?)<\/td>
    // <tr>\\s*?<td rowspan="2">\\s(' +doods +".*?)\\s(.*?)<\\/td>\\s.*?<td\\salign=\"center\">(.*?)<\\/td>\\s.*?<\\/td>\\s*<td>(.*?)<\\/td>\\s.*?>(\\d*?)<\\/td>"

    while ((ress = regx.exec(row)) != null) {
      genRow(ress);
    }
  });
});

function finalise() {
  ///replace///
  a = a
    .replaceAll("{{order}}", order)
    .replace("{{goods}}", goods)
    .replace("{{date}}", date);
  document.write(a);

  ///{{barcode}}///
  $("#pay_till").html('<svg id="barcode"></svg>');
  JsBarcode("#barcode", order, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false
  });
}
