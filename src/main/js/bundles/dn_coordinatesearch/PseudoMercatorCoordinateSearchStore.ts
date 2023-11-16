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
import Locale from "apprt-core/Locale";

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
                coordinates: this._i18n.get().ui.pm.help,
                geometry: geometryObject
            };
            results.push(resultObject);
        }

        return QueryResults(results);
    }

    private removeThousandsSeperators(searchString: string) {
        const currentLang = Locale.getCurrent().getLocaleString();
        if (currentLang == "de"){
            searchString = searchString.replaceAll(".", "");
            searchString = searchString.replaceAll(",", ".");
        }
        else{
            searchString= searchString.replaceAll(",", "");
        }
        return searchString;
    }

    private calculatePM(X: string, Y: string, result: Array<Resultobject>) {

        const point = new Point({
            x: parseFloat(X),
            y: parseFloat(Y),
            spatialReference: 3857
        });
        const newPoint = project(point, SpatialReference.WGS84);
        let label = X + " " + Y;
        const currentLang = Locale.getCurrent().getLocaleString();
        if (currentLang == "de"){
            label = label.replaceAll(".", ",");
        }

        return this.createResult(newPoint, label, result);
    }


    query(query = {}, options = {}): any {

        let searchString = query?.coordinates.$suggest.replaceAll(":", " ");
        searchString = searchString.replace(/\s+/g, ' ');
        searchString = this.removeThousandsSeperators(searchString);

        const possibleCoordinatesRegex = /(?<![\d,.])[-]?[1-2]?\d{1,7}([\.]\d+)?(?![\d,.])/g;

        const result = [];

        const possibleCoordinates = searchString.match(possibleCoordinatesRegex);

        if (possibleCoordinates && possibleCoordinates.length == 2) {
            result.push(this.calculatePM(possibleCoordinates[0], possibleCoordinates[1], result));
               //result.push(this.calculateGK(possibleX[1], possibleY[0], result));
        }


        if (result.length == 0 && this._properties.showExample) {
            return this.returnExample(searchString, result);
        }
        else {
            return QueryResults(result);
        }
    }
}
