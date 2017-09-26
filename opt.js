
class TGood{
  constructor(id, name, cnt, price, summ)
  {
    /// id, name, cnt, 'newPrice', price, summ
    this.Id = id;
    this.Name = name;
    this.Cnt = cnt;
    this.NewPrice = -1;
    this.Price = price;
    this.Summ = summ;
  }

  
  /*GetSpacedFirm = function()
  {
    if (doods!="") return;
    let reg = /<option .*?>(.*? .*?)<\/option>/g;
    let doods = "";
    let url = "http://euroauto.ru/brand/";
  
    $.get(url, function(data) {
      data = data.substring(0, data.indexOf("</select>"));
      while ((rec = reg.exec(data)) != null) {
        if (rec[1] != "Все бренды") {
          doods += rec[1] + "|";
        }
      }
      doods = doods
        .replaceAll("(", "\\(")
        .replaceAll(")", "\\)")
        .replaceAll("/", "\\/");
    });
  };*/

}
class TFuckOff{
  constructor()
  {
    this.Date = "";
    this.Order = "1";
    this.Goods = [];
  }
  GetPriceForHuman = function(good)
  {
    
  }
}
class TEuroItem{
  constructor(firm, art, name)
  {
    this.Firm = firm;
    this.Art = art;
    this.Name = name;
  }
}


let Alls = new FuckOff();
$('document').ready(function() {
  let rows = $('#order tbody tr[class!="total"]');
  

  $.each(rows, function(index, value) {
    //console.log(index);
    //console.log(value);
    /// id, name, cnt, 'newPrice', price, summ
    Alls.Goods.push(new TGood(value.cells[0],value.cells[1],value.cells[2],value.cells[4],value.cells[5]));

  });
  //TGood.GetSpacedFirm();
  console.log(Alls.Goods[0]);
  console.log(TGood.doods);
  setTimeout(function(){console.log(TGood.doods);},1500);
//Добавление в конец Массива
//let newLength = goods.push('');

//Удаление из конца Массива
//let last = fruits.pop(); // удаление (из конца)

//Удаление элемента по номеру позиции
//let removedItem = fruits.splice(pos, 1); // это как удалить элемент                                      

//Копия Массива
//let shallowCopy = fruits.slice(); // это как скопировать


});