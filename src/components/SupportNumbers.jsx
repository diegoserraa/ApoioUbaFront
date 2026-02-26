import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SecurityIcon from "@mui/icons-material/Security";
import EmergencyIcon from "@mui/icons-material/Emergency";

const numeros = [
  { nome: "Bombeiro", numero: "193", color: "#d32f2f", icon: LocalFireDepartmentIcon },
  { nome: "SAMU", numero: "192", color: "#1976d2", icon: MedicalServicesIcon },
  { nome: "Polícia Militar", numero: "190", color: "#388e3c", icon: SecurityIcon },
  { nome: "Defesa Civil", numero: "199", color: "#f57c00", icon: EmergencyIcon },
];

const SupportNumbers = () => {
  return (
    <Box sx={{ py: 2, width: "100%", backgroundColor: "#e3f2fd" }}>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}
      >
        Números de Emergência
      </Typography>

      <Grid
        container
        spacing={4} // aumenta o espaço entre linhas
        justifyContent="center" // centraliza os cards horizontalmente
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4 },
          gap: "32px", // aumenta o espaço entre os cards horizontalmente
        }}
      >
        {numeros.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Grid key={index} item xs="auto">
              <Paper
                sx={{
                  width: 120,       // largura do card
                  height: 120,      // altura do card
                  p: 1.5,
                  textAlign: "center",
                  borderRadius: 2,
                  border: "1px solid #cfd8dc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s, box-shadow 0.3s",
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
                    flexShrink: 0,
                  }}
                >
                  <IconComponent fontSize="inherit" />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 0.3, fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}
                >
                  {item.nome}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: item.color, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
                >
                  {item.numero}
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