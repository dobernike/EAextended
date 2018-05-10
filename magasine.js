//let uel = document.getElementsByTagName('script')[0];
//console.log(uel);
//uel.remove();
//removeEventListener

// old
String.prototype.replaceAll = function (search, replace) {
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
  $.each(tds, function (index, value) {
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
  $.each(rows, function (index, value) {
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

      let sumString = $("#sum-names").html(summ.numberToString(true));
    }
  });
  NumberRise();
  document.title =
    date + " " + (summ - realsumm) + " руб" + " № " + order + " " + MaxPrice[0];
}

var logic =
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

    //$.get(url, function (data) {
    fetch(url).then(resp => resp.text()).then(function (data) {
      var price = data.match(
        /(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*\d)<\/span>/
      );

      if (price) {
        price = price[2].replace(" ", "");

        // if (itemName.toLowerCase().indexOf("масло") > -1) {
        //   price = roundDown(toNumber(price));
        //  } else {
        //   price = toNumber(price);
        // }

        var totalPrice = price * count;
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

$("document").ready(function () {
  var realsummt = $('span:contains("Итого:")')
    .html()
    .replace(" ", "")
    .match(/(\d{1,16})/)[1];

  realsumm = toNumber(realsummt);

  cnt = $("td.currency:odd").length;
  order = $('span:contains("Заказ")').text().match(/Заказ №(.*?)$/)[1];

  //////////////////////////////////{{date}}////////////////////////////////
  var daten = $("body").html().match(/(\d{4})-(\d{2})-(\d{2})/);
  date = daten[3] + "." + daten[2] + "." + daten[1];
  //////////////////////////////////{{date}}////////////////////////////////
  ////////////////////////////////// Brands ////////////////////////////////
  var regr2 = /<option .*?>(.*? .*?)<\/option>/g;
  var doods = "";
  var url3 = "http://euroauto.ru/brand/";

  //  $.get(url3, function (dataDoods) {
  fetch(url3).then(resp => resp.text()).then(function (dataDoods) {
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
  let logic1 = logic
    .replaceAll("{{order}}", order)
    .replace("{{goods}}", goods)
    .replace("{{date}}", date);
  document.write(logic1);

  ///{{barcode}}///
  $("#pay_till").html('<svg id="barcode"></svg>');
  JsBarcode("#barcode", order, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false
  });
}
///////////////////////////////////////////////////////////////////////// Сумма прописью /////////////
function numberToString(_number, toUpper) {
  var toUpper = toUpper || false;
  var _arr_numbers = new Array();
  _arr_numbers[1] = new Array(
    "",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать"
  );
  _arr_numbers[2] = new Array(
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто"
  );
  _arr_numbers[3] = new Array(
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот"
  );

  function number_parser(_num, _desc) {
    var _string = "";
    var _num_hundred = "";
    if (_num.length == 3) {
      _num_hundred = _num.substr(0, 1);
      _num = _num.substr(1, 3);
      _string = _arr_numbers[3][_num_hundred] + " ";
    }
    if (_num < 20) _string += _arr_numbers[1][parseFloat(_num)] + " ";
    else {
      var _first_num = _num.substr(0, 1);
      var _second_num = _num.substr(1, 2);
      _string +=
        _arr_numbers[2][_first_num] + " " + _arr_numbers[1][_second_num] + " ";
    }
    switch (_desc) {
      case 0:
        if (_num.length == 2 && parseFloat(_num.substr(0, 1)) == 1) {
          _string += "рублей";
          break;
        }
        var _last_num = parseFloat(_num.substr(-1));
        if (_last_num == 1) _string += "рубль";
        else if (_last_num > 1 && _last_num < 5) _string += "рубля";
        else _string += "рублей";
        break;
      case 1:
        _num = _num.replace(/^[0]{1,}$/g, "0");
        if (_num.length == 2 && parseFloat(_num.substr(0, 1)) == 1) {
          _string += "тысяч ";
          break;
        }
        var _last_num = parseFloat(_num.substr(-1));
        if (_last_num == 1) _string += "тысяча ";
        else if (_last_num > 1 && _last_num < 5) _string += "тысячи ";
        else if (parseFloat(_num) > 0) _string += "тысяч ";
        _string = _string.replace("один ", "одна ");
        _string = _string.replace("два ", "две ");
        break;
    }
    return _string;
  }

  function decimals_parser(_num) {
    var _first_num = _num.substr(0, 1);
    var _second_num = parseFloat(_num.substr(1, 2));
    var _string = " " + _first_num + _second_num;
    if (_second_num == 1) _string += " копейка";
    else if (_second_num > 1 && _second_num < 5) _string += " копейки";
    else _string += " копеек";
    return _string;
  }
  if (!_number || _number == 0) return false;
  if (typeof _number !== "number") {
    _number = _number + "";
    _number = _number.replace(",", ".");
    _number = parseFloat(_number);
    if (isNaN(_number)) return false;
  }
  _number = _number.toFixed(2);
  if (_number.indexOf(".") != -1) {
    var _number_arr = _number.split(".");
    var _number = _number_arr[0];
    var _number_decimals = _number_arr[1];
  }
  var _number_length = _number.length;
  var _string = "";
  var _num_parser = "";
  var _count = 0;
  for (var _p = _number_length - 1; _p >= 0; _p--) {
    var _num_digit = _number.substr(_p, 1);
    _num_parser = _num_digit + _num_parser;
    if (
      (_num_parser.length == 3 || _p == 0) &&
      !isNaN(parseFloat(_num_parser))
    ) {
      _string = number_parser(_num_parser, _count) + _string;
      _num_parser = "";
      _count++;
    }
  }
  if (_number_decimals) _string += decimals_parser(_number_decimals);
  if (toUpper === true || toUpper == "upper") {
    _string = _string.substr(0, 1).toUpperCase() + _string.substr(1);
  }
  return _string.replace(/[\s]{1,}/g, " ");
}

Number.prototype.numberToString = function (toUpper) {
  return numberToString(this, toUpper);
};
String.prototype.numberToString = function (toUpper) {
  return numberToString(this, toUpper);
};