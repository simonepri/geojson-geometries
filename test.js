import test from 'ava';

import M from '.';

test('should do nothing for an empty geojson', t => {
  const geojson = {};
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 0);
});

test('should extract a Point', t => {
  const geojson = {
    type: 'Point',
    coordinates: [100.0, 0.0]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 1);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 0);

  t.deepEqual(geometries.points[0].coordinates, geojson.coordinates);
});

test('should extract a LineString', t => {
  const geojson = {
    type: 'LineString',
    coordinates: [[100.0, 0.0], [101.0, 1.0]]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 1);
  t.is(geometries.polygons.length, 0);

  t.deepEqual(geometries.lines[0].coordinates, geojson.coordinates);
});

test('should extract a Polygon', t => {
  const geojson = {
    type: 'Polygon',
    coordinates: [
      [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 1);

  t.deepEqual(geometries.polygons[0].coordinates, geojson.coordinates);
});

test('should extract a Polygon with holes', t => {
  const geojson = {
    type: 'Polygon',
    coordinates: [
      [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
      [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 1);

  t.deepEqual(geometries.polygons[0].coordinates, geojson.coordinates);
});

test('should extract a MultiPoint', t => {
  const geojson = {
    type: 'MultiPoint',
    coordinates: [[100.0, 0.0], [101.0, 1.0]]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 2);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 0);

  t.deepEqual(geometries.points[0].coordinates, geojson.coordinates[0]);
  t.deepEqual(geometries.points[1].coordinates, geojson.coordinates[1]);
});

test('should extract a MultiLineString', t => {
  const geojson = {
    type: 'MultiLineString',
    coordinates: [
      [[100.0, 0.0], [101.0, 1.0]],
      [[102.0, 2.0], [103.0, 3.0]]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 2);
  t.is(geometries.polygons.length, 0);

  t.deepEqual(geometries.lines[0].coordinates, geojson.coordinates[0]);
  t.deepEqual(geometries.lines[1].coordinates, geojson.coordinates[1]);
});

test('should extract a MultiPolygon', t => {
  const geojson = {
    type: 'MultiPolygon',
    coordinates: [
      [
        [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
      ], [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
      ]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 2);

  t.deepEqual(geometries.polygons[0].coordinates, geojson.coordinates[0]);
  t.deepEqual(geometries.polygons[1].coordinates, geojson.coordinates[1]);
});

test('should extract a GeometryCollection', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [{
      type: 'Point',
      coordinates: [100.0, 0.0]
    }, {
      type: 'LineString',
      coordinates: [[101.0, 0.0], [102.0, 1.0]]
    }]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 1);
  t.is(geometries.lines.length, 1);
  t.is(geometries.polygons.length, 0);

  t.deepEqual(geometries.points[0].coordinates, geojson.geometries[0].coordinates);
  t.deepEqual(geometries.lines[0].coordinates, geojson.geometries[1].coordinates);
});

test('should extract a Feature', t => {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    properties: {
      prop0: 'value0',
      prop1: 'value1'
    }
  };
  const geometries = new M(geojson);

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 1);

  t.deepEqual(geometries.polygons[0].coordinates, geojson.geometry.coordinates);

  t.deepEqual(geometries.polygons[0].properties, geojson.properties);
});

test('should extract a FeatureCollection', t => {
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
  const geometries = new M(geojson);

  t.is(geometries.points.length, 1);
  t.is(geometries.lines.length, 1);
  t.is(geometries.polygons.length, 1);

  t.deepEqual(geometries.points[0].coordinates, geojson.features[0].geometry.coordinates);
  t.deepEqual(geometries.lines[0].coordinates, geojson.features[1].geometry.coordinates);
  t.deepEqual(geometries.polygons[0].coordinates, geojson.features[2].geometry.coordinates);

  t.deepEqual(geometries.points[0].properties, geojson.features[0].properties);
  t.deepEqual(geometries.lines[0].properties, geojson.features[1].properties);
  t.deepEqual(geometries.polygons[0].properties, geojson.features[2].properties);
});

test('should extract only a Point', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [{
      type: 'Point',
      coordinates: [100.0, 0.0]
    }, {
      type: 'LineString',
      coordinates: [[101.0, 0.0], [102.0, 1.0]]
    }, {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    }]
  };
  const geometries = new M(geojson, {ignoreLines: true, ignorePolygons: true});

  t.is(geometries.points.length, 1);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 0);
});

test('should extract only a Line', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [{
      type: 'Point',
      coordinates: [100.0, 0.0]
    }, {
      type: 'LineString',
      coordinates: [[101.0, 0.0], [102.0, 1.0]]
    }, {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    }]
  };
  const geometries = new M(geojson, {ignorePoints: true, ignorePolygons: true});

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 1);
  t.is(geometries.polygons.length, 0);
});

test('should extract only a Polygon', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [{
      type: 'Point',
      coordinates: [100.0, 0.0]
    }, {
      type: 'LineString',
      coordinates: [[101.0, 0.0], [102.0, 1.0]]
    }, {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    }]
  };
  const geometries = new M(geojson, {ignorePoints: true, ignoreLines: true});

  t.is(geometries.points.length, 0);
  t.is(geometries.lines.length, 0);
  t.is(geometries.polygons.length, 1);
});
