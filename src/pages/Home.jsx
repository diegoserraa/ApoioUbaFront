import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import SupportCards from "../components/SupportCards";
import SupportNumbers from "../components/SupportNumbers";
import EmergencyBar from "../components/EmergencyBar";

const coresPorTipo = {
  comida: {
    principal: "#2e7d32",
    gradiente: "linear-gradient(180deg, #1b5e20, #66bb6a)",
    marker: "green",
  },
  abrigo: {
    principal: "#f57c00",
    gradiente: "linear-gradient(180deg, #e65100, #ffb74d)",
    marker: "orange",
  },
  entrega: {
    principal: "#c62828",
    gradiente: "linear-gradient(180deg, #8e0000, #ef5350)",
    marker: "red",
  },
  doacao: {
    principal: "#1976d2",
    gradiente: "linear-gradient(180deg, #0d47a1, #64b5f6)",
    marker: "blue",
  },
};

function Home() {
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("doacao");
  const [pontos, setPontos] = useState([]);

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        setLoading(true);

        // 🔥 Normaliza o tipo (resolve problema de maiúscula)
        const tipoNormalizado = tipo?.toLowerCase().trim();

        console.log("Buscando tipo:", tipoNormalizado);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/pontos?tipo=${tipoNormalizado}`
        );

        if (!res.ok) throw new Error("Erro na API");

        const data = await res.json();

        console.log("Recebido:", data);

        setPontos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setPontos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPontos();
  }, [tipo]);

  // 🔥 Cor sempre garantida (nunca undefined)
  const corAtual =
    coresPorTipo[tipo?.toLowerCase().trim()] || coresPorTipo.doacao;

  return (
    <>
      <CssBaseline />
      <Hero />
      <EmergencyBar />

      {/* 🔥 força sempre minúsculo */}
      <SupportNumbers
        onChange={(novoTipo) =>
          setTipo(novoTipo?.toLowerCase().trim())
        }
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Features pontos={pontos} cor={corAtual} />

          <Box sx={{ width: "100%", px: { xs: 2, md: "2.5%" }, mt: 5 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Localização
            </Typography>

            <SupportCards pontos={pontos} cor={corAtual} />
          </Box>
        </>
      )}

      <Footer />
    </>
  );
}

export default Home;