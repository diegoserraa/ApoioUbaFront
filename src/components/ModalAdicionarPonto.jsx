import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PatternFormat } from "react-number-format";
import { apiFetch } from "../services/api"; 

function ModalAdicionarPonto({ open, onClose, onSuccess })  {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    tipo: "",
    numero: "",
    bairro: "",
    cep: "",
    telefone: "",
    itens_recebidos: [],
  });

  const [horarios, setHorarios] = useState({
    inicio: "",
    fim: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const itensPossiveis = [
    "Água",
    "Alimentos não perecíveis",
    "Roupas",
    "Calçados",
    "Colchões",
    "Cobertores",
    "Fraldas",
    "Higiene pessoal",
    "Medicamentos básicos",
    "Produtos de limpeza",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      itens_recebidos:
        name === "tipo" && value !== "doacao"
          ? []
          : prev.itens_recebidos,
    }));
  };

  const handleChipClick = (item) => {
    setForm((prev) => ({
      ...prev,
      itens_recebidos: prev.itens_recebidos.includes(item)
        ? prev.itens_recebidos.filter((i) => i !== item)
        : [...prev.itens_recebidos, item],
    }));
  };const handleSubmit = async () => {
  if (
    !form.nome ||
    !form.endereco ||
    !form.tipo ||
    !form.numero ||
    !horarios.inicio ||
    !horarios.fim
  ) {
    setSnackbar({
      open: true,
      message: "Preencha todos os campos obrigatórios!",
      severity: "error",
    });
    return;
  }

  const dataToSend = {
    ...form,
    cidade: "Ubá",
    estado: "MG",
    horario: `${horarios.inicio} às ${horarios.fim}`,
  };

  try {
    const res = await apiFetch("/pontos", {
      method: "POST",
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) {
      throw new Error("Erro ao cadastrar ponto");
    }

    setSnackbar({
      open: true,
      message: "Ponto cadastrado com sucesso!",
      severity: "success",
    });

    setForm({
      nome: "",
      endereco: "",
      tipo: "",
      numero: "",
      bairro: "",
      cep: "",
      telefone: "",
      itens_recebidos: [],
    });

    setHorarios({ inicio: "", fim: "" });

    if (onSuccess) onSuccess();

  } catch (error) {
    console.error(error);

    setSnackbar({
      open: true,
      message: "Erro ao cadastrar ponto",
      severity: "error",
    });
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
            width: { xs: "95%", sm: 650 },
            maxHeight: "95vh",
            overflowY: "auto",
            bgcolor: "#fff",
            borderRadius: 4,
            p: { xs: 2.5, sm: 4 },
            boxShadow: 24,
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={700}>
              Novo Ponto
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Categoria */}
          <TextField
            fullWidth
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            size="small"
            select
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="">Selecione a categoria</option>
            <option value="doacao">Ponto de Doação</option>
            <option value="abrigo">Abrigo</option>
            <option value="comida">Alimentação</option>
          </TextField>

          <TextField
            fullWidth
            label="Nome do Local"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Endereço"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            size="small"
            sx={{ mb: 2 }}
          />

          <Box mb={2} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              size="small"
            />
          </Box>

          <Box mb={2} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
            <TextField fullWidth label="Cidade" value="Ubá" size="small" InputProps={{ readOnly: true }} />
            <TextField fullWidth label="Estado" value="MG" size="small" InputProps={{ readOnly: true }} />
          </Box>

          <Box mb={3} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
            <PatternFormat
              customInput={TextField}
              fullWidth
              label="CEP"
              format="#####-###"
              mask="_"
              value={form.cep}
              onValueChange={(values) =>
                setForm((prev) => ({ ...prev, cep: values.formattedValue }))
              }
              size="small"
            />

            <PatternFormat
              customInput={TextField}
              fullWidth
              label="Telefone"
              format="(##) #####-####"
              mask="_"
              value={form.telefone}
              onValueChange={(values) =>
                setForm((prev) => ({ ...prev, telefone: values.formattedValue }))
              }
              size="small"
            />
          </Box>

          {/* 🔥 HORÁRIOS (agora está correto) */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Horário de Funcionamento
            </Typography>

            <Box display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
              <TextField
                fullWidth
                type="time"
                label="Abertura"
                value={horarios.inicio}
                onChange={(e) =>
                  setHorarios((prev) => ({ ...prev, inicio: e.target.value }))
                }
                size="small"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="time"
                label="Fechamento"
                value={horarios.fim}
                onChange={(e) =>
                  setHorarios((prev) => ({ ...prev, fim: e.target.value }))
                }
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {form.tipo === "doacao" && (
            <Box mb={3}>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Itens recebidos
              </Typography>

              <Stack
                direction={isSmall ? "column" : "row"}
                spacing={1.5}
                flexWrap="wrap"
              >
                {itensPossiveis.map((item) => {
                  const selected = form.itens_recebidos.includes(item);

                  return (
                    <Chip
                      key={item}
                      label={item}
                      clickable
                      onClick={() => handleChipClick(item)}
                      sx={{
                        width: isSmall ? "100%" : "auto",
                        bgcolor: selected ? "#000" : "#fff",
                        color: selected ? "#fff" : "#000",
                        border: "1px solid #000",
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.3,
              fontWeight: 600,
              bgcolor: "#000",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Cadastrar Ponto
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ModalAdicionarPonto;