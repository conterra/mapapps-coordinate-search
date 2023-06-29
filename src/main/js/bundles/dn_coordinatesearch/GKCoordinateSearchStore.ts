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
import {load, project} from "esri/geometry/projection.js";
import SpatialReference from "esri/geometry/SpatialReference.js";

export default class CoordinateSearchStore extends SyncInMemoryStore {

    constructor(opts) {
        super(opts);
        load();
    }


    public createResult(point : Point, label : string, result ) {
        const resultObject = {
            id: result.length,
            longitude: point.longitude,
            latitude: point.latitude,
            coordinates: label,
            geometry: point
        };
        return resultObject;
    }


    private calculateGK(X : string, Y: string, result){

        const strip = parseInt(X.substring(0, 1), 10);
        const wkidBase = 31466;
        const stripOffset = strip - 2;
        const wkid =  wkidBase + stripOffset;

        const point= new Point({
            x: parseFloat(X),
            y: parseFloat(Y),
            spatialReference: wkid
        });
        const newPoint= project(point, SpatialReference.WGS84);
        console.info(newPoint);

        const label = X +", " +Y;


        return this.createResult(newPoint, label, result);
    }
    query(query = {}, options = {}) {
        const results = [];





        const searchString = query?.coordinates.$suggest.replace(/\s+/g, ' ');

        const possibleXRegex = /(?<![\d])[2-5]\d{6}\.?\d+(?![\d])/g

        const possibleYRegex = /(?<![\d])[5]\d{6}\.?\d+|[6][0-2]\d{5}\.?\d+(?![\d])/g


        let result = [];

        const possibleX = searchString.match(possibleXRegex);
        const possibleY = searchString.match(possibleYRegex);

        if (possibleX && possibleY){
            if (possibleY.length == 2){
                result.push(this.calculateGK(possibleX[0], possibleY[1], result));
                result.push(this.calculateGK(possibleX[1], possibleY[0], result));
            }
            else if (possibleX.length == 2){
                if(possibleX[0] == possibleY[0]){
                    result.push(this.calculateGK(possibleX[1], possibleY[0], result));
                }
                else{
                    result.push(this.calculateGK(possibleX[0], possibleY[0], result));
                }
            }

        }


        return QueryResults(result);



    }



}
