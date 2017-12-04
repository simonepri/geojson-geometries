# geojson-geometries
[![Travis CI](https://travis-ci.org/simonepri/geojson-geometries.svg?branch=master)](https://travis-ci.org/simonepri/geojson-geometries) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/geojson-geometries/master.svg)](https://codecov.io/gh/simonepri/geojson-geometries) [![npm](https://img.shields.io/npm/dm/geojson-geometries.svg)](https://www.npmjs.com/package/geojson-geometries) [![npm version](https://img.shields.io/npm/v/geojson-geometries.svg)](https://www.npmjs.com/package/geojson-geometries) [![npm dependencies](https://david-dm.org/simonepri/geojson-geometries.svg)](https://david-dm.org/simonepri/geojson-geometries) [![npm dev dependencies](https://david-dm.org/simonepri/geojson-geometries/dev-status.svg)](https://david-dm.org/simonepri/geojson-geometries#info=devDependencies)
> ⛏ Extract elementary geometries from a GeoJSON inheriting properties.

## Install
```bash
$ npm install --save geojson-geometries
```

## Usage
```javascript
const GeoJsonGeometries = require('geojson-geometries');

const geojson = {type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5]
    },
    properties: {prop0: 'value0'}
  }, {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
    },
    properties: {prop1: 'value1'}
  }, {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    properties: {prop2: 'value2'}
  }]
};

const extracted = new GeoJsonGeometries(geojson);

console.log(extracted.points);
// => [{
//   coordinates: [102, 0.5],
//   properties: {prop0: 'value0'}
// }]

console.log(extracted.lines);
// => [{
//   coordinates: [[[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]],
//   properties: { prop1: 'value1' }
// }]
//
console.log(extracted.polygons);
// => [{
//   coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
//   properties: {prop2: 'value2'}
// }]
```

## API
<a name="new_GeoJsonGeometries_new"></a>

### new GeoJsonGeometries(geojson, [options])
Create an instance of the geometries extractor.

| Param | Type | Description |
| --- | --- | --- |
| geojson | <code>Object</code> | The geojson from which extract the geometries. |
| [options] | <code>Object</code> | Optional options. |
| options.ignorePoints | <code>boolean</code> | If true the extractor will ignore  geometries of type Point |
| options.ignoreLines | <code>boolean</code> | If true the extractor will ignore  geometries of type LineString |
| options.ignorePolygon | <code>boolean</code> | If true the extractor will ignore  geometries of type Polygon |

<a name="GeoJsonGeometries+points"></a>

### geoJsonGeometries.points ⇒ <code>Array.&lt;Object&gt;</code>
Returns the list of geometries of type Point found in the geojson.

**Returns**: <code>Array.&lt;Object&gt;</code> - The list of points with inherited properties if any.  

<a name="GeoJsonGeometries+lines"></a>

### geoJsonGeometries.lines ⇒ <code>Array.&lt;object&gt;</code>
Returns the list of geometries of type LineString found in the geojson.

**Returns**: <code>Array.&lt;object&gt;</code> - The list of lines with inherited properties if any.  

<a name="GeoJsonGeometries+polygons"></a>

### geoJsonGeometries.polygons ⇒ <code>Array.&lt;object&gt;</code>
Returns the list of geometries of type Polygon found in the geojson.

**Returns**: <code>Array.&lt;object&gt;</code> - The list of polygons with inherited properties if any.  

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/world-country/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
