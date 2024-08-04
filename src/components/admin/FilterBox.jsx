import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';

const FilterBox = ({ statuses, handleStatusChange, handleSubmit }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      p={1}
      border={1}
      borderColor="grey.400"
      borderRadius={4}
      mb={2}
      style={{ width: '200px', fontSize: '12px' }}
    >
      <Typography variant="subtitle1" style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
        Filter by Status
      </Typography>
      {['pending', 'rejected', 'submitted', 'approved'].map((status) => (
        <FormControlLabel
          key={status}
          control={
            <Checkbox
              checked={statuses[status]}
              onChange={() => handleStatusChange(status)}
              name={status}
              color="primary"
              style={{ transform: 'scale(0.8)' }}
            />
          }
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          style={{ fontSize: '12px' }}
        />
      ))}

    </Box>
  );
};

export default FilterBox;
