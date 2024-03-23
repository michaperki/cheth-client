import React from "react";
import { Box, useTheme, Typography } from "@mui/material";

const StateBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: theme.palette.primary.main }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
            sx={{ color: theme.palette.text.secondary }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StateBox;