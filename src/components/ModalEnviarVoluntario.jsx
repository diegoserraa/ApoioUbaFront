import React, { useState, useEffect } from "react";
import { IMaskInput } from "react-imask";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

function ModalEnviarVoluntario({
  open,
  onClose,
  pedido,
  onEntregar,
}) {
  const [numeroVoluntario, setNumeroVoluntario] = useState("");
  const [nomeVoluntario, setNomeVoluntario] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // 🔥 Limpa campos ao fechar
  useEffect(() => {
    if (!open) {
      setNumeroVoluntario("");
      setNomeVoluntario("");
      setLoading(false);
    }
  }, [open]);

  if (!pedido) return null;

  const gerarMensagem = () => {
    const itensFormatados = pedido.itens
      ?.map((item) => `• ${item}`)
      .join("\n");

    const enderecoCompleto = `${pedido.endereco}, ${pedido.bairro}`;
    const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      enderecoCompleto
    )}`;

    return `🚨 *NOVA ENTREGA DESIGNADA*

🙋 *Voluntário:* ${nomeVoluntario}

👤 *Solicitante:* ${pedido.nome}
📞 *Telefone:* ${pedido.telefone}

📍 *Endereço:* ${enderecoCompleto}
🗺️ ${linkMaps}

🛒 *Itens:*
${itensFormatados}

📝 *Observação:* ${pedido.observacao || "Nenhuma"}
`;
  };

  const enviarWhatsApp = async () => {
    const numeroLimpo = numeroVoluntario.replace(/\D/g, "");

    if (numeroLimpo.length < 11 || !nomeVoluntario.trim()) return;

    if (!onEntregar) {
      console.error("onEntregar não foi passado!");
      return;
    }

    setLoading(true);

    try {
      const pedidoAtualizado = await onEntregar(
        pedido.id,
        nomeVoluntario
      );

      if (!pedidoAtualizado) {
        throw new Error("Erro ao atualizar pedido");
      }

      const mensagem = gerarMensagem();

      const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(
        mensagem
      )}`;

      window.open(url, "_blank");

      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("ERRO AO ENTREGAR:", error);
      alert("Erro ao marcar como entregue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Enviar para Voluntário
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nome do Voluntário"
              value={nomeVoluntario}
              onChange={(e) =>
                setNomeVoluntario(e.target.value)
              }
              disabled={loading}
              fullWidth
            />

            <TextField
              label="Número do Voluntário"
              value={numeroVoluntario}
              disabled={loading}
              fullWidth
              slotProps={{
                input: {
                  inputComponent: IMaskInput,
                  inputProps: {
                    mask: "(00) 00000-0000",
                    onAccept: (value) =>
                      setNumeroVoluntario(value),
                  },
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={enviarWhatsApp}
              disabled={
                loading ||
                numeroVoluntario.replace(/\D/g, "")
                  .length < 11 ||
                !nomeVoluntario.trim()
              }
            >
              {loading
                ? "Enviando..."
                : "Enviar pelo WhatsApp"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Entrega marcada como concluída!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ModalEnviarVoluntario;