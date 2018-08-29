//not done

let MaxPrice = [];
let realsumm = 0;
let actNum = "";
let date = "";

let realsummt = $('td[colspan="5"]').next().html().replace(" ", "");
realsumm = toNumber(realsummt);
//////////////////////TODO: DELETE/////////////////////////
$("tr td:first-child").click(function () {
  $(this).parent().remove();

  recalculate();
});
//@@@@@@@@@@@@@@@@@@@@@ Search brands
var regr2 = /<option .*?>(.*? .*?)<\/option>/g;
var doods = "";
var url3 = "http://euroauto.ru/brand/";

fetch(url3).then(resp => resp.text()).then(function (data) {
  data = data.substring(0, data.indexOf("</select>"));
  while ((rec = regr2.exec(data)) != null) {
    if (rec[1] != "Все бренды") {
      doods += rec[1] + "|";
    }
  }
  doods = doods
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("/", "\\/");
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ end
  var infoTable = $("table[id=info]");
  infoTable.html(
    '<table id="info"><tr><td><ul id="receiver"><b><li>Адрес поставки: Стрельна, ул. Нижняя Колония, д. 49Б +79626803377</li> <li>Поставщик: Индивидуальный Предприниматель Федюшин П.Д.</li></b></ul></td></tr></table>'
  );

  $(".total")[1].remove();

  $("h1").html($("h1").html().replace("/2016", "").replace("/2017", "").replace("/2018", "").replace("Site-", ""));
  $("h1").html($("h1").html().replace("16537", getRandomInt(10000, 100000)));
  actNum = $("h1").html().match(/.*№ (.*?) /)[1];
  date = $("h1").html().match(/(\d{2}).(\d{2}).(\d{4})/)[0];

  $("#pay_till").html('<svg id="barcode"></svg>');
  JsBarcode("#barcode", actNum, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false
  });
  var rows = $("#order tbody tr");
  var cnt = rows.length - 1;

  $.each(rows, function (index, value) {
    if (index != rows.length - 1) {
      var mat1 = value.cells[1];
      var regg = new RegExp("(" + doods + ".*?) (.*?) (.*?)$");
      var mat = regg.exec(mat1.innerHTML);
      var costN = value.cells[4].innerText.replace(' ', '').replace('.00', '');
      //console.log(costN);
      var art = mat[2];
      let artFixed = art.replace("-", "");
      var firm = mat[1];
      firm = firm
        .replace(" ", "_")
        .replace("(", "_")
        .replace(")", "")
        .replace("__", "_");
      var itemName = mat[3];
      art = art.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "");
      var url = "https://euroauto.ru/searchnr/" + art;

      fetch(url).then(resp => resp.text()).then(function (data) {
        let price = data.match(/<a.class="toggle-store-list">В.наличии\W.*<div.class="num-price">(\d.*)\W.*<span.class="rubl">.<\/span><\/div>/);
        //console.log('did ' + price);
        if (!price || Number(price[1].replace(" ", "")) <= Number(costN)) {

          price = data.match(
            /<span\W*itemprop="price"\W*content=".*">(\d.*)<\/span><span itemprop="priceCurrency" content="RUB">руб.<\/span>/m
          );
        } else if (!price || Number(price[1].replace(" ", "")) <= Number(costN)) {
          price = data.match(
            /<div.class="text-left btn btn-default active">\W.*\W.*\W.*\W.*<span.class="price">(\d.*)<\/span>.*<\/span>/
          );
        }

        if (price && Number(price[1].replace(" ", "")) >= Number(costN)) {
          price = price[1].replace(" ", "");
          var cc = value.cells[4].innerText.replace(" ", "");
          var ce = value.cells[4].innerText;
          // console.log(ce);

          var cost = Number(cc);
          //  console.log('cost+ ' + cost);
          var newPrice = 0;

          if (itemName.toLowerCase().indexOf("масло") > -1) {
            //         price = roundDown(toNumber(price), 100);
            newPrice = roundDown(price, 50);
          } else {
            //  price = roundUp(toNumber(price) * 0.85, 50);

            // Устанавливается скидка 15%
            var newCurentPrice = round(price * 0.85, 50);
            var newFixedPrice = roundDown(price, 50);
            if (newCurentPrice > cost) {
              newPrice = newCurentPrice;
            } else if (newFixedPrice > cost) {
              newPrice = newFixedPrice;
            }
          }



          value.cells[4].innerHTML = NumSplitter(newPrice + "");
          value.cells[5].innerHTML =
            Number(newPrice) * toNumber(value.cells[2].innerHTML);
          cnt--;

          if (MaxPrice.length == 0) {
            MaxPrice[0] = itemName;
            MaxPrice[1] = price;
          } else {
            if (MaxPrice[1] < price) MaxPrice = [itemName, price];
          }
          if (cnt == 0) recalculate();
        } else {
          let url2 = "https://euroauto.ru/firms/" + firm + "/" + artFixed + "/";

          fetch(url2).then(resp => resp.text()).then(function (data) {
            price = data.match(/<a.class="toggle-store-list">В.наличии\W.*<div.class="num-price">(\d.*)\W.*<span.class="rubl">.<\/span><\/div>/);
            //console.log('did ' + price);
            if (!price || Number(price[1].replace(" ", "")) <= Number(costN)) {

              price = data.match(
                /<span\W*itemprop="price"\W*content=".*">(\d.*)<\/span><span itemprop="priceCurrency" content="RUB">руб.<\/span>/m
              );
            } else if (!price || Number(price[1].replace(" ", "")) <= Number(costN)) {
              price = data.match(
                /<div.class="text-left btn btn-default active">\W.*\W.*\W.*\W.*<span.class="price">(\d.*)<\/span>.*<\/span>/
              );
            }

            price = price[1].replace(" ", "");
            var ce = value.cells[4].innerText;
            //    console.log(ce);
            var cc = value.cells[4].innerText.replace(" ", "");

            var cost = Number(cc);
            //   console.log('cost+ ' + cost);
            var newPrice = 0;


            if (itemName.toLowerCase().indexOf("масло") > -1) {
              //         price = roundDown(toNumber(price), 100);
              newPrice = roundDown(price, 50);
            } else {
              //  price = roundUp(toNumber(price) * 0.85, 50);

              // Устанавливается скидка 15%
              var newCurentPrice = round(price * 0.85, 50);
              //    console.log(newCurentPrice + " newCurentPrice + cost " + cost + ' price + ' + price);
              var newFixedPrice = roundDown(price, 50);
              //     console.log(newFixedPrice + " newFixedPrice + cost " + cost + ' price + ' + price);
              if (Number(newCurentPrice) > Number(cost)) {
                newPrice = newCurentPrice;
                //      console.log(cost + ' Current');
              } else if (Number(newFixedPrice) > Number(cost)) {
                newPrice = newFixedPrice;
                //       console.log(cost + ' fixed');
              }
            }



            value.cells[4].innerHTML = NumSplitter(newPrice + "");
            value.cells[5].innerHTML =
              Number(newPrice) * toNumber(value.cells[2].innerHTML);
            cnt--;

            if (MaxPrice.length == 0) {
              MaxPrice[0] = itemName;
              MaxPrice[1] = price;
            } else {
              if (MaxPrice[1] < price) MaxPrice = [itemName, price];
            }
            if (cnt == 0) recalculate();
          });
        }
      });
    }
  });
});


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

