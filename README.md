# AI Interview Platform

A modern, fully-responsive AI-powered interview platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Landing Page**: Professional introduction with platform overview
- **Candidate Details**: Form to collect candidate information
- **Interview Setup**: Camera, microphone, and internet connection testing
- **AI Interview Screen**: Real-time interviewing with AI interviewer
- **Coding Challenge**: Integrated code editor with multiple language support
- **Interview Summary**: Comprehensive feedback and evaluation

### Advanced Features
- 🌓 Dark/Light mode with persistence
- 🎥 Camera and microphone integration
- 🎙️ Real-time audio level monitoring
- ⏱️ Question timer with visual warnings
- 📝 Monaco code editor with syntax highlighting
- 🎨 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔔 Toast notifications
- 📊 Progress tracking
- 🤖 AI interviewer with typing animations
- 📈 Performance metrics and scoring
- 💾 Auto-save functionality

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/ai-interview-platform.git
cd ai-interview-platform
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Build for production**
\`\`\`bash
npm run build
\`\`\`

5. **Preview production build**
\`\`\`bash
npm run preview
\`\`\`

## 🎯 Usage Guide

### Starting the Interview
1. Click "Start Interview" on the landing page
2. Fill in candidate details (Name, Email, Role, etc.)
3. Complete system checks (Camera, Microphone, Internet)
4. Begin the AI interview

### During Interview
- Answer questions verbally or by typing
- Use "Submit Answer" to proceed
- Skip questions if needed
- Monitor timer for each question
- Track progress through the progress bar

### Coding Challenge
- Select your preferred programming language
- Write solution in the code editor
- Run code to test against examples
- Submit final solution

### After Interview
- View comprehensive performance summary
- See AI-generated feedback
- Download interview report
- Review strengths and improvement areas

## 📁 Project Structure

\`\`\`
ai-interview-platform/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/              # Basic UI components
│   │   ├── layout/          # Layout components
│   │   ├── interview/       # Interview-specific components
│   │   └── common/          # Shared components
│   ├── pages/               # Page components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
└── vite.config.ts           # Vite config
\`\`\`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
\`\`\`env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=AI Interview Platform
\`\`\`

### Tailwind Configuration
Customize `tailwind.config.js` for theme modifications:
\`\`\`javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      // Add custom configurations
    }
  }
}
\`\`\`

## 🧪 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 🎨 Customization

### Themes
- Light theme (default)
- Dark theme (auto-detects system preference)

### Colors
Primary colors can be modified in `tailwind.config.js`:
\`\`\`javascript
colors: {
  primary: {
    50: '#eff6ff',
    600: '#2563eb',
    // ...
  }
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Icons by Lucide React
- Code editor by Monaco
- Animations by Framer Motion

## 📧 Support

For support, email support@aiinterview.com or open an issue on GitHub.

---

**Note**: This is a frontend demonstration project. Backend integration, actual AI processing, and real code execution would require additional implementation.