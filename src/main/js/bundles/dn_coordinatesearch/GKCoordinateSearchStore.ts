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
import { load, project } from "esri/geometry/projection.js";
import SpatialReference from "esri/geometry/SpatialReference.js";
import type { InjectedReference } from "apprt-core/InjectedReference";
import { Resultobject } from "./Interfaces";

export default class CoordinateSearchStore extends SyncInMemoryStore<ConstructorOptions<any>, string> {

    private _i18n: InjectedReference<any>;
    private _properties: InjectedReference<any>;

    constructor(opts: object) {
        super(opts);
        load();
    }

    private createResult(point: Point, label: string, result): Resultobject {
        const resultObject = {
            id: result.length,
            longitude: point.longitude,
            latitude: point.latitude,
            coordinates: label,
            geometry: point
        };
        return resultObject;
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
                coordinates: this._i18n.get().ui.gk.help,
                geometry: geometryObject
            };
            results.push(resultObject);
        }

        return QueryResults(results);
    }

    private removeInterDots(coordinate: string) {
        const subCoord = coordinate.substring(0, 7);
        const subCoordWithoutPoints = subCoord.replace(/\./g, '');
        const completeCoord = subCoordWithoutPoints + coordinate.substring(7);
        return completeCoord.replace(',', '.');
    }

    private calculateGK(X: string, Y: string, result: Array<Resultobject>) {

        const strip = parseInt(X.substring(0, 1), 10);
        const wkidBase = 31466;
        const stripOffset = strip - 2;
        const wkid = wkidBase + stripOffset;

        const point = new Point({
            x: parseFloat(this.removeInterDots(X)),
            y: parseFloat(this.removeInterDots(Y)),
            spatialReference: wkid
        });
        const newPoint = project(point, SpatialReference.WGS84);
        const label = X + ", " + Y;

        return this.createResult(newPoint, label, result);
    }
    query(query = {}, options = {}): any {
        const searchString = query?.coordinates.$suggest.replace(/\s+/g, ' ');

        const possibleXRegex = /(?<![\d])([2-5]\d{6}([\.\,]\d+)?|[2-5]\.\d{3}\.\d{3}([\.\,]\d+)?)(?![\d])/g;

        // eslint-disable-next-line max-len
        const possibleYRegex = /(?<![\d])([5]\d{6}([\.\,]\d+)?|[6][0-2]\d{5}([\.\,]\d+)?|[5]\.\d{3}\.\d{3}([\.\,]\d+)?|[6]\.[0-2]\d{2}\.\d{3}([\.\,]\d+)?)(?![\d])/g;

        const result = [];

        const possibleX = searchString.match(possibleXRegex);
        const possibleY = searchString.match(possibleYRegex);

        if (possibleX && possibleY) {
            if (possibleY.length == 2) {
                result.push(this.calculateGK(possibleX[0], possibleY[1], result));
                result.push(this.calculateGK(possibleX[1], possibleY[0], result));
            }
            else if (possibleX.length == 2) {
                if (possibleX[0] == possibleY[0]) {
                    result.push(this.calculateGK(possibleX[1], possibleY[0], result));
                }
                else {
                    result.push(this.calculateGK(possibleX[0], possibleY[0], result));
                }
            }
        }

        if (result.length == 0 && this._properties.showExample) {
            return this.returnExample(searchString, result);
        }
        else {
            return QueryResults(result);
        }
    }
}
