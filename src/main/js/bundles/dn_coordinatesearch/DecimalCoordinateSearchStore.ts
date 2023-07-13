/* eslint-disable max-len */
///
/// Copyright (C) 2023 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { SyncInMemoryStore, ConstructorOptions } from "store-api/InMemoryStore";
import QueryResults from "store-api/QueryResults";
import Point from "esri/geometry/Point";
import { load, fromLatitudeLongitude } from "esri/geometry/coordinateFormatter";
import type { InjectedReference } from "apprt-core/InjectedReference";
import { Resultobject } from "./Interfaces";


export default class CoordinateSearchStore extends SyncInMemoryStore<ConstructorOptions<any>, string> {

    private _i18n: InjectedReference<any>;
    private _properties: InjectedReference<any>;

    constructor(opts: object) {
        super(opts);
        load();
    }

    private parseCoord(input: string): Array<string> {
        const parts: Array<string> = input.match(/[+-]?\d+(\.\d+)?/g);

        return parts;
    }

    private convertDMSToDD(degrees: string, minutes: string, seconds: string, input: string): any {
        const dd = parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / (60 * 60);

        return this.adjustSorW(dd, input);
    }

    private convertDDMToDD(degrees: string, minutes: string, input: string): any {
        const dd = parseFloat(degrees) + parseFloat(minutes) / 60;

        return this.adjustSorW(dd, input);
    }

    private adjustSorW(coord: number, string: string): number {
        if (/S/i.test(string) || /W/i.test(string)) {
            coord = coord * -1;
        } // Don't do anything for N or E
        return coord;
    }

    private addResultObject(results: Array<Resultobject>, latitude: number, longitude: number,
        latitudeString: string, longitudeString: string, searchString: string): Array<Resultobject> {
        const geometryObject = new Point({ longitude: longitude, latitude: latitude });

        let text = "";
        if (latitudeString) {
            text = latitudeString + ", " + longitudeString;
        }
        else {
            text = searchString;
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

    private getLatLng(latString: string, lngString: string, method: string): object | null {
        latString = latString.trim().replace(",", ".");
        lngString = lngString.trim().replace(",", ".");

        let lat = null;
        let lng = null;

        if (latString && lngString) {
            lat = this.parseCoord(latString);
            lng = this.parseCoord(lngString);
            if (method == "DMS") {
                lat = this.convertDMSToDD(lat[0], lat[1], lat[2], latString);
                lng = this.convertDMSToDD(lng[0], lng[1], lng[2], lngString);
            }
            else if (method == "DDM") {
                lat = this.convertDDMToDD(lat[0], lat[1], latString);
                lng = this.convertDDMToDD(lng[0], lng[1], lngString);
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

    private returnExample(searchString: string, results: any): any {
        const parts = searchString.match(/[+-]?\d+(\.\d+)?/g);

        if (parts && parts.length > 1) {
            const latitude = 51.935126;
            const longitude = 7.652517;
            const geometryObject = new Point({ longitude: longitude, latitude: latitude });
            const resultObject = {
                id: results.length,
                longitude: longitude,
                latitude: latitude,
                coordinates: this._i18n.get().ui.decimal.help,
                geometry: geometryObject
            };
            results.push(resultObject);
        }

        return QueryResults(results);
    }

    private detectFormat(searchString: string) {
        const isLatDMS = /(?<![\d])([\+-]?\s?(([1-8]?\d)\s?[:|°]\s?([1-5]?\d|60)\s?[:|'|′]\s?([1-5]?\d|60)(\.\d+)?|90(\s?[:|°]\s?0\s?[:|'|′]\s?0)?)\s?"?\s?[NSsn]?)(?![\d])/g;
        const isLngDMS = /(?<![\d])([\+-]?\s?((1?[0-7]?\d)\s?[:|°]\s?([1-5]?\d|60)\s?[:|'|′]\s?([1-5]?\d|60)(\.\d+)?|180(\s?[:|°]\s?0\s?[:|'|′]\s?0)?)\s?"?\s?[EWewOo]?(?![\d]))/g;

        const isLatDDS = /(?<![\d])([\+-]?\s?(([1-8]?\d)\s?[:|°]\s?([1-5]?\d|60)([\.\,]\d+)?|90(\s?[:|°]\s?0)?)\s?["|']?\s?[NSsn]?)(?![\d])/g;
        const isLngDDS = /(?<![\d])([\+-]?\s?((1?[0-7]?\d)\s?[:|°]\s?([1-5]?\d|60)([\.\,]\d+)?|180(\s?[:|°]\s?0)?)\s?["|']?\s?[EWewOo]?)(?![\d])/g;

        const isLatDD = /(?<![\d])([\+-]?\s?(([1-8]?\d)([\.\,]\d{1,})?|90)\s?[:|°]?\s?[NSsn]?)(?![\d])/g;
        const isLngDD = /(?<![\d])([\+-]?\s?((1?[0-7]?\d)([\.\,]\d{1,})?|180)\s?[:|°]?\s?[EWewOo]?)(?![\d])/g;

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
                    return { method };
                }
            }
        }

        const possibleLatStrings = possibleLatString.map(s => s.trim());
        const possibleLngStrings = possibleLngString.map(s => s.trim());

        return { method, possibleLatStrings, possibleLngStrings };
    }

    public query(query = {}, options = {}): any {
        const results = [];

        const searchString = query?.coordinates.$suggest.replace(/\s+/g, ' ');
        const point = fromLatitudeLongitude(searchString);

        if (point) {
            return QueryResults(this.addResultObject(results, point.latitude, point.longitude, null, null, searchString));
        }
        else {
            const isLat = /[N|S]/i;
            const isLng = /[W|E|O]/i;

            let lat = "";
            let lng = "";
            let latString = "";
            let lngString = "";
            let possibleLatString = [];
            let possibleLngString = [];
            let method = "";

            const format = this.detectFormat(searchString);

            if (format.method) {
                possibleLatString = format.possibleLatStrings;
                possibleLngString = format.possibleLngStrings;
                method = format.method;
            } else {
                if (this._properties.showExample) {
                    return this.returnExample(searchString, results);
                }
                else {
                    return QueryResults([]);
                }
            }

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
                const lngTest = lngString.substring(0, lngString.length - 1);
                const lngTest2 = lngString.substring(0, lngString.length - 2);
                for (lat of possibleLatString) {
                    if (!(lngTest == lat) && !(lngTest2 == lat)) {
                        latString = lat;
                        break;
                    }
                }
            }
            else if (lngString == "" && hasDir) {
                const latTest = latString.substring(0, latString.length - 1);
                const latTest2 = latString.substring(0, latString.length - 2);
                for (lng of possibleLngString) {
                    if (!(latTest == lng) && !(latTest2 == lng)) {
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

        if (results.length == 0 && this._properties.showExample) {
            return this.returnExample(searchString, results);
        }
        return QueryResults(results);
    }
}
