import React, { useState } from 'react';
import { MapPin, DollarSign, Calendar, CheckCircle, AlertCircle, Loader, Sparkles } from 'lucide-react';
import './index.css';

const App = () => {
  const [preferences, setPreferences] = useState({
    categories: '',
    location: '',
    budget: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const handleSubmit = async () => {
    if (!preferences.categories || !preferences.location || !preferences.budget) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('http://localhost:5000/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setMessage(data.message || 'Preferences saved successfully!');
      setMessageType('success');
      
      setPreferences({
        categories: '',
        location: '',
        budget: '',
      });
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage(error.message || 'Failed to save preferences. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80 flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative backdrop-blur-xl bg-white/10 border border-white/40 rounded-3xl shadow-2xl w-full max-w-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
            Event Preferences
          </h2>
          <p className="text-blue-100/80 text-sm">
            Customize your perfect event discovery experience
          </p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className=" text-white/90 font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Event Categories
            </label>
            <div className="relative">
              <input
                type="text"
                name="categories"
                value={preferences.categories}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="e.g. music, technology, art, sports"
                required
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="group">
            <label className=" text-white/90 font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={preferences.location}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="e.g. Sydney, Melbourne, Brisbane"
                required
              />
            </div>
          </div>

          {/* Budget Input */}
          <div className="group">
            <label className=" text-white/90 font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Preference
            </label>
            <div className="relative">
              <select
                name="budget"
                value={preferences.budget}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-gray-800 text-white">Select budget preference</option>
                <option value="free" className="bg-gray-800 text-white">Free events only</option>
                <option value="paid" className="bg-gray-800 text-white">Paid events only</option>
                <option value="both" className="bg-gray-800 text-white">Both free and paid</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
              messageType === 'success' 
                ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                : 'bg-red-500/20 border-red-400/30 text-red-100'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <div
            onClick={handleSubmit}
            className="w-full border-1 border-white/60 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving Preferences...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Save My Preferences
              </>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            Your preferences help us find the perfect events for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;