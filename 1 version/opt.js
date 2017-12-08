function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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


function recalculate() {
  var rows = $("#order tbody tr");
  var summ = 0;
  var realsummt = $('td[colspan="5"]')
    .next()
    .html()
    .replace(" ", "");
  realsumm = toNumber(realsummt);
  $.each(rows, function(index, value) {
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
      $.get("http://summa-propisyu.ru/?summ=" + summ, function(data) {
        $("#sum-names").html(
          data.match(/<textarea.*result2>(.*?)<\/textarea>/)[1]
        );
      });
    }
  });
  document.title =
    "Накладная № " +
    actNum +
    " " +
    MaxPrice[0] +
    " " +
    (summ - realsumm) / 2 +
    " руб";
}
var MaxPrice = [];
var realsumm = 0;
var actNum = "";

$("document").ready(function() {

  var realsummt = $('td[colspan="5"]')
    .next()
    .html()
    .replace(" ", "");
  realsumm = toNumber(realsummt);
  //////////////////////DELETE/////////////////////////
  $("tr td:first-child").click(function() {
    $(this)
      .parent()
      .remove();

    recalculate();
  });
  //@@@@@@@@@@@@@@@@@@@@@ Search brands
  var regr2 = /<option .*?>(.*? .*?)<\/option>/g;
  var doods = "";
  var url3 = "http://euroauto.ru/brand/";

  $.get(url3, function(data) {
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

    $("h1").html(
      $("h1")
        .html()
        .replace("/2017", "")
        .replace("Site-", "")
    );
    $("h1").html(
      $("h1")
        .html()
        .replace("16537", getRandomInt(10000, 100000))
    );
    actNum = $("h1")
      .html()
      .match(/.*№ (.*?) /)[1];

    $("#pay_till").html('<svg id="barcode"></svg>');
    JsBarcode("#barcode", actNum, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: false
    });
    var rows = $("#order tbody tr");
    var cnt = rows.length - 1;

    $.each(rows, function(index, value) {
      if (index != rows.length - 1) {
        var mat1 = value.cells[1];
        var regg = new RegExp("(" + doods + ".*?) (.*?) (.*?)$");
        var mat = regg.exec(mat1.innerHTML);
        var art = mat[2];
        var firm = mat[1];
        var itemName = mat[3];
        art = art.replaceAll(".", "").replaceAll("/", "").replaceAll("-","");
        var url = "https://euroauto.ru/searchnr/" + art;
        //  art.replace(".", "").replace("/", "");
        $.get(url, function(data) {
          var price = data.match(
            /(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*?)<\/span>/
          );
          if (price) {
            price = price[2].replace(" ", "");

            if (itemName.toLowerCase().indexOf("масло") > -1) {
              price = roundDown(toNumber(price), 100);
            } else {
              price = roundUp(toNumber(price) * 0.85, 50);
            }
            value.cells[4].innerHTML = NumSplitter(price + "");
            value.cells[5].innerHTML =
              price * toNumber(value.cells[2].innerHTML);
            cnt--;
            if (MaxPrice.length == 0) {
              MaxPrice[0] = itemName;
              MaxPrice[1] = price;
            } else {
              if (MaxPrice[1] < price) MaxPrice = [itemName, price];
            }
            if (cnt == 0) recalculate();
          } else {
            var url2 = "https://euroauto.ru/firms/" + firm + "/" + art + "/";

            $.get(url2, function(data) {
              price = data.match(
                /(<span .* itemprop="price".*>|<span .*price_num_real.*>)(.*?)<\/span>/
              );

              price = price[2].replace(" ", "");

              if (itemName.toLowerCase().indexOf("масло") > -1) {
                price = roundDown(toNumber(price), 100);
              } else {
                price = roundUp(toNumber(price) * 0.85, 50);
              }
              value.cells[4].innerHTML = NumSplitter(price + "");
              value.cells[5].innerHTML =
                price * toNumber(value.cells[2].innerHTML);
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
});
