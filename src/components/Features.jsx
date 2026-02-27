import React from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 Função para criar ícone dinâmico
const criarIcone = (cor) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const Features = ({ pontos = [], cor }) => {
  if (!pontos.length) return null;

  // 🔥 Filtra apenas pontos válidos
  const pontosValidos = pontos.filter(
    (p) =>
      p.latitude &&
      p.longitude &&
      !isNaN(parseFloat(p.latitude)) &&
      !isNaN(parseFloat(p.longitude))
  );

  if (!pontosValidos.length) return null; // evita quebrar mapa

  const center = [
    parseFloat(pontosValidos[0].latitude),
    parseFloat(pontosValidos[0].longitude),
  ];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f5f7fa",
        py: 5,
        px: { xs: 2, md: "2.5%" },
      }}
    >
      <Box
        sx={{
          height: { xs: 340, md: 370 },
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
        }}
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {pontosValidos.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[
                parseFloat(ponto.latitude),
                parseFloat(ponto.longitude),
              ]}
              icon={criarIcone(cor?.marker || "red")}
            >
              <Popup>
                <strong>{ponto.nome}</strong>
                <br />
                {ponto.endereco}, {ponto.bairro}
                <br />
                Itens:{" "}
                {Array.isArray(ponto.itens_recebidos)
                  ? ponto.itens_recebidos.join(", ")
                  : "Não se aplica"}
                <br />
                Horário: {ponto.horario}
                <br />
                Telefone: {ponto.telefone}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Features;