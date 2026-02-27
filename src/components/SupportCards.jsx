import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";

const SupportCards = ({ pontos = [], cor }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {}
      );
    }
  }, []);

  if (!pontos.length) return null;

  const obterCoordenadas = (ponto) => {
    const lat = parseFloat(
      ponto.latitude ?? ponto.lat ?? ponto?.location?.lat
    );

    const lng = parseFloat(
      ponto.longitude ?? ponto.lng ?? ponto?.location?.lng
    );

    if (isNaN(lat) || isNaN(lng)) return null;

    return { lat, lng };
  };

  const abrirNavegacao = (ponto) => {
    const coords = obterCoordenadas(ponto);
    if (!coords) return;

    let url = "";

    if (userLocation) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${coords.lat},${coords.lng}&travelmode=driving`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    }

    window.location.href = url;
  };

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
        {pontos.map((ponto) => {
          const coords = obterCoordenadas(ponto);
          const temItens =
            Array.isArray(ponto.itens_recebidos) &&
            ponto.itens_recebidos.length > 0;

          return (
            <Card
              key={ponto.id}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
            >
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

                {/* 🔹 Label dos Itens */}
                {temItens && (
                  <>
                    <Divider sx={{ mb: 1.5 }} />

                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "text.secondary",
                      }}
                    >
                      Itens aceitos:
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: coords ? 2 : 0,
                      }}
                    >
                      {ponto.itens_recebidos.map((item, index) => (
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
                  </>
                )}

                {coords && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DirectionsIcon />}
                    onClick={() => abrirNavegacao(ponto)}
                    sx={{
                      backgroundColor: cor?.principal || "#2e7d32",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Como chegar
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default SupportCards;