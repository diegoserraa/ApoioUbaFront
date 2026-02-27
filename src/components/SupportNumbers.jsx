import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const opcoes = [
  {
    nome: "Onde Doar",
    tipo: "doacao",
    color: "#1976d2",
    icon: VolunteerActivismIcon,
  },
  {
    nome: "Alimentação",
    tipo: "comida",
    color: "#2e7d32",
    icon: RestaurantIcon,
  },
  {
    nome: "Abrigos",
    tipo: "abrigo",
    color: "#f57c00",
    icon: HomeIcon,
  },
  {
    nome: "Entregas",
    tipo: "entrega",
    color: "#c62828",
    icon: LocalShippingIcon,
  },
];

const SupportNumbers = ({ onChange }) => {
  const [selecionado, setSelecionado] = useState(opcoes[0].nome);
  const containerRef = useRef(null);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = (item) => {
    setSelecionado(item.nome);

    if (onChange) onChange(item.tipo);

    // 👇 Só executa em tela pequena
    if (isSmall && containerRef.current) {
      const topPosition =
        containerRef.current.getBoundingClientRect().top +
        window.pageYOffset;

      // Sobe só um pouco (ajuste aqui se quiser mais ou menos)
      window.scrollTo({
        top: topPosition - 90,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        py: 2,
        width: "100%",
        backgroundColor: "#e3f2fd",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
        }}
      >
        Central de Apoio
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4 },
          gap: "32px",
        }}
      >
        {opcoes.map((item, index) => {
          const IconComponent = item.icon;
          const isSelected = selecionado === item.nome;

          return (
            <Grid key={index} item xs="auto">
              <Paper
                onClick={() => handleSelect(item)}
                sx={{
                  width: 140,
                  height: 130,
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  cursor: "pointer",
                  border: isSelected
                    ? `2px solid ${item.color}`
                    : "1px solid #cfd8dc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: isSelected ? "#f5faff" : "#fff",
                  boxShadow: isSelected
                    ? "0 6px 18px rgba(0,0,0,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    color: "#fff",
                    fontSize: 26,
                  }}
                >
                  <IconComponent fontSize="inherit" />
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem" },
                  }}
                >
                  {item.nome}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SupportNumbers;