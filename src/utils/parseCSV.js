// utils/parseCSV.js
import Papa from 'papaparse';

export const loadExoplanetData = async (filePath) => {
  const response = await fetch(filePath);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
};

// In App.jsx or a context:
import { loadExoplanetData } from './utils/parseCSV';
const [data, setData] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    const toi = await loadExoplanetData('/data/toi.csv');
    const tess = await loadExoplanetData('/data/tess.csv');
    setData([...toi, ...tess]); // Merge datasets
  };
  fetchData();
}, []);