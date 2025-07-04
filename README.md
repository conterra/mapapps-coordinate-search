# Coordinate Search
The Coordinate Search bundle adds the functionality to search for coordinates in multiple reference systems.

## Build Status

![example workflow](https://github.com/conterra/mapapps-devnet-blueprint/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)


## Sample App
[https://demos.conterra.de/mapapps/resources/apps/downloads_coordinatesearch/index.html](https://demos.conterra.de/mapapps/resources/apps/download_coordinatesearch/index.html)

![Screenshot Sample App Coordinate Search](https://github.com/conterra/mapapps-coordinate-search/blob/main/screenshot.png)

## Installation Guide
**Requirement: map.apps 4.12.0**

[dn_coordinatesearch Documentation](https://github.com/conterra/mapapps-coordinate-search/tree/main/src/main/js/bundles/dn_coordinatesearch)

## Development Guide
## Quick start

Clone this project and ensure that you have all required dependencies installed correctly (see [Documentation](https://docs.conterra.de/en/mapapps/latest/developersguide/getting-started/set-up-development-environment.html)).

Then run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
