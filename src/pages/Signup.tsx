
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Signup = () => {
  const [userType, setUserType] = useState<'citizen' | 'admin' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  const handleFacebookSignup = () => {
    console.log('Facebook signup clicked');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signup attempt:', { ...formData, userType });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/">
            <Button variant="ghost" className="mb-6 hover:bg-blue-50 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <motion.div 
                className="flex items-center justify-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CityPulse
                </h1>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Join CityPulse
              </CardTitle>
              <p className="text-gray-600">
                Choose your account type to get started
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setUserType('citizen')}
                  variant="outline"
                  className="w-full h-20 text-left justify-start hover:bg-blue-50 border-2 hover:border-blue-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Citizen</div>
                      <div className="text-sm text-gray-600">Report issues and track progress</div>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setUserType('admin')}
                  variant="outline"
                  className="w-full h-20 text-left justify-start hover:bg-purple-50 border-2 hover:border-purple-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Admin</div>
                      <div className="text-sm text-gray-600">Manage issues and update status</div>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <div className="text-center text-sm text-gray-600 pt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button 
          onClick={() => setUserType(null)}
          variant="ghost" 
          className="mb-6 hover:bg-blue-50 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Account Type
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${userType === 'citizen' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} rounded-lg flex items-center justify-center`}>
                {userType === 'citizen' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Shield className="w-6 h-6 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CityPulse
              </h1>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create {userType === 'citizen' ? 'Citizen' : 'Admin'} Account
            </CardTitle>
            <p className="text-gray-600">
              {userType === 'citizen' 
                ? 'Start reporting issues in your community' 
                : 'Manage and resolve community issues'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full h-12 text-left justify-start hover:bg-red-50 border-gray-200"
              >
                <div className="w-5 h-5 mr-3 bg-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                Continue with Google
              </Button>

              <Button
                onClick={handleFacebookSignup}
                variant="outline"
                className="w-full h-12 text-left justify-start hover:bg-blue-50 border-gray-200"
              >
                <div className="w-5 h-5 mr-3 bg-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" required />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 bg-gradient-to-r ${
                  userType === 'citizen' 
                    ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                    : 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                Create {userType === 'citizen' ? 'Citizen' : 'Admin'} Account
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
