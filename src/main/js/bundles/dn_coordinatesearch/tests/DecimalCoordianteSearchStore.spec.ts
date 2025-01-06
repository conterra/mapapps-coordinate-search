///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

/* eslint-disable max-len */
import {assert} from "chai";
import md from "module";
import CoordinateSearchStore from "../DecimalCoordinateSearchStore";

describe(md.id, function () {

    it("detectFormat", function () {
        const coordinateSearchStore = new CoordinateSearchStore();
        assert.equal(coordinateSearchStore.detectFormat("51.935137 ° N 7.652506 ° E").method, "DD");
        assert.equal(coordinateSearchStore.detectFormat("51° 56.108220 N 7° 39.150360 E").method, "DDM");
        assert.equal(coordinateSearchStore.detectFormat("51° 56' 6.4932 N 7° 39' 9.0216 E").method, "DMS");
    });

    it("convertDMS", function(){
        const coordinateSearchStore = new CoordinateSearchStore();
        assert.equal(coordinateSearchStore.convertDMSToDD("51", "56", "6.4932", "51° 56' 6.4932 N")
            , 51.935137);
        assert.equal(coordinateSearchStore.convertDMSToDD("51", "56", "6.4932", "51° 56' 6.4932 S")
            , -51.935137);
        assert.equal(coordinateSearchStore.convertDMSToDD("7", "39", "9.0216", "7° 39' 9.0216 E").toFixed(6)
            , 7.652506);
        assert.equal(coordinateSearchStore.convertDMSToDD("7", "39", "9.0216", "7° 39' 9.0216 W").toFixed(6)
            , -7.652506);
        assert.equal(coordinateSearchStore.convertDMSToDD("-7", "39", "9.0216", "-7° 39' 9.0216").toFixed(6)
            , -7.652506);
    });

    it("convertDDM", function(){
        const coordinateSearchStore = new CoordinateSearchStore();
        assert.equal(coordinateSearchStore.convertDDMToDD("51", "56.108220", "51° 56.108220 N")
            , 51.935137);
        assert.equal(coordinateSearchStore.convertDDMToDD("51", "56.108220", "51° 56.108220 S")
            , -51.935137);
        assert.equal(coordinateSearchStore.convertDDMToDD("7", "39.150360", "7° 39.150360 E").toFixed(6)
            , 7.652506);
        assert.equal(coordinateSearchStore.convertDDMToDD("7", "39.150360", "7° 39.150360 W").toFixed(6)
            , -7.652506);
        assert.equal(coordinateSearchStore.convertDDMToDD("-7", "39.150360", "-7° 39.150360").toFixed(6)
            , -7.652506);
    });

    it("extract numbers", function(){
        const coordinateSearchStore = new CoordinateSearchStore();
        assert.deepEqual(coordinateSearchStore.parseCoord("51° 56' 6.4932 N"), ["51", "56", "6.4932"]);
        assert.deepEqual(coordinateSearchStore.parseCoord("-51° 56' 6.4932 N"), ["-51", "56", "6.4932"]);
    });

    it("find coordinates", function(){
        const coordinateSearchStore = new CoordinateSearchStore();
        const latitude = 51.935137;
        const longitude = 7.652506;
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° N 7.652506 ° E", [])[0].latitude,
            latitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° N 7.652506 ° E", [])[0].longitude,
            longitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° 7.652506 °", [])[0].latitude,
            latitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° 7.652506 °", [])[0].longitude,
            longitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° 7.652506 °", [])[1].latitude,
            longitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51.935137 ° 7.652506 °", [])[1].longitude,
            latitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51° 56.108220 N 7° 39.150360 E", [])[0].latitude.toFixed(6),
            latitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51° 56.108220 N 7° 39.150360 E", [])[0].longitude.toFixed(6),
            longitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51° 56' 6.4932 N 7° 39' 9.0216 E", [])[0].latitude.toFixed(6),
            latitude);
        assert.equal(coordinateSearchStore.extractCoordinatesfromString("51° 56' 6.4932 N 7° 39' 9.0216 E", [])[0].longitude.toFixed(6),
            longitude);
        assert.deepEqual(coordinateSearchStore.extractCoordinatesfromString("181° 56' 6.4932 N 7° 39' 9.0216 E", []),
            []);
        assert.deepEqual(coordinateSearchStore.extractCoordinatesfromString("151.935137 ° N 7.652506 ° E", []),
            []);
    });

});


