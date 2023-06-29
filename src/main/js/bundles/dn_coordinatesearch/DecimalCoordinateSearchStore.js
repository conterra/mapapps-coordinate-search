/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { SyncInMemoryStore } from "store-api/InMemoryStore";
import QueryResults from "store-api/QueryResults";
import Point from "esri/geometry/Point";
import {load, fromLatitudeLongitude}from "esri/geometry/coordinateFormatter";


export default class CoordinateSearchStore extends SyncInMemoryStore {

    constructor(opts) {
        super(opts);
        load()
    }

    ParseCoord(input) {
        var parts = input.match(/[+-]?\d+(\.\d+)?/g);

        return parts;
    }


    ConvertDMSToDD(degrees, minutes, seconds, input) {
        var dd = parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / (60 * 60);

        return this.adjustSorW(dd, input);
    }

    ConvertDDMToDD(degrees, minutes, input) {
        var dd = parseFloat(degrees) + parseFloat(minutes) / 60;

        return this.adjustSorW(dd, input);
    }

    adjustSorW(coord, string) {
        if (/S/i.test(string) || /W/i.test(string)) {
            coord = coord * -1;
        } // Don't do anything for N or E
        return coord;
    }

    addResultObject(results, latitude, longitude, latitudeString, longitudeString, searchString) {
        const geometryObject = new Point({ longitude: longitude, latitude: latitude });

        let text = "";
        if (latitudeString){
            text = latitudeString + ", " + longitudeString;
        }
        else {
            text =searchString;
        }

        const resultObject = {
            id: results.length,
            longitude: longitude,
            latitude: latitude,
            coordinates: text,
            geometry: geometryObject
        };
        results.push(resultObject);
        return results;


    }

    getLatLng(latString, lngString, method) {

        latString = latString.trim();
        lngString = lngString.trim();

        let lat = null;
        let lng = null;

        if (latString && lngString) {
            lat = this.ParseCoord(latString);
            lng = this.ParseCoord(lngString);
            if (method == "DMS") {
                lat = this.ConvertDMSToDD(lat[0], lat[1], lat[2], latString);
                lng = this.ConvertDMSToDD(lng[0], lng[1], lng[2], lngString);
            }
            else if (method == "DDM") {
                lat = this.ConvertDDMToDD(lat[0], lat[1], latString);
                lng = this.ConvertDDMToDD(lng[0], lng[1], lngString);
            }
            else if (method == "DD") {
                lat = this.adjustSorW(lat[0], latString);
                lng = this.adjustSorW(lng[0], lngString);
            }
            return { "lat": lat, "lng": lng };
        }
        else {
            return null;
        }

    }

    returnExample(searchString, results) {
        var parts = searchString.match(/[+-]?\d+(\.\d+)?/g);

        if (parts && parts.length > 1) {
            let latitude = 51.935126;
            let longitude = 7.652517;
            const geometryObject = new Point({ longitude: longitude, latitude: latitude });
            const resultObject = {
                id: results.length,
                longitude: longitude,
                latitude: latitude,
                coordinates: "Keine Koordinaten gefunden. Probiere folgende Formate \n (" + latitude + ", " + longitude + ")",
                geometry: geometryObject
            };
            results.push(resultObject);
        }

        return QueryResults(results);


    }



    query(query = {}, options = {}) {


        const results = [];



        const searchString = query?.coordinates.$suggest.replace(/\s+/g, ' ');
        let point = fromLatitudeLongitude(searchString);


        if (point){
            return QueryResults(this.addResultObject(results, point.latitude, point.longitude, null, null, searchString));
        }
        else{





            const hasDirection = /[N|S|W|E]/i
            const isLat = /[N|S]/i
            const isLng = /[W|E]/i





            let lat = "";
            let lng = "";

            const isLatDMS = /(?<![\d])[\+-]?\s?(([1-8]?\d)\s?[:|°]\s?([1-5]?\d|60)\s?[:|'|′]\s?([1-5]?\d|60)(\.\d+)?|90(\s?[:|°]\s?0\s?[:|'|′]\s?0)?)\s?"?\s?[NSsn]?(?![\d])/g
            const isLngDMS = /(?<![\d])[\+-]?\s?((1?[0-7]?\d)\s?[:|°]\s?([1-5]?\d|60)\s?[:|'|′]\s?([1-5]?\d|60)(\.\d+)?|180(\s?[:|°]\s?0\s?[:|'|′]\s?0)?)\s?"?\s?[EWew]?(?![\d])/g