String.prototype.replaceAll = function (search, replace) {
  return this.split(search).join(replace);
};

function toNumber(string) {
  return parseFloat(string.replace(",", "."));
}

function roundUp(num, precision) {
  return Math.ceil(num / precision) * precision;
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

function recalculate() {
  var rows = $("#order tbody tr");
  var summ = 0;
  var realsummt = $('td[colspan="5"]').next().html().replace(" ", "");
  realsumm = toNumber(realsummt);
  $.each(rows, function (index, value) {
    if (index != rows.length - 1) {
      summ = summ + toNumber(value.cells[5].innerHTML);
      value.cells[5].innerHTML = NumSplitter(value.cells[5].innerHTML);
    } else {
      if (summ < 3000) {
        $(
          '<tr class="total"><td colspan="5">Доставка:</td><td>300</td></tr>'
        ).insertBefore(".total");
        summ = summ + 300;
      }
      value.cells[1].innerHTML = NumSplitter(summ + "");
      $("p").html(
        "<p>Всего наименований " +
        (rows.length - 1) +
        " на сумму " +
        NumSplitter(summ + "") +
        " руб.</p>"
      );
      let sumString = $("#sum-names").html(summ.numberToString(true));
    }
  });
  let profitOptCeil = roundUp((Number(summ) - Number(realsumm)) / 2, 50);
  document.title =
    date +
    " " +
    profitOptCeil +
    " руб " +
    " № " +
    actNum +
    " " +
    MaxPrice[0];
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

function round(num, precision) {
  return Math.round(num / precision) * precision;
}