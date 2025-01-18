// src/App.jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query-config';
import { DataProvider } from './lib/data-context';
import { MainView } from './components/layout/main-view';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <div className="min-h-screen bg-background">
          <MainView />
          <Toaster />
        </div>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;