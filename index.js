const fs = require("fs");
const mongoose = require("mongoose");
const Queries = require("./queries");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", async function() {
  console.log("Conectado!!");

  // Linhas dos ônibus que passam pelo polígono
  var coordsPolygon = JSON.parse(fs.readFileSync("data/polygon.json"));
  var lines = await Queries.listBusesLinesPassPolygon(coordsPolygon);
  console.log(lines);

  // Linhas dos ônibus que passam por dois pontos
  var coordDestinacion = [-22.9086374, -43.2011653];
  var coordOrigin = [-22.880608, -43.258389];
  var lines = await Queries.listBusesLinesPassTwoPoints(
    coordOrigin,
    coordDestinacion
  );
  console.log(lines);
});
