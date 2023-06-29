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
    bundleName: "Koordinatensuche",
    bundleDescription: "Das Koordinatensuche Bundle erlaubt das Suchen von Koordinaten in verschiedenen Referenzsystemen mittel der Search-UI.",
    ui: {
        decimal: {
            storeTitle: "Koordinatensuche Dezimalgrad (Breitengrad, Längengrad)",
            storeDescription: "Store zum finden von Standorten basierend auf Dezimalgrad Koordinaten.",
            help: "Keine Koordinaten gefunden. Probiere folgendes Format \n (51.935126, 7.652517)"
        },
        utm: {
            storeTitle: "Koordinatensuche UTM (Zone, Ost, Nord)",
            storeDescription: "Store zum finden von Standorten basierend auf UTM Koordinaten.",
            help: "Keine Koordinaten gefunden. Probiere folgendes Format \n (32U 407362 5754680)"
        },
        gk: {
            storeTitle: "Koordinatensuche GK (Rechtswert, Hochwert)",
            storeDescription: "Store zum finden von Standorten basierend auf Gauss Krüger Koordinaten.",
            help: "Keine Koordinaten gefunden. Probiere folgendes Format \n (3407402.332, 5756542.860)"
        }
    }
};
