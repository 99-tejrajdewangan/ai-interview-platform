import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { InterviewProvider } from './contexts/InterviewContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import CandidateDetails from './pages/CandidateDetails';
import InterviewSetup from './pages/InterviewSetup';
import InterviewScreen from './pages/InterviewScreen';
import CodingQuestion from './pages/CodingQuestion';
import InterviewSummary from './pages/InterviewSummary';

function App() {
  return (
    <ThemeProvider>
      <InterviewProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/candidate-details" element={<CandidateDetails />} />
              <Route path="/interview-setup" element={<InterviewSetup />} />
              <Route path="/interview" element={<InterviewScreen />} />
              <Route path="/coding" element={<CodingQuestion />} />
              <Route path="/summary" element={<InterviewSummary />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster position="top-right" />
      </InterviewProvider>
    </ThemeProvider>
  );
}

export default App;