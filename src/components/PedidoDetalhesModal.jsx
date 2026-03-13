import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Chip,
  IconButton,
  Button,
  Divider,
  Paper,
  Box,
} from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

function PedidoDetalhesModal({
  open,
  onClose,
  pedido,
  onEntregar,
}) {
  if (!pedido) return null;

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  };

  const abrirMaps = () => {
    const endereco = `${pedido.endereco}, ${pedido.bairro}, Ubá MG`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`,
      "_blank"
    );
  };

  const abrirWhatsApp = () => {
    const numero = pedido.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  const getMotivoColor = (motivo) => {
    switch (motivo) {
      case "idoso":
        return "info";
      case "deficiencia":
        return "secondary";
      case "acamado":
        return "warning";
      case "mae_solo":
        return "success";
      case "sem_transporte":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
        }}
      >
        Detalhes do Pedido
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>

        {/* Nome */}
        <Typography variant="h6" fontWeight={700} mb={1}>
          {pedido.nome}
        </Typography>

        <Chip
          label={pedido.status || "pendente"}
          color={
            pedido.status === "entregue"
              ? "success"
              : "warning"
          }
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* TELEFONE */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Telefone
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{pedido.telefone}</Typography>
            <IconButton
              size="small"
              color="success"
              onClick={abrirWhatsApp}
            >
              <WhatsAppIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* ENDEREÇO */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Endereço
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              {pedido.endereco} - {pedido.bairro}
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={abrirMaps}
            >
              <LocationOnIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* ITENS */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Itens solicitados
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {pedido.itens?.map((item, index) => (
              <Chip
                key={index}
                label={item}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        {/* MOTIVO */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Motivo
          </Typography>
          <Chip
            label={pedido.justificativa_motivo}
            color={getMotivoColor(
              pedido.justificativa_motivo
            )}
          />
        </Box>

        {/* OBSERVAÇÃO */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Observação
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "#fafafa",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">
              {pedido.justificativa_obs ||
                "Nenhuma observação informada."}
            </Typography>
          </Paper>
        </Box>

        {/* DATA */}
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Enviado em: {formatarData(pedido.created_at)}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {pedido.status !== "entregue" && (
          <Button
            variant="contained"
            onClick={onEntregar}
          >
            Marcar como entregue
          </Button>
        )}
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PedidoDetalhesModal;