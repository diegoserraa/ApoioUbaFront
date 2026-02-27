import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 Criar ícone dinâmico
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
  const [userLocation, setUserLocation] = useState(null);
  const [markerSelecionado, setMarkerSelecionado] = useState(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          console.log("Localização não permitida.");
        }
      );
    }
  }, []);

  if (!pontos.length) return null;

  const pontosValidos = pontos.filter(
    (p) =>
      p.latitude &&
      p.longitude &&
      !isNaN(parseFloat(p.latitude)) &&
      !isNaN(parseFloat(p.longitude))
  );

  if (!pontosValidos.length) return null;

  const center = [
    parseFloat(pontosValidos[0].latitude),
    parseFloat(pontosValidos[0].longitude),
  ];

  const abrirNavegacao = (lat, lng) => {
    let url = "";

    if (userLocation) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    window.open(url, "_blank");
  };

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

          {pontosValidos.map((ponto) => {
            const lat = parseFloat(ponto.latitude);
            const lng = parseFloat(ponto.longitude);
            const markerRef = useRef(null);

            return (
              <Marker
                key={ponto.id}
                position={[lat, lng]}
                icon={criarIcone(cor?.marker || "red")}
                ref={markerRef}
                eventHandlers={{
                  mouseover: () => {
                    if (!isMobile) {
                      markerRef.current?.openPopup();
                    }
                  },
                  mouseout: () => {
                    if (!isMobile) {
                      markerRef.current?.closePopup();
                    }
                  },
                  click: () => {
                    if (isMobile) {
                      // 📱 MOBILE
                      if (markerSelecionado !== ponto.id) {
                        setMarkerSelecionado(ponto.id);
                        markerRef.current?.openPopup();
                      } else {
                        abrirNavegacao(lat, lng);
                      }
                    } else {
                      // 💻 DESKTOP
                      abrirNavegacao(lat, lng);
                    }
                  },
                }}
              >
                <Popup
                  autoClose={false}
                  closeOnClick={false}
                  onClose={() => setMarkerSelecionado(null)}
                >
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
            );
          })}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Features;