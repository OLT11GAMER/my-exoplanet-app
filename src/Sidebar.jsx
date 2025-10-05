import { Box, Typography, Divider } from '@mui/material';

const Sidebar = ({ selectedStar, predictions }) => {
  return (
    <Box sx={{ position: 'absolute', top: 10, left: 10, width: 250, bgcolor: 'white', p: 2, borderRadius: 2, maxHeight: '80vh', overflowY: 'auto' }}>
      <Typography variant="h6">Star Details</Typography>
      {selectedStar ? (
        <>
          <Typography>ID: {selectedStar.id}</Typography>
          <Typography>RA: {selectedStar.ra.toFixed(2)}°</Typography>
          <Typography>Dec: {selectedStar.dec.toFixed(2)}°</Typography>
          <Typography>Temperature: {selectedStar.teff || 'Unknown'} K</Typography>
          <Typography>
            Exoplanet Probability: {predictions[selectedStar.id] ? `${(predictions[selectedStar.id] * 100).toFixed(1)}%` : 'Not predicted'}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Planets: {selectedStar.planets?.length || 0}</Typography>
          {selectedStar.planets?.map(p => (
            <Box key={p.id} sx={{ mt: 1 }}>
              <Typography>Planet: {p.toi || p.koi_name}</Typography>
              <Typography>Radius: {p.pl_rade || 'Unknown'} R⊕</Typography>
              <Typography>Period: {p.pl_orbper || 'Unknown'} days</Typography>
            </Box>
          ))}
        </>
      ) : (
        <Typography>Select a star to view details</Typography>
      )}
    </Box>
  );
};

export default Sidebar;