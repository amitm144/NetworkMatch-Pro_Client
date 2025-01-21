# LinkedIn Connection Matcher Chrome Extension

A Chrome Extension that helps users leverage their LinkedIn network to find job opportunities by matching connections with job openings.

## Features

- **Connection Analysis**: Extract and analyze LinkedIn connections
- **Job Matching**: Match connections with available job positions
- **Smart Filtering**: Filter and search through matches and connections
- **Network Visualization**: View and understand your professional network
- **Real-time Updates**: Sync with LinkedIn data and job listings

## Tech Stack

### Core Technologies
- **React 18**: Frontend framework
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Styling and design system
- **Chrome Extension APIs**: Browser integration

### UI Components
- **shadcn/ui**: Core UI components
- **Lucide Icons**: Modern icon system
- **Custom Components**:
  - LoadingState
  - EmptyState
  - Toast notifications

### State Management
- **React Context**: Global state management
- **Custom Hooks**:
  - `useSession`: Session management
  - `useFilters`: Search and filtering
  - `useErrorHandler`: Error handling
  - `useToast`: Notifications

### Development Tools
- **Vite**: Build tool and bundler
- **Chrome Extension Developer Tools**
- **React Developer Tools**

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared components
│   ├── features/         # Feature-specific components
│   └── ui/              # UI components (shadcn)
├── hooks/               # Custom hooks
├── lib/                 # Utilities and contexts
├── api/                 # API services
└── assets/             # Static assets
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amitm144/NetworkMatch-Pro_Client.git
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Development

1. Start development server:
```bash
npm run dev
```

2. The extension will auto-reload as you make changes

## Features Usage

### Connection Management
- Upload LinkedIn connections CSV
- View and filter connections
- Analyze connection data

### Job Matching
- Browse available jobs
- View matches between jobs and connections
- Filter and search through matches

### Session Management
- Maintain user session state
- Clear session data

## Best Practices

- Component composition for reusability
- Custom hooks for shared logic
- Context for global state
- Error boundaries for error handling
- Loading states for better UX
- Responsive design
- Performance optimizations
