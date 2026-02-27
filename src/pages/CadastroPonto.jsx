import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Paper,
  Divider,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { PatternFormat } from "react-number-format";

function 
CadastroPonto() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    tipo:"",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (item) => {
    setForm((prev) => ({
      ...prev,
      itens_recebidos: prev.itens_recebidos.includes(item)
        ? prev.itens_recebidos.filter((i) => i !== item)
        : [...prev.itens_recebidos, item],
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.nome ||
      !form.endereco ||
      !form.tipo ||
      !form.numero ||
      !form.telefone ||
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/pontos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) throw new Error();

      setSnackbar({
        open: true,
        message: "Ponto cadastrado com sucesso!",
        severity: "success",
      });

      setForm({
        nome: "",
        endereco: "",
        tipo:"",
        numero: "",
        bairro: "",
        cep: "",
        telefone: "",
        itens_recebidos: [],
      });

      setHorarios({ inicio: "", fim: "" });
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao cadastrar ponto",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        py: 3,
        px: 2,
        background: "linear-gradient(135deg, #F6F8FA 0%, #EDEFF2 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: { xs: 2.5, sm: 4 },
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} align="center">
          Cadastro de Ponto de Coleta
        </Typography>

<TextField
  fullWidth
  label="Tipo"
  name="tipo"
  value={form.tipo}
  onChange={handleChange}
  size="small"
  select
  SelectProps={{ native: true }}
  sx={{ mb: 2 }}
>
  
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
            inputProps={{ inputMode: "numeric" }}
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
          <TextField
            fullWidth
            label="Cidade"
            value="Ubá"
            size="small"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Estado"
            value="MG"
            size="small"
            InputProps={{ readOnly: true }}
          />
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
              setForm((prev) => ({
                ...prev,
                cep: values.formattedValue,
              }))
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
              setForm((prev) => ({
                ...prev,
                telefone: values.formattedValue,
              }))
            }
            size="small"
          />
        </Box>

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

        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Itens recebidos
          </Typography>

          <Stack direction={isSmall ? "column" : "row"} spacing={1.5} flexWrap="wrap">
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
                    fontWeight: selected ? 600 : 500,
                  }}
                />
              );
            })}
          </Stack>
        </Box>

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
      </Paper>
    </Box>
  );
}

export default CadastroPonto;