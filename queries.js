const fs = require('fs');
const Position = require('./models/Position');

var Queries = {
    /**
     * Salvar no arquivo result.json, todos as coordenadas por onde o 
     * ônibus da linha informada passou.
     * @param {Number} line - Linha do ônibus 
     */
    listByLinha: function(line){
        Position.find({ linha: line }, (err, positions)=>{
            var locs = [];
            console.log(positions.length)
            positions.forEach(pos => {   
                coord = pos.location.coordinates;         
                locs.push({ lat: coord[0], lng: coord[1] });
            });            
            fs.writeFileSync('result.json', JSON.stringify(locs));
        });
    },

    /**
     * Mostra no terminal quantos registros o banco possui em relação
     * a cada linha de ônibus.
     */
    listAllLines: function(){
        Position.find({}, (err, positions) => {
            var locs = new Map();
            positions.forEach((pos) => {   
                line = pos.linha; 
                if(locs.has(line)){
                    locs.set(line, locs.get(line) + 1);
                }else{
                    locs.set(line, 1);
                }         
            });
            console.log(locs);
        });
    },

    /**
     * Seleciona todas as linhas de ônibus que em algum ponto do seu percurso
     * intercepta o Poligono informado.
     * @param {Array} coordPolygon - Array de coordenadas que constituem o poligono.
     * @returns Array ordenado das linhas dos ônibus que cruzam o polígono.
     */
    listBusesLinesPassPolygon: async function(coordPolygon) {
        var positions = await Position.find({ 
                            location: { 
                                $geoWithin: { 
                                    $polygon: coordPolygon 
                                } 
                            } 
                        }, "linha");

        var distinctLines = [ ...new Set(positions.map(pos => pos.linha)) ];
        
        distinctLines.sort((a, b) => { return a-b });
        
        return distinctLines;        
    },

    /**
     * Retorna uma lista com todas as linhas de ônibus que passam pelo ponto 
     * de origem e destino informados.
     * @param {*} origin - Coordenada de origem
     * @param {*} destination - Coordenada de destino
     */
    listBusesLinesPassTwoPoints: async function(origin, destination){
        var positionsOrigin = await Position.find({ 
                        location: { 
                            $near: {
                                $geometry: {
                                    type: "Point", coordinates: origin
                                },
                                $maxDistance: 85
                            } 
                        } 
                    }, "linha");
        var distinctLinesOrigin = [ ...new Set(positionsOrigin.map(pos => pos.linha)) ];

        var positionsDest = await Position.find({ 
            location: { 
                $near: {
                    $geometry: {
                        type: "Point", coordinates: destination
                    },
                    $maxDistance: 40
                } 
            },
            linha: { $in: distinctLinesOrigin } // Interseção das linhas de ônibus que passam também no ponto de origem
        }, "linha");

        var distinctLines = [ ...new Set(positionsDest.map(pos => pos.linha)) ];

        return distinctLines;                                
    }
}

module.exports = Queries;