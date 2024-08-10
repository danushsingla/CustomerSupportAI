"use client";
import {
  Box,
  Button,
  Stack,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../..//firebase";
import { useRouter } from "next/navigation";

// Define the dark theme to match the login and signup pages
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5CF6", // Deep purple color
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
              borderColor: "#2D3748", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#4A5568", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B5CF6", // Focused border color
            },
          },
        },
      },
    },
  },
});

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: `Hi! I'm the support assistant. How can I help you today?`,
    },
  ]);

  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default" // Background color from the theme
      >
        {/* Chat container */}
        <Stack
          direction="column-reverse"
          width="70%"
          height="80%"
          p={2}
          overflow="auto"
          flexGrow={1}
          flexShrink={1}
          bgcolor="background.paper" // Paper background from the theme
          borderRadius={2}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          <Stack direction="column" spacing={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant" ? "#202222" : "primary.main"
                  }
                  color="text.primary"
                  borderRadius={1}
                  p={2}
                  border="1px solid #333"
                  maxWidth="70%"
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>

        {/* Input field and send button */}
        <Stack
          width="70%"
          direction="row"
          spacing={2}
          m={2}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          p={2}
        >
          <TextField
            autoComplete="off"
            placeholder="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              sx: {
                "&.MuiFormLabel-filled, &.Mui-focused": {
                  display: "none", // Hide the label when input is focused or filled
                },
              },
              style: { color: "#A0AEC0" }, // Set the placeholder color
            }}
            InputProps={{
              style: { color: "#A0AEC0" }, // Text color
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Focused border color
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => {
              // Handle sending message
              if (message.trim()) {
                setMessages([...messages, { role: "user", content: message }]);
                setMessage("");
              }
            }}
            sx={{
              textTransform: "none",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Send
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              bgcolor: "#F56565", // Red color for logout button
              padding: "6px 10px", // Adjust padding to align the icon more inside
              "& .MuiButton-startIcon": {
                marginRight: "4px", // Reduce the space between the icon and the text
              },
              "&:hover": {
                bgcolor: "#C53030",
              },
            }}
          ></Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
