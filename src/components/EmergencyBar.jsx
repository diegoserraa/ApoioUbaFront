import React from "react";
import { Box, Typography } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const numeros = [
  {
    nome: "Bombeiros",
    numero: "193",
    color: "#d32f2f",
    icon: LocalFireDepartmentIcon,
  },
  {
    nome: "SAMU",
    numero: "192",
    color: "#1976d2",
    icon: MedicalServicesIcon,
  },
  {
    nome: "Polícia",
    numero: "190",
    color: "#388e3c",
    icon: SecurityIcon,
  },
  {
    nome: "Defesa Civil",
    numero: "199",
    color: "#f57c00",
    icon: WarningAmberIcon,
  },
];

const EmergencyBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff3f3",
        py: 2,
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {numeros.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <Box
              key={index}
              component="a"
              href={`tel:${item.numero}`}
              sx={{
                flex: 1, // todos ocupam espaço igual
                height: 70,
                margin: "0 6px",
                borderRadius: 3,
                backgroundColor: item.color,
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 0.9,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <IconComponent sx={{ fontSize: 24 }} />
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                }}
              >
                {item.numero}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  opacity: 0.9,
                }}
              >
                {item.nome}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EmergencyBar;