import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInterview } from '../contexts/InterviewContext';
import { User, Mail, Briefcase, Award, Code, Upload, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

export default function CandidateDetails() {
  const navigate = useNavigate();
  const { setCandidate } = useInterview();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    experienceLevel: '',
    skills: '',
    resumeFile: null as File | null
  });

  const experienceLevels = ['Entry Level (0-2 years)', 'Mid Level (3-5 years)', 'Senior Level (6+ years)', 'Lead/Manager (8+ years)'];
  const commonSkills = ['React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role || !formData.experienceLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const candidateData = {
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      experienceLevel: formData.experienceLevel,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
    };
    
    setCandidate(candidateData);
    toast.success('Candidate information saved!');
    navigate('/interview-setup');
  };

  const handleSkillClick = (skill: string) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      setFormData({ ...formData, skills: newSkills });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFormData({ ...formData, resumeFile: file });
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error('Please upload a PDF or Word document');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Candidate Information
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please provide your details to begin the AI interview process
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>

              {/* Role Applied For */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Role Applied For *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Frontend Developer / Full Stack Engineer"
                    required
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Experience Level *
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills / Technologies */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Skills / Technologies
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="React, Node.js, Python, MongoDB"
                    rows={3}
                  />
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick add common skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillClick(skill)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Resume */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Upload Resume (Optional)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.resumeFile ? formData.resumeFile.name : 'Click or drag to upload PDF/DOC'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full py-3 text-lg">
                Continue to Setup
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}