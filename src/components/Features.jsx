import React from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ícone vermelho
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Features = ({ pontos }) => {
  if (!pontos || pontos.length === 0) return null;

  const center = [
    parseFloat(pontos[0].latitude),
    parseFloat(pontos[0].longitude),
  ];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f5f7fa",
        py: 5, // 🔥 mesma distância top e bottom
        px: { xs: 2, md: "2.5%" }, // 🔥 mais perto da borda no desktop
      }}
    >
      <Box
        sx={{
          height: { xs: 340, md: 370 }, // levemente menor
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

          {pontos.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[
                parseFloat(ponto.latitude),
                parseFloat(ponto.longitude),
              ]}
              icon={redIcon}
            >
              <Popup>
                <strong>{ponto.nome}</strong>
                <br />
                {ponto.endereco}, {ponto.bairro}
                <br />
                Itens: {ponto.itens_recebidos.join(", ")}
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