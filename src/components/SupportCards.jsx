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

const SupportCards = ({ pontos }) => {
  if (!pontos || pontos.length === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        pb: 6,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 3,
        }}
      >
        {pontos.map((ponto) => (
          <Card
            key={ponto.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              transition: "all 0.25s ease",
              overflow: "hidden",
              backgroundColor: "#fff",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              },
            }}
          >
            {/* Barra lateral verde */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "6px",
                background: "linear-gradient(180deg, #2e7d32, #4caf50)",
              }}
            />

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  lg: 2, // 🔥 reduz padding no desktop
                },
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1rem",
                    lg: "0.9rem", // 🔥 título menor no desktop
                  },
                }}
              >
                {ponto.nome}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={{
                  xs: 1,
                  lg: 0.5, // 🔥 menos espaço vertical
                }}
              >
                <LocationOnIcon
                  fontSize="small"
                  sx={{ color: "#2e7d32", fontSize: { lg: 18 } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      lg: "0.8rem",
                    },
                  }}
                >
                  {ponto.endereco}, {ponto.bairro}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={{
                  xs: 1,
                  lg: 0.5,
                }}
              >
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ color: "#2e7d32", fontSize: { lg: 18 } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      lg: "0.8rem",
                    },
                  }}
                >
                  {ponto.horario}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <PhoneIcon
                  fontSize="small"
                  sx={{ color: "#2e7d32", fontSize: { lg: 18 } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      lg: "0.8rem",
                    },
                  }}
                >
                  {ponto.telefone}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: {
                    xs: 1,
                    lg: 0.7, // 🔥 menor espaçamento
                  },
                  mt: "auto",
                }}
              >
                {ponto.itens_recebidos.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#f1f8f4",
                      border: "1px solid #c8e6c9",
                      borderRadius: 1.5,
                      px: {
                        xs: 1.2,
                        lg: 1,
                      },
                      py: {
                        xs: 0.6,
                        lg: 0.4,
                      },
                      fontSize: {
                        xs: "0.75rem",
                        lg: "0.7rem",
                      },
                      fontWeight: 500,
                      color: "#2e7d32",
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