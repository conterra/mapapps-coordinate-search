# Coordinate Search
The Coordinate Search bundle adds the functionality to search for coordinates in multiple reference systems.

## Build Status

![example workflow](https://github.com/conterra/mapapps-devnet-blueprint/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)


## Sample App
[https://demos.conterra.de/mapapps/resources/apps/downloads_coordinatesearch/index.html](https://demos.conterra.de/mapapps/resources/apps/download_coordinatesearch/index.html)

![Screenshot Sample App Coordinate Search](https://github.com/conterra/mapapps-coordinate-search/blob/main/screenshot.JPG)

## Installation Guide
**Requirement: map.apps 4.12.0**

[dn_coordinatesearch Documentation](https://github.com/conterra/mapapps-coordinate-search/tree/main/src/main/js/bundles/dn_coordinatesearch)

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to define the mapapps.remote.base property.
1. Goal parameters
   `mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
   Change the mapapps.remote.base in the build.properties file and run:
   `mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`

