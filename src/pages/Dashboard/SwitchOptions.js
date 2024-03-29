import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

const SwitchOptions = ({ label, options, defaultValue, setSelectedValue }) => {
  const [value, setValue] = React.useState(defaultValue); // Initial value
  
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setValue(newValue);
      setSelectedValue(newValue); // Update the selected value in the parent component
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        <Typography variant="subtitle1">{label}</Typography>
      </FormLabel>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
        size="small"
      >
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SwitchOptions;
