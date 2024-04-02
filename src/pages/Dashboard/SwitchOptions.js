// SwitchOptions.js
import React from 'react';
import { FormControl, Typography, ToggleButton, ToggleButtonGroup, FormLabel } from '@mui/material';
import './SwitchOptions.css'; // Import CSS file for SwitchOptions
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const SwitchOptions = ({ label, options, defaultValue, setSelectedValue }) => {
  const theme = useTheme(); // Get the current theme
  const [value, setValue] = React.useState(defaultValue); // Initial value
  
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setValue(newValue);
      setSelectedValue(newValue); // Update the selected value in the parent component
    }
  };

  return (
    <FormControl component="fieldset" className="switch-options-container">
      <FormLabel component="legend">
        <Typography variant="subtitle1">{label}</Typography>
      </FormLabel>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
        size="small"
        className="toggle-button-group"
      >
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value} className="toggle-button" >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SwitchOptions;
