import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  TableContainer,
  TablePagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";

/* 🔥 Mapeamento da prioridade por número */
const PRIORIDADE_LABEL = {
  1: "Alta prioridade",
  2: "Prioridade alta",
  3: "Prioridade média",
  4: "Prioridade moderada",
  5: "Prioridade baixa",
  6: "Baixa prioridade",
};

const PRIORIDADE_COLOR = {
  1: "error",
  2: "warning",
  3: "info",
  4: "primary",
  5: "default",
  6: "default",
};

function PedidoTabela({
  pedidosPaginados,
  pedidosFiltrados,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  setPedidoSelecionado,
  abrirModalEnvio,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  /* ================= MOBILE ================= */
  if (isSmall) {
    return (
      <>
        <Stack spacing={2}>
          {pedidosPaginados.map((pedido) => {
            const status = pedido.status || "pendente";
            const responsavel =
              pedido.responsavel || pedido.voluntario || "-";

            const prioridadeNumero = pedido.prioridade || 6;
            const prioridadeLabel =
              PRIORIDADE_LABEL[prioridadeNumero] || "Não definida";

            return (
              <Card key={pedido.id}>
                <CardContent>
                  <strong>{pedido.nome}</strong>
                  <div>{pedido.endereco}</div>
                  <div>{pedido.bairro}</div>

                  {/* 🔥 PRIORIDADE MOBILE */}
                  <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                    <Chip
                      size="small"
                      label={prioridadeLabel}
                      color={PRIORIDADE_COLOR[prioridadeNumero]}
                    />
                  </Stack>

                  <div>
                    <strong>Responsável:</strong> {responsavel}
                  </div>

                  <Chip
                    size="small"
                    label={status}
                    color={
                      status === "entregue"
                        ? "success"
                        : "warning"
                    }
                    sx={{ my: 1 }}
                  />

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        setPedidoSelecionado(pedido)
                      }
                    >
                      Ver
                    </Button>

                    {status === "pendente" && (
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={() =>
                          abrirModalEnvio(pedido)
                        }
                      >
                        🚚 Enviar
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <TablePagination
          component="div"
          count={pedidosFiltrados.length}
          page={page}
          onPageChange={(e, newPage) =>
            setPage(newPage)
          }
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(
              parseInt(e.target.value, 10)
            );
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Bairro</TableCell>
              <TableCell>Prioridade</TableCell> {/* 🔥 NOVA COLUNA */}
              <TableCell>Status</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Ação</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pedidosPaginados.map((pedido) => {
              const status = pedido.status || "pendente";
              const responsavel =
                pedido.responsavel || pedido.voluntario || "-";

              const prioridadeNumero = pedido.prioridade || 6;
              const prioridadeLabel =
                PRIORIDADE_LABEL[prioridadeNumero] || "Não definida";

              return (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.nome}</TableCell>
                  <TableCell>{pedido.endereco}</TableCell>
                  <TableCell>{pedido.bairro}</TableCell>

                  {/* 🔥 PRIORIDADE DESKTOP */}
                  <TableCell>
                    <Chip
                      size="small"
                      label={prioridadeLabel}
                      color={PRIORIDADE_COLOR[prioridadeNumero]}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={status}
                      color={
                        status === "entregue"
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {responsavel}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          setPedidoSelecionado(pedido)
                        }
                      >
                        Ver
                      </Button>

                      {status === "pendente" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            abrirModalEnvio(pedido)
                          }
                        >
                          🚚 Enviar
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pedidosFiltrados.length}
        page={page}
        onPageChange={(e, newPage) =>
          setPage(newPage)
        }
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(
            parseInt(e.target.value, 10)
          );
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Paper>
  );
}

export default PedidoTabela;