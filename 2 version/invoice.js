let elId = document.getElementById("eaopt_opts_pricing");
let pricingEa = elId[1].getAttribute("selected");

if (pricingEa == "selected") {
  window.onload = function () {

    // //@@@@@@@@@@@@@@@@@@@@@ Search brands
    // var regr2 = /<option .*?>(.*? .*?)<\/option>/g;
    // var doods = "";
    // var url3 = "http://euroauto.ru/brand/";

    // // $.get(url3, function (data) {
    // fetch(url3).then(resp => resp.text()).then(function (data) {
    //   data = data.substring(0, data.indexOf("</select>"));
    //   while ((rec = regr2.exec(data)) != null) {
    //     if (rec[1] != "Все бренды") {
    //       doods += rec[1] + "|";
    //     }
    //   }
    //   doods = doods
    //     .replaceAll("(", "\\(")
    //     .replaceAll(")", "\\)")
    //     .replaceAll("/", "\\/");
    //   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ end


    var rows = document
      .getElementsByClassName("eaOptList")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      console.log(element);
      let url = element.getElementsByTagName('td')[0].innerHTML;
      url = url.match(/<a href="(.*)"/);
      url = "http://opt.euroauto.ru/" + url[1];
      url = url.replaceAll('amp;', '')
      console.log('url is ' + url);


      // fetch(url).then(resp => resp.text()).then(function (data) {
      //   var table2 = document.getElementsByClassName('eaOptList')[1];
      //   console.log(table2);
      // })
      //   ////////////////////////////////
      //   var rows2 = $("#order tbody tr");
      //   var cnt = rows.length - 1;

      //   $.each(rows2, function (index, value) {
      //     if (index != rows.length - 1) {
      //       var mat1 = value.cells[1];
      //       var regg = new RegExp("(" + doods + ".*?) (.*?) (.*?)$");
      //       var mat = regg.exec(mat1.innerHTML);
      //       var art = mat[2];
      //       var firm = mat[1];
      //       var itemName = mat[3];
      //     }
      //   })
      //   ////////////////////////////////

      // })

    }
    //  })
  }

} else {
  alert('Выбери "ЕА розница"!');
}

String.prototype.replaceAll = function (search, replace) {
  return this.split(search).join(replace);
};

// http://opt.euroauto.ru/?option=com_eaopt&task=invoice

// http://opt.euroauto.ru/?option=com_eaopt&task=invoice&invoice_from=11/05/2018&invoice_to=18/05/2018&invoice_show=4861629&invoice_num=144969/2018
// http://opt.euroauto.ru/?option=com_eaopt&amp;task=invoice&amp;invoice_from=11/05/2018&amp;invoice_to=18/05/2018&amp;invoice_show=4861629&amp;invoice_num=144969/2018