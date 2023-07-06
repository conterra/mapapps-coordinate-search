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
import { SyncInMemoryStore, ConstructorOptions } from "store-api/InMemoryStore";
import QueryResults from "store-api/QueryResults";
import Point from "esri/geometry/Point";
import { load, fromUtm } from "esri/geometry/coordinateFormatter";
import * as projection from "esri/geometry/projection.js";
import SpatialReference from "esri/geometry/SpatialReference.js";
import type { InjectedReference } from "apprt-core/InjectedReference";
import { Resultobject } from "./Interfaces";

export default class CoordinateSearchStore extends SyncInMemoryStore<ConstructorOptions<any>, string> {

    private _i18n: InjectedReference<any>
    private _properties: InjectedReference<any>

    constructor(opts: object) {
        super(opts);
        load();
        projection.load();
    }

    private createResult(point: __esri.Point, searchString: string): Resultobject {
        const resultObject = {
            id: 0,
            longitude: point.longitude,
            latitude: point.latitude,
            coordinates: searchString,
            geometry: point
        };
        return resultObject;
    }

    private removeInterDots(coordinate: string) {
        if (coordinate.includes(",") || coordinate.split(".").length > 2) {
            coordinate = coordinate.replace(/\./g, '');
            return coordinate.replace(',', '.');
        }
        return coordinate;
    }

    private reprojectUTMToWGS84(zoneNumber: string, zoneIndicator: string, right: string, high: string) {
        const epsg_code = this.getEPSG(parseInt(zoneNumber), zoneIndicator);
        const point = new Point({
            x: parseFloat(right),
            y: parseFloat(high),
            spatialReference: epsg_code
        });
        const newPoint = projection.project(point, SpatialReference.WGS84);
        return newPoint;
    }

    private getEPSG(zoneNumber: number, zoneIndicator: string) {
        let south = false;
        if (this._properties.conversionMode == "latitude-band-indicators") {
            if (zoneIndicator < "N") {
                south = true;
            }
        }
        else {
            if (zoneIndicator == "S") {
                south = true;
            }
        }

        let epsg_code: number = 32600 + zoneNumber;
        if (south) {
            epsg_code += 100;
        }
        return epsg_code;
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
                coordinates: this._i18n.get().ui.utm.help,
                geometry: geometryObject
            };
            results.push(resultObject);
        }

        return QueryResults(results);
    }

    public query(query = {}, options = {}): any {
        const searchString = query?.coordinates.$suggest.replace(/\s+/g, ' ');

        let point = fromUtm(searchString, null, this._properties.conversionMode);
        let result: Array<Resultobject> = [];
        if (point) {
            result = [this.createResult(point, searchString)];
        }
        else {
            // eslint-disable-next-line max-len
            const isUTM = /(?<![\d])\s?(?<zoneNumber>(([1-5]?\d)|60))\s?(?<zoneIndicator>[A-Z])\s?(?<right>(\d{6}|\d{3}\.\d{3})([\.\,]\d+)?)\s(?<high>(\d{1,3}(\.\d{3}){0,2}|\d{1,7})([\.\,]\d+)?)(?![\d])/g;

            for (const match of searchString.matchAll(isUTM)) {
                console.info(match);

                const right: string = this.removeInterDots(match.groups.right);
                const high: string = this.removeInterDots(match.groups.high);

                const possibleUTMString = `${match.groups.zoneNumber}  ${match.groups.zoneIndicator} ${right} ${high}`;

                point = fromUtm(possibleUTMString, null, this._properties.conversionMode);
                if (point) {
                    result = [this.createResult(point, possibleUTMString)];
                } else {
                    point = this.reprojectUTMToWGS84(match.groups.zoneNumber, match.groups.zoneIndicator, right, high);
                    result = [this.createResult(point, searchString)];
                }
            }
        }

        if (result.length > 0) {
            return QueryResults(result);
        }
        else if (this._properties.showExample) {
            return this.returnExample(searchString, result);
        }
        else {
            return QueryResults([]);
        }
    }
}
