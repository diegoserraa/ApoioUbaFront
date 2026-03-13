import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Card,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";

import { Routes, Route, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import CadastroPonto from "./CadastroPonto";
import PainelPedidos from "./PainelPedidos";
import PainelPontos from "./PainelPontos";
import PainelUsuarios from "./PainelUsuarios";
import { apiFetch } from "../services/api";

const drawerWidth = 240;
const miniWidth = 70;

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [pontos, setPontos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [pontosRes, pedidosRes, usuariosRes] = await Promise.all([
          apiFetch("/pontos?tipo=todos"),
          apiFetch("/pedidos"),
          apiFetch("/auth/users"),
        ]);

        setPontos(await pontosRes.json());
        setPedidos(await pedidosRes.json());
        setUsuarios(await usuariosRes.json());
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // ================= MÉTRICAS =================

  const totalPontos = pontos.length;
  const pontosAtivos = pontos.filter((u) => u.ativo === true).length;
  const abrigos = pontos.filter((p) => p.tipo === "abrigo").length;
  const comida = pontos.filter((p) => p.tipo === "comida").length;
  const doacao = pontos.filter((p) => p.tipo === "doacao").length;

  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter((p) => p.status === "pendente").length;
  const pedidosEntregues = pedidos.filter((p) => p.status === "entregue").length;

  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter((u) => u.ativo === true).length;
  const usuariosInativos = usuarios.filter((u) => u.ativo === false).length;

  // ================= CARD PADRÃO =================

  const DashboardCard = ({
    icon,
    titulo,
    total,
    children,
    corBotao,
    onClick,
  }) => (
    <Card
      sx={{
        borderRadius: 3,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography fontWeight={700}>{titulo}</Typography>
        </Stack>

        {/* Número principal menor */}
        <Typography variant="h5" fontWeight={800} mt={1}>
          {total}
        </Typography>

        <Box mt={1.5}>{children}</Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color={corBotao}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          mt: 2,
        }}
        onClick={onClick}
      >
        Acessar
      </Button>
    </Card>
  );

  // ================= HOME =================

  const HomeDashboard = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h4" fontWeight={800} mb={4}>
          Dashboard
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {/* PONTOS */}
          <DashboardCard
            icon={<LocationOnIcon color="primary" />}
            titulo="Pontos"
            total={totalPontos}
            corBotao="primary"
            onClick={() => navigate("/dashboard/pontos")}
          >
            <Stack direction="row" spacing={3}>
              <Typography variant="body2">
                Total: <strong>{totalPontos}</strong>
              </Typography>
              <Typography variant="body2">
                Ativos: <strong>{pontosAtivos}</strong>
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} mt={1}>
              <Typography variant="body2">
                Abrigos: <strong>{abrigos}</strong>
              </Typography>
              <Typography variant="body2">
                Doações: <strong>{doacao}</strong>
              </Typography>
              <Typography variant="body2">
                Alimentos: <strong>{comida}</strong>
              </Typography>
            </Stack>
          </DashboardCard>

          {/* PEDIDOS */}
          <DashboardCard
            icon={<AssignmentIcon color="warning" />}
            titulo="Pedidos"
            total={totalPedidos}
            corBotao="warning"
            onClick={() => navigate("/dashboard/pedidos")}
          >
            <Stack direction="row" spacing={3}>
              <Typography variant="body2">
                Pendentes: <strong>{pedidosPendentes}</strong>
              </Typography>
              <Typography variant="body2">
                Entregues: <strong>{pedidosEntregues}</strong>
              </Typography>
            </Stack>
          </DashboardCard>

          {/* USUÁRIOS */}
          <DashboardCard
            icon={<PersonIcon color="secondary" />}
            titulo="Usuários"
            total={totalUsuarios}
            corBotao="secondary"
            onClick={() => navigate("/dashboard/usuarios")}
          >
            <Stack direction="row" spacing={3}>
              <Typography variant="body2">
                Ativos: <strong>{usuariosAtivos}</strong>
              </Typography>
              <Typography variant="body2">
                Inativos: <strong>{usuariosInativos}</strong>
              </Typography>
            </Stack>
          </DashboardCard>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#0f172a",
          width: `calc(100% - ${open ? drawerWidth : miniWidth}px)`,
          ml: `${open ? drawerWidth : miniWidth}px`,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={() => setOpen(!open)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>
              Painel Administrativo
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : miniWidth,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : miniWidth,
            backgroundColor: "#0f172a",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

        <List>
          {[
            { text: "Visão Geral", icon: <HomeIcon />, path: "/dashboard" },
            { text: "Pedidos", icon: <AssignmentIcon />, path: "/dashboard/pedidos" },
            { text: "Pontos", icon: <LocationOnIcon />, path: "/dashboard/pontos" },
            { text: "Usuários", icon: <PersonIcon />, path: "/dashboard/usuarios" },
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon sx={{ color: "#fff" }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          backgroundColor: "#f8fafc",
        }}
      >
        <Toolbar />

        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="cadastro" element={<CadastroPonto />} />
          <Route path="pedidos" element={<PainelPedidos />} />
          <Route path="pontos" element={<PainelPontos />} />
          <Route path="usuarios" element={<PainelUsuarios />} />
        </Routes>
      </Box>
    </Box>
  );
}