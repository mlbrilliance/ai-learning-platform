# AI Learning Platform - Document Processing Pipeline

A modern web application for processing PDF documents using state-of-the-art AI technology. This platform allows users to upload PDF documents and transform them into vector embeddings using Hugging Face's models, making them ready for advanced natural language processing tasks.

## Features

- **Modern UI/UX**
  - Beautiful, responsive design using Tailwind CSS
  - Dark mode support
  - Drag-and-drop file upload
  - Interactive components with Shadcn UI
  - Real-time visual feedback

- **Security**
  - Secure API key handling
  - Keys are never stored, only used for the current session
  - Automatic cleanup on page close/refresh

- **PDF Processing**
  - Support for PDF document uploads
  - Automatic text extraction
  - Vector embeddings generation
  - Chunk-based processing for large documents
  - Metadata preservation

## Tech Stack

- **Frontend**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**
  - Node.js
  - LangChain
  - Hugging Face Inference API
  - PDF Parse

- **Development**
  - TypeScript
  - ESLint
  - Jest for testing
  - PostCSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- A Hugging Face API key

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ai_learning_platform
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-api-key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Visit the application in your web browser
2. Enter your Hugging Face API key
3. Upload a PDF document by either:
   - Dragging and dropping it onto the upload area
   - Clicking the upload area to browse for files
4. Click "Process Document" to start the transformation
5. View the results in the modal dialog, showing:
   - Text chunks extracted from the PDF
   - Vector embeddings for each chunk
   - Metadata including page numbers

## Testing

Run the test suite:
```bash
pnpm test
```

Generate test PDFs:
```bash
node scripts/generateTestPDF.js
```

## Project Structure

```
ai_learning_platform/
├── components/         # React components
│   └── ui/            # Shadcn UI components
├── lib/               # Core libraries
│   └── rag/           # RAG implementation
├── pages/             # Next.js pages
├── public/            # Static assets
├── scripts/           # Utility scripts
├── styles/           # Global styles
└── tests/            # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [LangChain](https://js.langchain.com/) for document processing
- [Hugging Face](https://huggingface.co/) for the AI models
