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
module.exports = {
    bundleName: "Koordinatensuche",
    bundleDescription: "Das Koordinatensuche Bundle erlaubt das Suchen von Koordinaten in verschiedenen Referenzsystemen mittel der Search-UI.",
    ui: {
        decimal: {
            storeTitle: "Koordinatensuche Dezimal (Breitengrad, Längengrad)",
            storeDescription: "Store zum finden von Standorten basierend auf Dezimalgrad Koordinaten."
        },
        utm: {
            storeTitle: "Koordinatensuche UTM (Zone, Ost, Nord)",
            storeDescription: "Store zum finden von Standorten basierend auf UTM Koordinaten."
        },
        gk: {
            storeTitle: "Koordinatensuche GK (Rechtswert, Hochwert)",
            storeDescription: "Store zum finden von Standorten basierend auf Gauss Krüger Koordinaten."
        }
    }
};
