import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import CssBaseline from '@mui/material/CssBaseline';

import { SnackbarProvider } from 'notistack';

import App from './App';

import 'chart.js/auto';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline />
        <SnackbarProvider
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
        <App />
    </StrictMode>,
);
