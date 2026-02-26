import React, { useEffect, useState } from "react";
import { CssBaseline, Typography, CircularProgress, Box } from "@mui/material";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import SupportCards from "./components/SupportCards";
import SupportNumbers from "./components/SupportNumbers";


function App() {
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const res = await fetch("https://apoioubaback.onrender.com/pontos");
        const data = await res.json();
        setPontos(data.filter(p => p.latitude && p.longitude));
      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPontos();
  }, []);

  return (
    <>
      <CssBaseline />
      <Hero />
      <SupportNumbers />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 🔥 MAPA */}
          <Features pontos={pontos} />

          {/* 🔥 TÍTULO + CARDS COM MESMA LARGURA DO MAPA */}
          <Box
            sx={{
              width: "100%",
              px: { xs: 2, md: "2.5%" }, // 🔥 MESMO padding do mapa
              mt: 5,
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={3}>
              Pontos de Coleta
            </Typography>

            <SupportCards pontos={pontos} />
          </Box>
        </>
      )}

      <Footer />
    </>
  );
}

export default App;