import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import PedidoTabela from "../components/PedidoTabela";
import PedidoResumoCards from "../components/PedidoResumoCard";
import PedidoFiltros from "../components/PedidoFiltros";
import PedidoDetalhesModal from "../components/PedidoDetalhesModal";
import ModalEnviarVoluntario from "../components/ModalEnviarVoluntario";
import { apiFetch } from "../services/api";

function PainelPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaEndereco, setBuscaEndereco] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const [modalVoluntarioOpen, setModalVoluntarioOpen] = useState(false);
  const [pedidoParaEnvio, setPedidoParaEnvio] = useState(null);
  const [prioridadeFiltro, setPrioridadeFiltro] = useState("todas");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🔥 Buscar pedidos
useEffect(() => {
  const carregarPedidos = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/pedidos");

      if (!res.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const data = await res.json();

      setPedidos(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  carregarPedidos();
}, []);

  // 🔥 Atualizar status (CORRETO)
 const atualizarStatus = async (id, responsavel) => {
  try {
    const response = await apiFetch(
      `/pedidos/${id}/entregar`,
      {
        method: "PUT",
        body: JSON.stringify({ responsavel }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar pedido");
    }

    const pedidoAtualizado = await response.json();

    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? pedidoAtualizado : p))
    );

    return pedidoAtualizado;

  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return null;
  }
};
const pedidosFiltrados = useMemo(() => {
  return pedidos.filter((p) => {
    const nomeMatch = p.nome
      ?.toLowerCase()
      .includes(buscaNome.toLowerCase());

    const enderecoCompleto = `${p.endereco || ""} ${p.bairro || ""}`;

    const enderecoMatch = enderecoCompleto
      .toLowerCase()
      .includes(buscaEndereco.toLowerCase());

    const statusMatch =
      statusFiltro === "todos" || p.status === statusFiltro;

    const prioridadeMatch =
      prioridadeFiltro === "todas" ||
      Number(p.prioridade) === Number(prioridadeFiltro);

    return (
      nomeMatch &&
      enderecoMatch &&
      statusMatch &&
      prioridadeMatch
    );
  });
}, [
  pedidos,
  buscaNome,
  buscaEndereco,
  statusFiltro,
  prioridadeFiltro,
]);

  useEffect(() => {
    setPage(0);
  }, [buscaNome, buscaEndereco, statusFiltro, prioridadeFiltro]);

  const pedidosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage;
    const fim = inicio + rowsPerPage;
    return pedidosFiltrados.slice(inicio, fim);
  }, [pedidosFiltrados, page, rowsPerPage]);

const resumo = {
  total: pedidosFiltrados.length,
  pendentes: pedidosFiltrados.filter((p) => p.status === "pendente").length,
  entregues: pedidosFiltrados.filter((p) => p.status === "entregue").length,
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Painel de Pedidos
      </Typography>

      <PedidoResumoCards resumo={resumo} />

      <PedidoFiltros
        buscaNome={buscaNome}
        setBuscaNome={setBuscaNome}
        buscaEndereco={buscaEndereco}
        setBuscaEndereco={setBuscaEndereco}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        prioridadeFiltro={prioridadeFiltro}
        setPrioridadeFiltro={setPrioridadeFiltro}
      />

      <PedidoTabela
        pedidosPaginados={pedidosPaginados}
        pedidosFiltrados={pedidosFiltrados}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setPedidoSelecionado={setPedidoSelecionado}
        abrirModalEnvio={(pedido) => {
          setPedidoParaEnvio(pedido);
          setModalVoluntarioOpen(true);
        }}
      />

      <PedidoDetalhesModal
        open={Boolean(pedidoSelecionado)}
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
        onEntregar={async () => {
          await atualizarStatus(pedidoSelecionado.id);
          setPedidoSelecionado(null);
        }}
      />

      <ModalEnviarVoluntario
        open={modalVoluntarioOpen}
        pedido={pedidoParaEnvio}
        onClose={() => setModalVoluntarioOpen(false)}
        onEntregar={atualizarStatus}
      />
    </Box>
  );
}

export default PainelPedidos;