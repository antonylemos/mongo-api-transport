// Converte o campo DATA do json de posiÃƒÂ§ÃƒÂµes, de uma lista
// de lista para lista de objetos, o qual cada um contem o
// nome da coluna e o seu respectivo valor. Para assim, ficar
// no formato para inserir no mongodb.
const fs = require("fs");

var rawdata = [
  fs.readFileSync("data/data_22_11_2019.json"),
  fs.readFileSync("data/data_23_11_2019.json"),
  fs.readFileSync("data/data_25_11_2019.json"),
  fs.readFileSync("data/data_27_11_2019.json"),
  fs.readFileSync("data/data_28_11_2019.json")
];
var posicoes;
var data = [];
var rowObject;

rawdata.forEach(raw => {
  posicoes = JSON.parse(raw);

  posicoes.DATA.forEach(row => {
    rowObject = {};

    row.forEach((columnValue, index) => {
      rowObject[posicoes.COLUMNS[index].toLowerCase()] = columnValue;
    });

    // Adicionando latitude e longitude no padrÃ£o GeoJson do mongo
    rowObject["location"] = {
      type: "Point",
      coordinates: [rowObject["latitude"], rowObject["longitude"]]
    };

    // Retirando a latitude e longitude do padrÃ£o normal
    delete rowObject["latitude"];
    delete rowObject["longitude"];

    data.push(rowObject);
  });
});

fs.writeFileSync("data/positions.json", JSON.stringify(data));
