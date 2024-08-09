"use client";
import React, { useState, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5CF6", // A deep purple color
    },
    background: {
      default: "#0F0F13",
      paper: "#1A1A23",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0AEC0",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2D3748",
            },
            "&:hover fieldset": {
              borderColor: "#4A5568",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B5CF6",
            },
          },
        },
      },
    },
  },
});

function Signup() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    //Complete function later;
    console.log("handle sign up function called");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: "linear-gradient(45deg, #0F0F13 0%, #1A1A23 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              width: "320px",
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" color="text.primary" mb={3} align="center">
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignup}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2 }}
              >
                Already have an account?{" "}
                <MuiLink component={Link} href="/login" color="primary.main">
                  Log in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
}

export default Signup;