            const isLatDDS = /(?<![\d])[\+-]?\s?(([1-8]?\d)\s?[:|°]\s?([1-5]?\d|60)(\.\d+)?|90(\s?[:|°]\s?0)?)\s?["|']?\s?[NSsn]?(?![\d])/g
            const isLngDDS = /(?<![\d])[\+-]?\s?((1?[0-7]?\d)\s?[:|°]\s?([1-5]?\d|60)(\.\d+)?|180(\s?[:|°]\s?0)?)\s?["|']?\s?[EWew]?(?![\d])/g

            const isLatDD = /(?<![\d])[\+-]?\s?(([1-8]?\d)(\.\d{1,})?|90)\s?[:|°]?\s?[NSsn]?(?![\d])/g;
            const isLngDD = /(?<![\d])[\+-]?\s?((1?[0-7]?\d)(\.\d{1,})?|180)\s?[:|°]?\s?[EWew]?(?![\d])/g;

            let latString = "";
            let lngString = "";

            let method = "";
            let possibleLatString = searchString.match(isLatDMS);
            let possibleLngString = searchString.match(isLngDMS);
            if (possibleLatString && possibleLngString) {
                method = "DMS";
            }
            else {
                possibleLatString = searchString.match(isLatDDS);
                possibleLngString = searchString.match(isLngDDS);
                if (possibleLatString && possibleLngString) {
                    method = "DDM";
                }
                else {
                    possibleLatString = searchString.match(isLatDD);
                    possibleLngString = searchString.match(isLngDD);
                    if (possibleLatString && possibleLngString) {
                        method = "DD";
                    }
                    else {
                        return this.returnExample(searchString, results);
                    }
                }
            }

            possibleLatString = possibleLatString.map(s => s.trim());
            possibleLngString = possibleLngString.map(s => s.trim());

            let hasDir = false;


            for (lat of possibleLatString) {
                if (isLat.test(lat)) {
                    latString = lat;
                    hasDir = true;
                    break;
                }
            }
            for (lng of possibleLngString) {
                if (isLng.test(lng)) {
                    hasDir = true;
                    lngString = lng;
                    break;
                }
            }

            if (latString == "" && hasDir) {
                const lngTest = lngString.substring(0, lngString.length - 2);
                for (lat of possibleLatString) {
                    if (!(lngTest == lat)) {
                        latString = lat;
                        break;
                    }
                }
            }
            else if (lngString == "" && hasDir) {
                const latTest = latString.substring(0, lngString.length - 2);
                for (lng of possibleLngString) {
                    if (!(latTest == lng)) {
                        lngString = lng;
                        break;
                    }
                }
            }

            if (latString && lngString) {
                const latlng = this.getLatLng(latString, lngString, method);
                if (latlng) {
                    this.addResultObject(results, latlng.lat, latlng.lng, latString, lngString, searchString);
                }
            }
            else if (hasDir == false) {

                if (possibleLatString.length == 2) {
                    latString = possibleLatString[0];
                    lngString = possibleLatString[1];
                    let latlng = this.getLatLng(latString, lngString, method);
                    this.addResultObject(results, latlng.lat, latlng.lng, latString, lngString, searchString);
                    latString = possibleLatString[1];
                    lngString = possibleLatString[0];
                    latlng = this.getLatLng(latString, lngString, method);
                    this.addResultObject(results, latlng.lat, latlng.lng, latString, lngString, searchString);
                }
                else if (possibleLatString.length == 1) {
                    latString = possibleLatString[0];
                    for (lng of possibleLngString) {
                        if (!(lng == latString)) {
                            lngString = lng;
                            break;
                        }
                    }
                    const latlng = this.getLatLng(latString, lngString, method);
                    if (latlng) {
                        this.addResultObject(results, latlng.lat, latlng.lng, latString, lngString, searchString);
                    }
                }

            }
        }

        if (results.length == 0) {
            return this.returnExample(searchString, results);

        }

        console.info(results);
        return QueryResults(results);

    }


}