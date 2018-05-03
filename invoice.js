window.onload = function() {
  console.log(1);
  var rows = document
    .getElementsByClassName("eaOptList")[0]
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
  console.log(rows);

  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    console.log(element);
  }
};
