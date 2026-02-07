import fs from 'fs';
import path from 'path';
import https from 'https';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const topojson = require('topojson-client');

// Candidate URLs for continents geometry
// Some are TopoJSON, some are GeoJSON
const CANDIDATES = [
    {
        url: 'https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/continents.json',
        type: 'geojson'
    },
    {
        url: 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json', // Might be 404
        type: 'topojson',
        objectKey: 'continent'
    },
    {
        url: 'https://raw.githubusercontent.com/commune-io/topojson-world-continents/master/world-continents.json', // Another mirror
        type: 'topojson',
        objectKey: 'continent'
    },
    {
        // Natural Earth countries, aggregated? No, too complex.
        // Let's try another source
        url: 'https://raw.githubusercontent.com/rapomon/geojson-places/master/data/continents.json',
        type: 'geojson' // But this might be just data. We filter if "features" array exists.
    }
];

const OUTPUT_PATH = path.resolve('public/continents.geo.json');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            // Handle Redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log(`Redirecting to ${res.headers.location}...`);
                fetchUrl(res.headers.location).then(resolve).catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                res.resume(); // Consume
                reject(new Error(`Status: ${res.statusCode} for ${url}`));
                return;
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
    });
}

async function convertAndSave(data, type, objectKey) {
    let geoData;
    if (type === 'topojson') {
        console.log(`Converting TopoJSON (key: ${objectKey})...`);
        if (!data.objects || !data.objects[objectKey]) {
            throw new Error(`TopoJSON objects.${objectKey} not found. Available keys: ${data.objects ? Object.keys(data.objects).join(', ') : 'none'}`);
        }
        geoData = topojson.feature(data, data.objects[objectKey]);
    } else {
        // GeoJSON
        console.log('Using GeoJSON...');
        if (data.type !== 'FeatureCollection') {
            // Maybe it's a list?
            if (Array.isArray(data)) {
                // Check if items are features?
                if (data[0] && data[0].geometry) {
                    geoData = { type: 'FeatureCollection', features: data };
                } else {
                    throw new Error('JSON is array but not Features');
                }
            } else {
                // Maybe single Feature?
                if (data.type === 'Feature') {
                    geoData = { type: 'FeatureCollection', features: [data] };
                } else {
                    console.log('JSON structure:', Object.keys(data));
                    throw new Error('Invalid GeoJSON structure');
                }
            }
        } else {
            geoData = data;
        }
    }

    // Validate basic Geometry
    if (!geoData.features || geoData.features.length === 0) {
        throw new Error('No features found in converted GeoJSON');
    }

    console.log(`Writing ${geoData.features.length} features to ${OUTPUT_PATH}...`);
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(geoData));
    console.log('Success!');
}

async function generate() {
    console.log('Starting continent generation...');

    for (const candidate of CANDIDATES) {
        try {
            console.log(`Trying ${candidate.url}...`);
            const data = await fetchUrl(candidate.url);
            await convertAndSave(data, candidate.type, candidate.objectKey);
            return; // Success, exit
        } catch (error) {
            console.warn(`Failed with ${candidate.url}:`, error.message);
            // Continue to next candidate
        }
    }

    console.error('All candidates failed.');
    process.exit(1);
}

generate();
