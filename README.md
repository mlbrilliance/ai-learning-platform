# AI Learning Platform

A modern web application for processing and analyzing PDF documents using advanced AI capabilities. Built with Next.js, Supabase, and Hugging Face's AI models.

## Features

- 🔐 Secure Authentication with Google OAuth
- 📄 PDF Document Processing
- 🤖 AI-Powered Text Analysis
- 🎨 Modern UI with Dark Mode Support
- 📱 Responsive Design
- 🔄 Real-time Processing Status
- 🌐 Cloud-based Storage

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: Supabase Auth
- **AI/ML**: Hugging Face Models
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- A Supabase account
- A Hugging Face account and API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mlbrilliance/ai-learning-platform.git
cd ai-learning-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail

### Authentication
- Google OAuth integration
- Protected routes with middleware
- Automatic session management
- Secure PKCE flow implementation

### Document Processing
- PDF file upload and processing
- Text extraction and analysis
- Document chunking for better analysis
- Real-time processing status updates

### User Interface
- Modern, responsive design
- Dark mode support
- Loading states and error handling
- Beautiful animations and transitions
- Professional footer with developer information

## Deployment

The application is deployed on Vercel. For deployment, ensure the following:

1. Connect your GitHub repository to Vercel
2. Set up the environment variables in Vercel
3. Configure the Supabase project settings:
   - Add the production URL to the allowed redirect URLs
   - Update the site URL in authentication settings

## Recent Updates

### Authentication Improvements
- Simplified OAuth flow implementation
- Enhanced error handling
- Better session management
- Improved redirect handling

### UI Enhancements
- Added modern footer with developer information
- Improved responsive design
- Enhanced loading states
- Better error message displays

### Security Updates
- Implemented secure session handling
- Added protected route middleware
- Enhanced error boundary implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

- **Name**: Nick Sudh
- **Website**: [mlbrilliance.com](https://mlbrilliance.com)
- **GitHub**: [@mlbrilliance](https://github.com/mlbrilliance)

## Support

For support, please open an issue in the GitHub repository or contact the developer through the provided links.
