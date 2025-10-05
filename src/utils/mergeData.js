// utils/mergeData.js
import Papa from 'papaparse';

export const loadAndMergeData = async () => {
  const kepler = await fetch('/data/kepler_cumulative.csv').then(res => res.text());
  const toi = await fetch('/data/toi.csv').then(res => res.text());

  const parsedKepler = Papa.parse(kepler, { header: true, dynamicTyping: true }).data;
  const parsedToi = Papa.parse(toi, { header: true, dynamicTyping: true }).data;

  // Standardize columns (examples; adjust based on actual headers)
  parsedKepler.forEach(row => {
    row.source = 'kepler';
    row.teff = row.koi_teff || row.st_teff; // Merge temp fields
    row.id = row.kepid || row.tid; // Unique ID
    // Add defaults or clean NaNs
    if (isNaN(row.ra) || isNaN(row.dec)) row.valid = false;
  });

  parsedToi.forEach(row => {
    row.source = 'toi';
    row.teff = row.st_teff;
    row.id = row.toi || row.tid;
    // Use decimal ra/dec directly (ignore rastr/decstr)
  });

  // Filter confirmed (optional)
  const filteredKepler = parsedKepler.filter(row => row.koi_disposition === 'CONFIRMED' && row.valid !== false);
  const filteredToi = parsedToi.filter(row => row.tfopwg_disp === 'KP' || row.tfopwg_disp === 'CP');

  // Concatenate
  const merged = [...filteredKepler, ...filteredToi];

  // Dedupe if overlap (e.g., by approximate ra/dec)
  const unique = [];
  const seen = new Set();
  merged.forEach(row => {
    const key = `${Math.round(row.ra * 100)}-${Math.round(row.dec * 100)}`; // Tolerance for matches
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(row);
    }
  });

  return unique;
};

// In App.jsx:
const [data, setData] = useState([]);
useEffect(() => {
  loadAndMergeData().then(setData);
}, []);