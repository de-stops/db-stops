# ´db-stops

This is a simple script to download all DB stops supported by [web departure board](http://iris.noncd.db.de/wbt/js/index.html?bhf=8000105) as [GTFS-compatible CSV](https://developers.google.com/transit/gtfs/reference/stops-file).

The script uses data from the [DB OpenData portal](http://data.deutschebahn.com/dataset/data-haltestellen) and the following endpoint:

```
https://iris.noncd.db.de/iris-tts/timetable/station/*
```

The script produces CSV output in the following format:

```
"stop_id","stop_name","stop_lon","stop_lat"
"8000001","Aachen Hbf",6.091499,50.7678
```

# Usage

```
npm install
node index.js
```

# Disclaimer

Usage of this script may or may not be legal, use on your own risk.  
This repository provides only source code, no data.

# License

Source code is licensed under [BSD 2-clause license](LICENSE). No license and no guarantees implied on the produced data, produce and use on your own risk.