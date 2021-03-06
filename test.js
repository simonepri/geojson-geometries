const test = require('ava');

const M = require('.');

test('should do nothing for an empty geojson', t => {
  const geojson = {};
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 0);
});

test('should extract a Point', t => {
  const geojson = {
    type: 'Point',
    coordinates: [100, 0]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 1);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 0);

  t.deepEqual(
    geometries.points.features[0].geometry.coordinates,
    geojson.coordinates
  );
});

test('should extract a LineString', t => {
  const geojson = {
    type: 'LineString',
    coordinates: [
      [100, 0],
      [101, 1]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 1);
  t.is(geometries.polygons.features.length, 0);

  t.deepEqual(
    geometries.lines.features[0].geometry.coordinates,
    geojson.coordinates
  );
});

test('should extract a Polygon', t => {
  const geojson = {
    type: 'Polygon',
    coordinates: [
      [
        [100, 0],
        [101, 0],
        [101, 1],
        [100, 1],
        [100, 0]
      ]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 1);

  t.deepEqual(
    geometries.polygons.features[0].geometry.coordinates,
    geojson.coordinates
  );
});

test('should extract a Polygon with holes', t => {
  const geojson = {
    type: 'Polygon',
    coordinates: [
      [
        [100, 0],
        [101, 0],
        [101, 1],
        [100, 1],
        [100, 0]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2]
      ]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 1);

  t.deepEqual(
    geometries.polygons.features[0].geometry.coordinates,
    geojson.coordinates
  );
});

test('should extract a MultiPoint', t => {
  const geojson = {
    type: 'MultiPoint',
    coordinates: [
      [100, 0],
      [101, 1]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 2);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 0);

  t.deepEqual(
    geometries.points.features[0].geometry.coordinates,
    geojson.coordinates[0]
  );
  t.deepEqual(
    geometries.points.features[1].geometry.coordinates,
    geojson.coordinates[1]
  );
});

test('should extract a MultiLineString', t => {
  const geojson = {
    type: 'MultiLineString',
    coordinates: [
      [
        [100, 0],
        [101, 1]
      ],
      [
        [102, 2],
        [103, 3]
      ]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 2);
  t.is(geometries.polygons.features.length, 0);

  t.deepEqual(
    geometries.lines.features[0].geometry.coordinates,
    geojson.coordinates[0]
  );
  t.deepEqual(
    geometries.lines.features[1].geometry.coordinates,
    geojson.coordinates[1]
  );
});

test('should extract a MultiPolygon', t => {
  const geojson = {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [102, 2],
          [103, 2],
          [103, 3],
          [102, 3],
          [102, 2]
        ]
      ],
      [
        [
          [100, 0],
          [101, 0],
          [101, 1],
          [100, 1],
          [100, 0]
        ],
        [
          [100.2, 0.2],
          [100.8, 0.2],
          [100.8, 0.8],
          [100.2, 0.8],
          [100.2, 0.2]
        ]
      ]
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 2);

  t.deepEqual(
    geometries.polygons.features[0].geometry.coordinates,
    geojson.coordinates[0]
  );
  t.deepEqual(
    geometries.polygons.features[1].geometry.coordinates,
    geojson.coordinates[1]
  );
});

test('should extract a GeometryCollection', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [100, 0]
      },
      {
        type: 'LineString',
        coordinates: [
          [101, 0],
          [102, 1]
        ]
      }
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 1);
  t.is(geometries.lines.features.length, 1);
  t.is(geometries.polygons.features.length, 0);

  t.deepEqual(
    geometries.points.features[0].geometry.coordinates,
    geojson.geometries[0].coordinates
  );
  t.deepEqual(
    geometries.lines.features[0].geometry.coordinates,
    geojson.geometries[1].coordinates
  );
});

test('should extract a Feature', t => {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [100, 0],
          [101, 0],
          [101, 1],
          [100, 1],
          [100, 0]
        ]
      ]
    },
    properties: {
      prop0: 'value0',
      prop1: 'value1'
    }
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 1);

  t.deepEqual(geometries.polygons.features[0], geojson);
});

test('should extract a FeatureCollection', t => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [102, 0.5]
        },
        properties: {prop0: 'value0'}
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [102, 0],
            [103, 1],
            [104, 0],
            [105, 1]
          ]
        },
        properties: {prop1: 'value1'}
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [100, 0],
              [101, 0],
              [101, 1],
              [100, 1],
              [100, 0]
            ]
          ]
        },
        properties: {prop2: 'value2'}
      }
    ]
  };
  const geometries = new M(geojson);

  t.is(geometries.points.features.length, 1);
  t.is(geometries.lines.features.length, 1);
  t.is(geometries.polygons.features.length, 1);

  t.deepEqual(geometries.points.features[0], geojson.features[0]);
  t.deepEqual(geometries.lines.features[0], geojson.features[1]);
  t.deepEqual(geometries.polygons.features[0], geojson.features[2]);
});

test('should extract only a Point', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [100, 0]
      },
      {
        type: 'LineString',
        coordinates: [
          [101, 0],
          [102, 1]
        ]
      },
      {
        type: 'Polygon',
        coordinates: [
          [
            [100, 0],
            [101, 0],
            [101, 1],
            [100, 1],
            [100, 0]
          ]
        ]
      }
    ]
  };
  const geometries = new M(geojson, {ignoreLines: true, ignorePolygons: true});

  t.is(geometries.points.features.length, 1);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 0);
});

test('should extract only a Line', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [100, 0]
      },
      {
        type: 'LineString',
        coordinates: [
          [101, 0],
          [102, 1]
        ]
      },
      {
        type: 'Polygon',
        coordinates: [
          [
            [100, 0],
            [101, 0],
            [101, 1],
            [100, 1],
            [100, 0]
          ]
        ]
      }
    ]
  };
  const geometries = new M(geojson, {ignorePoints: true, ignorePolygons: true});

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 1);
  t.is(geometries.polygons.features.length, 0);
});

test('should extract only a Polygon', t => {
  const geojson = {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [100, 0]
      },
      {
        type: 'LineString',
        coordinates: [
          [101, 0],
          [102, 1]
        ]
      },
      {
        type: 'Polygon',
        coordinates: [
          [
            [100, 0],
            [101, 0],
            [101, 1],
            [100, 1],
            [100, 0]
          ]
        ]
      }
    ]
  };
  const geometries = new M(geojson, {ignorePoints: true, ignoreLines: true});

  t.is(geometries.points.features.length, 0);
  t.is(geometries.lines.features.length, 0);
  t.is(geometries.polygons.features.length, 1);
});
