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

module.exports = {
    root: ({
        bundleName: "Coordinate Search",
        bundleDescription: "The Coordinate Search bundle adds the option to search coordinates in multiple reference systems via the search-ui.",
        ui: {
            decimal: {
                storeTitle: "Coordinate Search Decimal Degrees (Latituted, Lonitude)",
                storeDescription: "Store for finding locations based on decimal degree coordinates.",
                help: "No coordinates found. Try the following format \n (51.935126, 7.652517)"
            },
            utm: {
                storeTitle: "Koordinatensuche UTM (Zone, Easting, Northing)",
                storeDescription: "Store for finding locations based on UTM coordinates.",
                help: "No coordinates found. Try the following format \n (32U 407362 5754680)"
            },
            gk: {
                storeTitle: "Coordinate Search GK (Easting, Northing)",
                storeDescription: "Store for finding locations based on Gauss Krüger coordinates.",
                help: "No coordinates found. Try the following format \n (3407402.332, 5756542.860)"
            },
            pm: {
                storeTitle: "Coordinate Search Pseudo Mercator (Esting, Northing)",
                storeDescription: "SStore for finding locations based on Pseudo-Mercator Koordinaten.",
                help: "No coordinates found. Try the following format \n (851872.403 6788406.058)"
            }
        }
    }),
    "de": true
};
