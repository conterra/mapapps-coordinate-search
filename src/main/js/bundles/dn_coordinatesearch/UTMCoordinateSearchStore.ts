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
import { SyncInMemoryStore } from "store-api/InMemoryStore";
import QueryResults from "store-api/QueryResults";
import Point from "esri/geometry/Point";
import {load, fromUtm} from "esri/geometry/coordinateFormatter";

import { Resultobject } from "./Interfaces";

export default class CoordinateSearchStore extends SyncInMemoryStore {

    constructor(opts: object) {
        super(opts);
        load();
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


            const isUTM = /(?<![\d])\s?(([1-5]?\d)|60)[A-Z]?(?![\d])\s\d{6}\.?\d*\s\d{1,7}\.?\d*/g;

            const possibleUTMStrings = searchString.match(isUTM);

            if (possibleUTMStrings?.length > 0) {
                point = fromUtm(possibleUTMStrings[0], null, this._properties.conversionMode);
                if (point){
                    result = [this.createResult(point, possibleUTMStrings[0])];
                }
            }
        }

        if (result.length >0 ) {
            return QueryResults(result);
        }
        else if (this._properties.showExample){
            return this.returnExample(searchString, result);
        }
        else{
            return QueryResults([]);
        }


    }


}
