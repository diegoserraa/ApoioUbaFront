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

import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

import ModalAdicionarUsuario from "../components/ModalAdicionarUsuario";
import { apiFetch } from "../services/api";

function PainelUsuarios() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaEmail, setBuscaEmail] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // =============================
  // BUSCAR USUÁRIOS
  // =============================
  const buscarUsuarios = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/auth/users");

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data = await res.json();

      const usuariosTratados = (Array.isArray(data) ? data : []).map((u) => ({
        ...u,
        ativo: Boolean(u.ativo),
      }));

      setUsuarios(usuariosTratados);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  // =============================
  // ATIVAR / INATIVAR
  // =============================
  const alternarStatus = async (id, ativoAtual) => {
    const novoStatus = !ativoAtual;

    // 🔥 Atualização otimista
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, ativo: novoStatus } : u
      )
    );

    try {
      const response = await apiFetch(`/auth/users/${id}/ativo`, {
        method: "PATCH",
        body: { ativo: novoStatus }, // 👈 não usa mais JSON.stringify
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");
    } catch (error) {
      console.error("Erro ao atualizar:", error);

      // rollback
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, ativo: ativoAtual } : u
        )
      );
    }
  };

  // =============================
  // FILTRO
  // =============================
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const nomeMatch =
        u.nome?.toLowerCase().includes(buscaNome.toLowerCase()) ?? false;

      const emailMatch =
        u.email?.toLowerCase().includes(buscaEmail.toLowerCase()) ?? false;

      const statusMatch =
        statusFiltro === "todos" ||
        (statusFiltro === "ativo" && u.ativo) ||
        (statusFiltro === "inativo" && !u.ativo);

      return nomeMatch && emailMatch && statusMatch;
    });
  }, [usuarios, buscaNome, buscaEmail, statusFiltro]);

  useEffect(() => {
    setPage(0);
  }, [buscaNome, buscaEmail, statusFiltro]);

  const usuariosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage;
    return usuariosFiltrados.slice(inicio, inicio + rowsPerPage);
  }, [usuariosFiltrados, page, rowsPerPage]);

  const resumo = {
    total: usuariosFiltrados.length,
    ativos: usuariosFiltrados.filter((u) => u.ativo).length,
    inativos: usuariosFiltrados.filter((u) => !u.ativo).length,
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
        Painel de Usuários
      </Typography>

      {/* RESUMO */}
   {/* RESUMO */}
<Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={4}>
  {[
    {
      label: "Total",
      value: resumo.total,
      icon: <PersonIcon />,
      color: "#1976d2",
      bg: "#e3f2fd",
    },
    {
      label: "Ativos",
      value: resumo.ativos,
      icon: <CheckCircleIcon />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
    {
      label: "Inativos",
      value: resumo.inativos,
      icon: <CancelIcon />,
      color: "#d32f2f",
      bg: "#ffebee",
    },
  ].map((item, i) => (
    <Card
      key={i}
      sx={{
        flex: 1,
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
    width: 50,
    height: 50,
    borderRadius: 2, // 👈 quadrado levemente arredondado padrão MUI
    backgroundColor: item.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: item.color,
  }}
          >
            {item.icon}
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary" }}
            >
              {item.label}
            </Typography>

            <Typography variant="h4" fontWeight={700}>
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
          label="Buscar por email"
          value={buscaEmail}
          onChange={(e) => setBuscaEmail(e.target.value)}
        />

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

      <Box mb={3} display="flex" justifyContent={{ xs: "stretch", md: "flex-end" }}>
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
           Adicionar Usuário
         </Button>
      </Box>

      <ModalAdicionarUsuario
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          buscarUsuarios();
          setOpenModal(false);
        }}
      />

      {/* MOBILE */}
      {isSmall ? (
        <Stack spacing={2}>
          {usuariosPaginados.map((u) => (
            <Card key={u.id}>
              <CardContent>
                <Typography fontWeight={600}>{u.nome}</Typography>
                <Typography variant="body2">{u.email}</Typography>

                <Chip
                  size="small"
                  label={u.ativo ? "Ativo" : "Inativo"}
                  color={u.ativo ? "success" : "error"}
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 1 }} />

                <Button
                  size="small"
                  fullWidth
                  variant={u.ativo ? "outlined" : "contained"}
                  color={u.ativo ? "error" : "success"}
                  onClick={() => alternarStatus(u.id, u.ativo)}
                >
                  {u.ativo ? "Inativar" : "Ativar"}
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
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosPaginados.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={u.ativo ? "Ativo" : "Inativo"}
                        color={u.ativo ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant={u.ativo ? "outlined" : "contained"}
                        color={u.ativo ? "error" : "success"}
                        onClick={() => alternarStatus(u.id, u.ativo)}
                      >
                        {u.ativo ? "Inativar" : "Ativar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={usuariosFiltrados.length}
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

export default PainelUsuarios;