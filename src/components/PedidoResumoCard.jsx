import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function PedidoResumoCards({ resumo }) {
  const cards = [
    {
      label: "Total",
      value: resumo.total,
      icon: <Inventory2Icon />,
      bg: "#e0f2fe",
      color: "#0284c7",
      border: "#e2e8f0",
    },
    {
      label: "Pendentes",
      value: resumo.pendentes,
      icon: <PendingActionsIcon />,
      bg: "#ffedd5",
      color: "#ea580c",
      border: "#fed7aa",
    },
    {
      label: "Entregues",
      value: resumo.entregues,
      icon: <CheckCircleIcon />,
      bg: "#d1fae5",
      color: "#059669",
      border: "#bbf7d0",
    },
  ];

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={4}>
      {cards.map((item, i) => (
        <Card key={i} sx={{ flex: 1, borderRadius: 3, border: `1px solid ${item.border}` }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ background: item.bg, p: 1.5, borderRadius: 2, color: item.color }}>
                {item.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2">{item.label}</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default PedidoResumoCards;