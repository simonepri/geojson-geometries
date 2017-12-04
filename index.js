'use strict';

const POINT = 'Point';
const MULTI_POINT = 'MultiPoint';
const LINE_STRING = 'LineString';
const MULTI_LINE_STRING = 'MultiLineString';
const POLYGON = 'Polygon';
const MULTI_POLYGON = 'MultiPolygon';
const GEOMETRY_COLLECTION = 'GeometryCollection';
const FEATURE = 'Feature';
const FEATURE_COLLECTION = 'FeatureCollection';

class GeoJsonGeometries {
  /**
   * Create an instance of the geometries extractor.
   * @public
   * @param  {Object} geojson The geojson from which extract the geometries.
   * @param  {Object} [options] Optional options.
   * @param  {boolean} options.ignorePoints If true the extractor will ignore
   *  geometries of type Point
   * @param  {boolean} options.ignoreLines If true the extractor will ignore
   *  geometries of type LineString
   * @param  {boolean} options.ignorePolygon If true the extractor will ignore
   *  geometries of type Polygon
   */
  constructor(geojson, options) {
    options = options === undefined ? {} : options;
    this.pointsList = options.ignorePoints === true ? undefined : [];
    this.linesList = options.ignoreLines === true ? undefined : [];
    this.polygonsList = options.ignorePolygons === true ? undefined : [];

    this._loadGeneric(geojson);
  }
  /**
   * Returns the list of geometries of type Point found in the geojson.
   * @public
   * @return {Object[]} The list of points with inherited properties if any.
   */
  get points() {
    return this.pointsList || [];
  }
  /**
   * Returns the list of geometries of type LineString found in the geojson.
   * @public
   * @return {object[]} The list of lines with inherited properties if any.
   */
  get lines() {
    return this.linesList || [];
  }
  /**
   * Returns the list of geometries of type Polygon found in the geojson.
   * @public
   * @return {object[]} The list of polygons with inherited properties if any.
   */
  get polygons() {
    return this.polygonsList || [];
  }

  _loadGeneric(geojson, properties) {
    if (this.pointsList !== undefined) {
      switch (geojson.type) {
        case POINT: {
          return this._loadPoint(geojson.coordinates, properties);
        }
        case MULTI_POINT: {
          return geojson.coordinates.forEach(coordinates => this._loadPoint(coordinates, properties));
        }
        default: break;
      }
    }
    if (this.linesList !== undefined) {
      switch (geojson.type) {
        case LINE_STRING: {
          return this._loadLine(geojson.coordinates, properties);
        }
        case MULTI_LINE_STRING: {
          return geojson.coordinates.forEach(coordinates => this._loadLine(coordinates, properties));
        }
        default: break;
      }
    }
    if (this.polygonsList !== undefined) {
      switch (geojson.type) {
        case POLYGON: {
          return this._loadPolygon(geojson.coordinates, properties);
        }
        case MULTI_POLYGON: {
          return geojson.coordinates.forEach(coordinates => this._loadPolygon(coordinates, properties));
        }
        default: break;
      }
    }
    switch (geojson.type) {
      case FEATURE: {
        return this._loadGeneric(geojson.geometry, geojson.properties);
      }
      case FEATURE_COLLECTION: {
        return geojson.features.forEach(feature => this._loadGeneric(feature.geometry, feature.properties));
      }
      case GEOMETRY_COLLECTION: {
        return geojson.geometries.forEach(geometry => this._loadGeneric(geometry, properties));
      }
      default: break;
    }
  }

  _loadPoint(coordinates, properties) {
    this.pointsList.push({coordinates, properties});
  }
  _loadLine(coordinates, properties) {
    this.linesList.push({coordinates, properties});
  }
  _loadPolygon(coordinates, properties) {
    this.polygonsList.push({coordinates, properties});
  }
}

module.exports = GeoJsonGeometries;
