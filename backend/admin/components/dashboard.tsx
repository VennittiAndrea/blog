import { ThemeProvider } from "styled-components";
import { theme, Button, Box, Icon, Reset } from "@adminjs/design-system";

const Dashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <Box variant="grey">
        <Box variant="white">Go to sidebar to manage the system. This is just the basis.</Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
