import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";

const SupportCards = ({ pontos = [], cor }) => {
  if (!pontos.length) return null;

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {pontos.map((ponto) => (
          <Card
            key={ponto.id}
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px)",
              },
            }}
          >
            {/* Barra lateral */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "6px",
                background:
                  cor?.gradiente ||
                  "linear-gradient(180deg, #2e7d32, #4caf50)",
              }}
            />

            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {ponto.nome}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ color: cor?.principal }} />
                <Typography variant="body2">
                  {ponto.endereco}, {ponto.bairro}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon sx={{ color: cor?.principal }} />
                <Typography variant="body2">
                  {ponto.horario}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <PhoneIcon sx={{ color: cor?.principal }} />
                <Typography variant="body2">
                  {ponto.telefone}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {(ponto.itens_recebidos || []).map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: `${cor?.principal}15`,
                      border: `1px solid ${cor?.principal}`,
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.4,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: cor?.principal,
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default SupportCards;