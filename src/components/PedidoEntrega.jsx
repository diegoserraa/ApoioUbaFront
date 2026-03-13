import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from "@mui/material";
import { PatternFormat } from "react-number-format";
import { apiFetch } from "../services/api";

function PedidoEntrega() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const listaItens = [
    "Cesta básica",
    "Água potável",
    "Leite infantil",
    "Fraldas",
    "Roupas adulto",
    "Roupas infantil",
    "Cobertor",
    "Produto de higiene",
    "Produto de limpeza",
    "Medicamentos básicos",
    "Gás de cozinha",
    "Ração para animais",
    "Outro",
  ];

  const motivos = [
    { value: "acamado", label: "Pessoa acamada" },
    { value: "deficiencia", label: "Pessoa com deficiência" },
    { value: "idoso", label: "Idoso(a)" },
    { value: "mae_solo", label: "Mãe solo" },
    { value: "sem_transporte", label: "Sem transporte" },
    { value: "outro", label: "Outro" },
  ];

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    numero: "",
    bairro: "",
    itens: [],
    justificativa_motivo: "",
    justificativa_obs: "",
    consentimento: false,
  });

  const [erroConsentimento, setErroConsentimento] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async () => {
  if (
    !form.nome ||
    !form.telefone ||
    !form.endereco ||
    !form.numero ||
    !form.bairro ||
    form.itens.length === 0 ||
    !form.justificativa_motivo
  ) {
    setSnackbar({
      open: true,
      message: "Preencha todos os campos obrigatórios!",
      severity: "error",
    });
    return;
  }

  if (!form.consentimento) {
    setErroConsentimento(true);
    return;
  } else {
    setErroConsentimento(false);
  }

  const telefoneNumeros = form.telefone.replace(/\D/g, "");

  if (telefoneNumeros.length !== 11) {
    setSnackbar({
      open: true,
      message: "Informe um celular válido com 9 dígitos.",
      severity: "error",
    });
    return;
  }

  try {
    const res = await apiFetch("/pedidos", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        endereco: `${form.endereco}, ${form.numero}`,
        telefone: form.telefone,
        aceite_lgpd_em: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error("Erro ao enviar pedido");
    }

    setSnackbar({
      open: true,
      message: "Pedido enviado com sucesso!",
      severity: "success",
    });

    setForm({
      nome: "",
      telefone: "",
      endereco: "",
      numero: "",
      bairro: "",
      itens: [],
      justificativa_motivo: "",
      justificativa_obs: "",
      consentimento: false,
    });

    setErroConsentimento(false);

  } catch (error) {
    console.error("Erro ao enviar pedido:", error);

    setSnackbar({
      open: true,
      message: "Erro ao enviar pedido",
      severity: "error",
    });
  }
};

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 3,
        pb: 2,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 950,
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={0.5} align="center">
          Solicitação de Entrega
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          fontWeight="bold"
          mb={1.5}
        >
          Para pessoas que não conseguem se deslocar até os pontos de apoio.
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={2}
        >
          Seus dados serão utilizados exclusivamente para organização da
          entrega e contato, quando necessário. Não compartilhamos suas
          informações com terceiros.
        </Typography>

        {/* Campos do formulário (mantidos iguais) */}
        <Box mb={1.5} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
          <TextField
            fullWidth
            label="Nome completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            size="small"
          />

          <PatternFormat
            customInput={TextField}
            fullWidth
            label="Celular"
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

        <Box mb={1.5} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
          <TextField fullWidth label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} size="small" />
          <TextField fullWidth label="Número" name="numero" value={form.numero} onChange={handleChange} size="small" />
          <TextField fullWidth label="Bairro" name="bairro" value={form.bairro} onChange={handleChange} size="small" />
        </Box>

        <Box mb={1.5} display="flex" flexDirection={isSmall ? "column" : "row"} gap={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Itens necessários</InputLabel>
            <Select
              multiple
              value={form.itens}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  itens: e.target.value,
                }))
              }
              renderValue={(selected) => selected.join(", ")}
            >
              {listaItens.map((item) => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={form.itens.indexOf(item) > -1} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            select
            label="Selecione o motivo"
            name="justificativa_motivo"
            value={form.justificativa_motivo}
            onChange={handleChange}
            size="small"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {motivos.map((motivo) => (
              <option key={motivo.value} value={motivo.value}>
                {motivo.label}
              </option>
            ))}
          </TextField>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Informações adicionais"
          name="justificativa_obs"
          value={form.justificativa_obs}
          onChange={handleChange}
          size="small"
          sx={{ mb: 1.5 }}
        />

        {/* 🔴 Checkbox com destaque visual */}
        <FormControl
          required
          error={erroConsentimento}
          sx={{
            mb: 2,
            p: 1,
            borderRadius: 1,
            backgroundColor: erroConsentimento ? "#fff5f5" : "transparent",
            border: erroConsentimento ? "1px solid #f44336" : "1px solid transparent",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="consentimento"
                checked={form.consentimento}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) setErroConsentimento(false);
                }}
              />
            }
            label="Declaro que autorizo o uso dos meus dados para fins de contato e organização da entrega."
          />

          {erroConsentimento && (
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              Você precisa autorizar o uso dos dados para continuar.
            </Typography>
          )}
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            py: 1,
            fontWeight: 600,
            bgcolor: "#000",
            "&:hover": { bgcolor: "#333" },
          }}
        >
          Solicitar Entrega
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

export default PedidoEntrega;