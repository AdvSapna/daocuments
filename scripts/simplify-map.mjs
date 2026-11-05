// Builds public/countries.geojson, the world map shown on the site.
//
// Source: https://github.com/datasets/geo-countries (data/countries.geojson,
// about 14.6 MB). The map only needs world-scale detail, so this keeps the two
// properties the app reads, drops points with Douglas-Peucker simplification
// and rounds coordinates. Every country keeps its shape.
//
// Usage: node scripts/simplify-map.mjs <path to countries.geojson> [tolerance]

import { readFileSync, writeFileSync } from 'node:fs';

const [input, toleranceArg] = process.argv.slice(2);
if (!input) {
  throw new Error('Usage: node scripts/simplify-map.mjs <countries.geojson> [tolerance]');
}

const TOLERANCE = Number(toleranceArg ?? 0.05); // degrees
const DECIMALS = 2; // about 1 km, finer than a pixel at world zoom
const KEEP_PROPERTIES = ['name', 'ISO3166-1-Alpha-2'];

const round = n => Math.round(n * 10 ** DECIMALS) / 10 ** DECIMALS;

function perpendicularDistance([x, y], [x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

// Iterative Douglas-Peucker, keeping the first and last point.
function simplifyLine(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxDistance = 0;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const d = perpendicularDistance(points[i], points[start], points[end]);
      if (d > maxDistance) {
        maxDistance = d;
        index = i;
      }
    }
    if (index !== -1 && maxDistance > tolerance) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function signedArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return area / 2;
}

const ringArea = ring => Math.abs(signedArea(ring));

function simplifyRing(ring, tolerance) {
  const rounded = ring.map(([x, y]) => [round(x), round(y)]);
  const deduped = rounded.filter((p, i) => i === 0 || p[0] !== rounded[i - 1][0] || p[1] !== rounded[i - 1][1]);
  const simplified = simplifyLine(deduped, tolerance);
  // A valid closed ring needs at least 4 points (first point repeated last).
  if (simplified.length < 4) return null;
  // Drop rings that collapsed or flipped direction. The map library reads a
  // reversed ring as "the whole globe except this shape" and paints over the
  // entire map.
  const before = signedArea(ring);
  const after = signedArea(simplified);
  if (after === 0 || Math.sign(after) !== Math.sign(before)) return null;
  return simplified;
}

function simplifyPolygon(polygon, tolerance) {
  const [outer, ...holes] = polygon;
  const simplifiedOuter = simplifyRing(outer, tolerance);
  if (!simplifiedOuter) return null;
  return [simplifiedOuter, ...holes.map(h => simplifyRing(h, tolerance)).filter(Boolean)];
}

function simplifyGeometry(geometry, tolerance) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let kept = polygons.map(p => simplifyPolygon(p, tolerance)).filter(Boolean);
  if (kept.length === 0) {
    // Keep tiny countries visible: fall back to the largest original polygon,
    // unchanged, so rounding cannot collapse or flip it.
    const largest = polygons.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
    kept = [largest];
  }
  return kept.length === 1
    ? { type: 'Polygon', coordinates: kept[0] }
    : { type: 'MultiPolygon', coordinates: kept };
}

const source = JSON.parse(readFileSync(input, 'utf8'));
const output = {
  type: 'FeatureCollection',
  features: source.features.map(feature => ({
    type: 'Feature',
    properties: Object.fromEntries(KEEP_PROPERTIES.map(key => [key, feature.properties[key]])),
    geometry: simplifyGeometry(feature.geometry, TOLERANCE),
  })),
};

writeFileSync('public/countries.geojson', JSON.stringify(output));
console.log(`Wrote public/countries.geojson: ${output.features.length} countries, tolerance ${TOLERANCE}`);
