import React from "react";
import { Box, Typography, Button } from "@mui/material";
import heroImage from "../assets/img10.jfif";

const Hero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 240, sm: 270, md: 300 },
        position: "relative",
        textAlign: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Imagem */}
      <Box
        component="img"
        src={heroImage}
        alt="Voluntários entregando mantimentos em Ubá"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          display: "block",
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Conteúdo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "1.7rem", md: "1.9rem" },
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            lineHeight: 1.2,
          }}
        >
          💙 Unidos por Ubá
        </Typography>

        <Typography
          sx={{
            maxWidth: 600,
            fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
            lineHeight: 1.5,
            mb: 2.5,
            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          Ubá foi fortemente atingida pelas chuvas, deixando famílias
          em situação de vulnerabilidade. Este site centraliza os pontos
          de arrecadação ativos na cidade e informa onde doar e quais
          itens são mais necessários.
        </Typography>

      </Box>
    </Box>
  );
};

export default Hero;