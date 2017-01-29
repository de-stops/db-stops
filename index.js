const got = require('got');
const csv = require('csv');
const Jsonix = require('jsonix').Jsonix;

const stations = {
	name: 'stations',
	typeInfos: [{
		localName: 'stations',
		propertyInfos: [{
			name: 'station',
			collection: true,
			typeInfo: '.station'
		}]
	}, {
		localName: 'station',
		propertyInfos: [{
			type: 'attribute',
			name: 'name',
			typeInfo: 'String'
		}, {
			type: 'attribute',
			name: 'eva',
			typeInfo: 'String'
		}, {
			type: 'attribute',
			name: 'ds100',
			typeInfo: 'String'
		}]
	}],
	elementInfos: [{
		elementName: 'stations',
		typeInfo: '.stations'
	}]
};

var context = new Jsonix.Context([stations]);
var unmarshaller = context.createUnmarshaller();

const haltestellenUrl = "http://download-data.deutschebahn.com/static/datasets/haltestellen/D_Bahnhof_2016_01_alle.csv";
const stationsUrl = "https://iris.noncd.db.de/iris-tts/timetable/station/*";

got(haltestellenUrl).then(response => {
	csv.parse(response.body, {columns: true, delimiter: ";"}, function(err, haltestellen) {
		unmarshaller.unmarshalURL(stationsUrl, function(data) {
			var stations = data.value.station;
			processHaltestellenAndStations(haltestellen, stations);
		});
	});
});

const processHaltestellenAndStations = function(haltestellen, stations) {
	var stationByDs100 = stations.reduce((stationByDs100, station) => Object.assign(stationByDs100, { [station.ds100]: station }), {});
	var stationByEva = stations.reduce((stationByEva, station) => Object.assign(stationByEva, { [station.eva]: station }), {});
	var stops = haltestellen.map(haltestelle => {
		if (stationByDs100[haltestelle.DS100]){
			return {
				stop_id : haltestelle.EVA_NR,
				stop_name : haltestelle.NAME,
				stop_lon : Number(haltestelle.LAENGE),
				stop_lat : Number(haltestelle.BREITE)
			};
		}
		else if (stationByEva[haltestelle.EVA_NR]) {
			var station = stationByEva[haltestelle.EVA_NR];
			return {
				stop_id : haltestelle.EVA_NR,
				stop_name : haltestelle.NAME,
				stop_lon : Number(haltestelle.LAENGE),
				stop_lat : Number(haltestelle.BREITE)
			};
		} else {
			console.log("Station with DS100 " + haltestelle.DS100 + " or EVA_NR " + haltestelle.EVA_NR + " could not be found.")
			return null;
		}
	}).filter(haltestelle => !!haltestelle);
	csv.stringify(stops, {header: true, quotedString: true}, function(err, data){
		process.stdout.write(data);
	});
};