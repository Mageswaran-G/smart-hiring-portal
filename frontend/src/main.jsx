import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext';

import App from './App.jsx'
import './index.css'
import './styles/auth.css'
import './styles/animations.css'
import './styles/editor.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,        // 30 seconds — data stays fresh
      retry: 1,                     // retry failed requests once
      refetchOnWindowFocus: false,  // don't refetch when switching tabs
    },
  },
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </QueryClientProvider>
)