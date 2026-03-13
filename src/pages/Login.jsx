import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          mb={1}
        >
          Painel Administrativo
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          Faça login para continuar
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography
              color="error"
              variant="body2"
              textAlign="center"
              mt={1}
            >
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(135deg, #0096ff, #005edb)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;