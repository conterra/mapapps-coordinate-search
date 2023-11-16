# dn_coordinatesearch

The Coordinate Search bundle adds the option to search coordinates in multiple reference systems via the search-ui.

## Usage
1. Add the bundle "dn_coordinatesearch" to your app.
2. Activate and configure the preferred coordinate formats

### Sample configuration of only decimal degree formats are activated and show examples if no coordinate was found

```json
"dn_coordinatesearch":{
    "DecimalCoordinateSearchStore" :{
        "componentEnabled": true,
        "showExample": true
    }
},
```

## Configurable Components of dn_highlightcolorconfig:

### DecimalCoordinateSearchStore
This allows to search for coordinates in the latitude/longitude notation. The coordinates may use decimal degrees, degrees and decimal minutes, or degrees, minutes, and seconds format. It is assumed the latitude/longitude coordinates are in WGS84. More information can be found [here](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-coordinateFormatter.html#fromLatitudeLongitude)
```json
"dn_coordinatesearch":{
    "DecimalCoordinateSearchStore" :{
        "componentEnabled": true,
        "showExample": true
    }
},
```

| Property   | Type   | Possible Values | Default    |Description|
| ---------- | ------ | --------------- | ---------- | --------- |
| componentEnabled | Boolean  |  true, false                                        | false  | Activate/Deactivate the search for coordinates in the latitude/longitude notation                         |
| showExample |  Boolean  |  true, false                                        | false  | Indicator whether an example should be displayed if no coordinate is found |


### UTMCoordinateSearchStore

This allows to search for coordinates in the UTM notation. It is assumed the UTM coordinates are referenced to WGS84. More information can be found [here](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-coordinateFormatter.html#fromUtm)
```json
"dn_coordinatesearch":{
    "UTMCoordinateSearchStore" :{
        "componentEnabled": true,
        "showExample": true,
        "conversionMode": "latitude-band-indicators"
    }
},
```

| Property   | Type   | Possible Values | Default    |Description|
| ---------- | ------ | --------------- | ---------- | --------- |
| componentEnabled | Boolean  |  true, false                                        | false  | Activate/Deactivate the search for coordinates in the UTM notation                         |
| showExample |  Boolean  |  true, false                                        | false  | Indicator whether an example should be displayed if no coordinate is found |
| conversionMode |  String  |  "latitude-band-indicators" , "north-south-indicators"                                        | "latitude-band-indicators"  | The latitude notation scheme used by the given UTM coordinates, either a latitudinal band, or a hemisphere designator.|

### GKCoordinateSearchStore
This allows to search for coordinates in the Gauss-Krüger notation.
```json
"dn_coordinatesearch":{
    "GKCoordinateSearchStore" :{
        "componentEnabled": true,
        "showExample": true
    }
},
```

| Property   | Type   | Possible Values | Default    |Description|
| ---------- | ------ | --------------- | ---------- | --------- |
| componentEnabled | Boolean  |  true, false                                        | false  | Activate/Deactivate the search for coordinates in the latitude/longitude notation                         |
| showExample |  Boolean  |  true, false                                        | false  | Indicator whether an example should be displayed if no coordinate is found |

### Pseudo-MercatorCoordinateSearchStore
This allows to search for coordinates in the Gauss-Krüger notation.
```json
"dn_coordinatesearch":{
    "PseudoMercatorCoordinateSearchStore" :{
        "componentEnabled": true,
        "showExample": true
    }
},
```

| Property   | Type   | Possible Values | Default    |Description|
| ---------- | ------ | --------------- | ---------- | --------- |
| componentEnabled | Boolean  |  true, false                                        | false  | Activate/Deactivate the search for coordinates in the latitude/longitude notation                         |
| showExample |  Boolean  |  true, false                                        | false  | Indicator whether an example should be displayed if no coordinate is found |


### Known Issues
When coordinates in the UTM format a copied from the bundle [coordinateconversion](https://demos.conterra.de/mapapps/resources/jsregistry/root/index.html?lang=de#b%3Dcoordinateconversion%3Bv%3D4.15.1%3Bvr%3D%5E4.15%3Bp%3Dmap.apps%3Bf%3Dcoordin%3B) the coordinates are missing the UTM zone. Therefore the user has to manually add the zone in front of the copied coordinates e.g. "32N".

When searching for coordinates in pseudo-mercator on the German page, the comma must be set to "," not ".". As "1.002" could mean "One point zero zero two" or "One thousand and two"
