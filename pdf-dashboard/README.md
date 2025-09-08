# PDF Editor with AI Extraction

A modern PDF editor application built with React, TypeScript, and Vite, featuring AI-powered text extraction using Google's Gemini API and a robust backend with MongoDB for data persistence.

## Features

- **PDF Upload & Viewing**: Upload and view PDF documents in a clean, responsive interface.
- **AI-Powered Text Extraction**: Extract and analyze text from PDFs using Google's Gemini AI.
- **Data Persistence**: Save, retrieve, update, and delete extracted data with a MongoDB backend.
- **RESTful API**: Full CRUD operations for managing extracted data.
- **Interactive UI**: Modern, responsive design with smooth animations.
- **Type Safety**: Built with TypeScript for better developer experience and code quality.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google Gemini API key
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pdfeditor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   # Frontend configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

The backend is a separate service that handles data persistence. Follow these steps to set it up:

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/pdf-editor
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Backend
- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## AI PDF Extraction

The AI PDF Extraction feature uses Google's Gemini API to analyze and extract text from PDF documents. To use this feature:

1. Navigate to the "AI Extraction" section using the navigation bar.
2. Upload a PDF file or drag and drop it into the designated area.
3. Optionally, provide a custom prompt to guide the AI's analysis.
4. View the extracted information, including:
   - Document title
   - Summary
   - Key points
   - Author and date (if available in the document)

## Technologies Used

- React 18
- TypeScript
- Vite
- Google Generative AI
- PDF.js
- React Router
- OGL (for WebGL effects)

## Configuration

You can customize the application by modifying the following environment variables in the `.env` file:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key

## Development

### Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── hooks/         # Custom React hooks
  ├── services/      # API and service integrations
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

### Available Plugins

This project uses the following Vite plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
