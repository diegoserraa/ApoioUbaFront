import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  TableContainer,
  TablePagination,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import ModalAdicionarPonto from "../components/ModalAdicionarPonto";
import { apiFetch } from "../services/api";

function PainelPontosApoio() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaEndereco, setBuscaEndereco] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("todos");

const buscarPontos = async () => {
  try {
    setLoading(true);

    const res = await apiFetch(
      `/pontos?tipo=${encodeURIComponent(tipoFiltro)}`
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar pontos");
    }

    const data = await res.json();

    setPontos(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error("Erro ao buscar pontos:", err);
    setPontos([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  buscarPontos();
}, []);

  // ✅ CORRIGIDO AQUI
 const alternarStatus = async (id, ativoAtual) => {
  const novoStatus = !ativoAtual;

  // 🔥 Atualização otimista
  setPontos((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, ativo: novoStatus } : p
    )
  );

  try {
    const response = await apiFetch(
      `/pontos/${id}/ativo`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ativo: novoStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar status");
    }

  } catch (error) {
    console.error("Erro ao atualizar status:", error);

    // 🔁 rollback se der erro
    setPontos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ativo: ativoAtual } : p
      )
    );
  }
};

const pontosFiltrados = useMemo(() => {
  return pontos.filter((p) => {
    const nomeMatch = p.nome
      ?.toLowerCase()
      .includes(buscaNome.toLowerCase());

    const enderecoCompleto = `${p.endereco || ""} ${p.bairro || ""}`;

    const enderecoMatch = enderecoCompleto
      .toLowerCase()
      .includes(buscaEndereco.toLowerCase());

    const statusMatch =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && p.ativo) ||
      (statusFiltro === "inativo" && !p.ativo);

    const tipoMatch =
      tipoFiltro === "todos" ||
      p.tipo?.toLowerCase() === tipoFiltro;

    return nomeMatch && enderecoMatch && statusMatch && tipoMatch;
  });
}, [pontos, buscaNome, buscaEndereco, statusFiltro, tipoFiltro]);

  useEffect(() => {
    setPage(0);
  }, [buscaNome, buscaEndereco, statusFiltro, tipoFiltro]);

  const pontosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage;
    const fim = inicio + rowsPerPage;
    return pontosFiltrados.slice(inicio, fim);
  }, [pontosFiltrados, page, rowsPerPage]);

const resumo = {
  total: pontosFiltrados.length,
  ativos: pontosFiltrados.filter((p) => p.ativo).length,
  inativos: pontosFiltrados.filter((p) => !p.ativo).length,
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: "100%" }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Painel de Pontos de Apoio
      </Typography>

      {/* RESUMO */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={4}>
        {[{
          label: "Total",
          value: resumo.total,
          icon: <LocationOnIcon />,
          bg: "#e0f2fe",
          color: "#0284c7",
          border: "#e2e8f0",
        },{
          label: "Ativos",
          value: resumo.ativos,
          icon: <CheckCircleIcon />,
          bg: "#d1fae5",
          color: "#059669",
          border: "#bbf7d0",
        },{
          label: "Inativos",
          value: resumo.inativos,
          icon: <CancelIcon />,
          bg: "#fee2e2",
          color: "#dc2626",
          border: "#fecaca",
        }].map((item, i) => (
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

      {/* FILTROS */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
        <TextField
          fullWidth
          size="small"
          label="Buscar por nome"
          value={buscaNome}
          onChange={(e) => setBuscaNome(e.target.value)}
        />

        <TextField
          fullWidth
          size="small"
          label="Buscar por endereço"
          value={buscaEndereco}
          onChange={(e) => setBuscaEndereco(e.target.value)}
        />
<TextField
  select
  fullWidth
  size="small"
  label="Tipo"
  value={tipoFiltro}
  onChange={(e) => setTipoFiltro(e.target.value)}
>
  <MenuItem value="todos">Todos</MenuItem>
  <MenuItem value="doacao">Doação</MenuItem>
  <MenuItem value="comida">Alimento</MenuItem>
  <MenuItem value="abrigo">Abrigo</MenuItem>
</TextField>
        <TextField
          select
          fullWidth
          size="small"
          label="Status"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="ativo">Ativo</MenuItem>
          <MenuItem value="inativo">Inativo</MenuItem>
        </TextField>
      </Stack>
     <Box
  mb={3}
  display="flex"
  justifyContent={{ xs: "stretch", md: "flex-end" }}
>
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenModal(true)}
    fullWidth={isSmall}   // 🔥 aqui está o segredo
    sx={{
      bgcolor: "#000",
      fontWeight: 600,
      width: { xs: "100%", md: "auto" },
      "&:hover": { bgcolor: "#333" },
    }}
  >
    Adicionar Ponto
  </Button>
</Box>
<ModalAdicionarPonto
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSuccess={() => {
    buscarPontos();   // 🔥 atualiza automaticamente
    setOpenModal(false);
  }}
/>

      {/* RESTO DO COMPONENTE (mobile + tabela) PERMANECE IGUAL */}
      {/* Mantive exatamente como você enviou */}
      
      {isSmall ? (
        <Stack spacing={2}>
          {pontosPaginados.map((ponto) => (
            <Card key={ponto.id}>
              <CardContent>
                <Typography fontWeight={600}>{ponto.nome}</Typography>
                <Typography variant="body2">{ponto.endereco}</Typography>
                <Typography variant="body2" mb={1}>{ponto.bairro}</Typography>

                <Chip
                  size="small"
                  label={ponto.ativo ? "Ativo" : "Inativo"}
                  color={ponto.ativo ? "success" : "error"}
                  sx={{ mb: 1 }}
                />

                <Divider sx={{ my: 1 }} />

                <Button
                  size="small"
                  fullWidth
                  variant={ponto.ativo ? "outlined" : "contained"}
                  color={ponto.ativo ? "error" : "success"}
                  onClick={() => alternarStatus(ponto.id, ponto.ativo)}
                >
                  {ponto.ativo ? "Inativar" : "Ativar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Bairro</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pontosPaginados.map((ponto) => (
                  <TableRow key={ponto.id}>
                    <TableCell>{ponto.nome}</TableCell>
                    <TableCell>{ponto.endereco}</TableCell>
                    <TableCell>{ponto.bairro}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={ponto.ativo ? "Ativo" : "Inativo"}
                        color={ponto.ativo ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant={ponto.ativo ? "outlined" : "contained"}
                        color={ponto.ativo ? "error" : "success"}
                        onClick={() => alternarStatus(ponto.id, ponto.ativo)}
                      >
                        {ponto.ativo ? "Inativar" : "Ativar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pontosFiltrados.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Paper>
      )}
    </Box>
  );
}

export default PainelPontosApoio;