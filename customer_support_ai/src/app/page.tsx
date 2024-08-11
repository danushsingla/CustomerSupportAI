'use client';
import { Box, Button, Stack, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";

interface MessageType {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: 'assistant',
      content: `Hi! I'm the support assistant. How can I help you today?`,
    },
  ]);

  const [message, setMessage] = useState<string>('');

  const sendMessage = async() => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      {
        role: 'user', content: message},
        {role: 'assistant', content: ''},
    ])
    const response = fetch('/aws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      let result = ''
      // @ts-ignore
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box
      width={'100%'}
      height={'100vh'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      bgcolor={'#191a1a'}
    >
      <Stack
        direction={'column-reverse'}
        width={'70%'}
        height={'80%'}
        p={2}
        overflow={'auto'}
        flexGrow={1}
        flexShrink={1}
        // bgcolor={'#D8D8D8'}
      >
        <Stack
          direction={'column'}
          spacing={2}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display={'flex'}
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={message.role === 'assistant' ? '#202222' : '#191a1a'}
                color={'white'}
                borderRadius={1}
                p={2}
                border={'1px solid #333'}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
  
      <Stack
        width={'50%'}
        display={'flex'}
        direction={'row'}
        spacing={2}
        m={2}
        bgcolor={'#202222'}
      >
        <TextField 
          autoComplete="off"
          label='Message' 
          fullWidth 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          // onKeyUp={handleKeyUp}
          InputLabelProps={{
            sx: {
              '&.MuiFormLabel-filled, &.Mui-focused': {
                display: 'none' // Hide the label when the input is focused or filled
              }
            },
            style: { color: 'grey' } // Set the color of the label text
          }}
          InputProps={{
            style: { color: 'grey '}
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent', // Default border color
              },
              '&:hover fieldset': {
                borderColor: 'transparent', // Hover border color
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent', // Focused border color
              },
            },
            '& .MuiInputBase-input': {
              color: 'grey', // Text color
            },
          }}
        />
        <Button 
          // variant="contained"
          // onClick={handleSubmit}
          startIcon={<SendIcon />}
          onClick={sendMessage}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
}
