import { Box, Container } from "@mui/material";
import { ContainerProps } from "@mui/material/Container";
import React from "react";
import styles from "../../styles/Login.module.scss";

const BoxContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <Box
      sx={{ minHeight: { xs: "unset", sm: "calc( 100vh - 200px)" } }}
      className={styles.BackgroundSecondaryColor}
    >
      <Container {...props}>{children}</Container>
    </Box>
  );
};

export default BoxContainer;
