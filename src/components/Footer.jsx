// componentes/Footer.jsx
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Container,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#0f172a",
        color: "white",
        mt: 8,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={1.5}
          textAlign="center"
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Desenvolvido por <strong>Diego Serra</strong>
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              component="a"
              href="https://wa.me/5524981256546"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#25D366",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.linkedin.com/in/diego-serra-de-andrade-038784220"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#0A66C2",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} Apoio Ubá
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;