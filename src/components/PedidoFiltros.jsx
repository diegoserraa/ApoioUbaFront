import React from "react";
import { Stack, TextField, MenuItem } from "@mui/material";

/* 🔥 Mapeamento prioridade -> label */
const PRIORIDADE_LABEL = {
  1: "Alta prioridade",
  2: "Prioridade alta",
  3: "Prioridade média",
  4: "Prioridade moderada",
  5: "Prioridade baixa",
  6: "Baixa prioridade",
};

function PedidoFiltros({
  buscaNome,
  setBuscaNome,
  buscaEndereco,
  setBuscaEndereco,
  statusFiltro,
  setStatusFiltro,

  // 🔥 renomeação correta das props do painel
  prioridadeFiltro: filtroPrioridade,
  setPrioridadeFiltro: setFiltroPrioridade,
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      mb={3}
    >
      {/* 🔹 Buscar por nome */}
      <TextField
        fullWidth
        size="small"
        label="Buscar por nome"
        value={buscaNome}
        onChange={(e) => setBuscaNome(e.target.value)}
      />

      {/* 🔹 Buscar por endereço */}
      <TextField
        fullWidth
        size="small"
        label="Buscar por endereço"
        value={buscaEndereco}
        onChange={(e) => setBuscaEndereco(e.target.value)}
      />

      {/* 🔹 Filtro Status */}
      <TextField
        select
        fullWidth
        size="small"
        label="Status"
        value={statusFiltro}
        onChange={(e) => setStatusFiltro(e.target.value)}
      >
        <MenuItem value="todos">Todos</MenuItem>
        <MenuItem value="pendente">Pendente</MenuItem>
        <MenuItem value="entregue">Entregue</MenuItem>
      </TextField>

      {/* 🔥 Filtro Prioridade */}
<TextField
  select
  fullWidth
  size="small"
  label="Prioridade"
  value={filtroPrioridade ?? "todas"}   // 🔥 garante valor no primeiro carregamento
  onChange={(e) => setFiltroPrioridade(e.target.value)}
>
  <MenuItem value="todas">Todas</MenuItem>

  {Object.entries(PRIORIDADE_LABEL).map(([key, label]) => (
    <MenuItem key={key} value={key}>
      {label}
    </MenuItem>
  ))}
</TextField>
    </Stack>
  );
}

export default PedidoFiltros;