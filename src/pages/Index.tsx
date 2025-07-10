
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Shield, 
  Trash2, 
  Construction, 
  Droplets, 
  TreePine,
  Recycle,
  ChevronRight,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: MapPin,
      title: "Real-time Reporting",
      description: "Report civic issues instantly with location tracking",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect citizens, government, and NGOs seamlessly",
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "Transparent Process",
      description: "Track issue resolution with real-time status updates",
      color: "text-purple-500"
    }
  ];

  const domains = [
    { icon: Droplets, name: "Water", color: "bg-blue-100 text-blue-600" },
    { icon: Trash2, name: "Garbage", color: "bg-yellow-100 text-yellow-600" },
    { icon: Construction, name: "Road", color: "bg-orange-100 text-orange-600" },
    { icon: TreePine, name: "Street", color: "bg-green-100 text-green-600" },
    { icon: Heart, name: "Animals", color: "bg-pink-100 text-pink-600" },
    { icon: Recycle, name: "Recycling", color: "bg-teal-100 text-teal-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CityPulse
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-blue-50">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            CityPulse bridges the gap between citizens, government, and NGOs to resolve 
            civic issues faster. Report problems, track progress, and build stronger communities together.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3 group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 border-2 hover:bg-gray-50"
              >
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How CityPulse Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{
                        scale: hoveredFeature === index ? 1.1 : 1,
                        rotate: hoveredFeature === index ? 5 : 0
                      }}
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Domains Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Report Issues Across Multiple Domains
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {domains.map((domain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${domain.color} rounded-xl p-6 text-center cursor-pointer transition-all duration-300`}
              >
                <domain.icon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-medium">{domain.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.7, type: "spring" }}
                className="text-4xl font-bold mb-2"
              >
                1000+
              </motion.div>
              <p className="text-blue-100">Issues Resolved</p>
            </div>
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring" }}
                className="text-4xl font-bold mb-2"
              >
                50+
              </motion.div>
              <p className="text-blue-100">Communities Connected</p>
            </div>
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.9, type: "spring" }}
                className="text-4xl font-bold mb-2"
              >
                24h
              </motion.div>
              <p className="text-blue-100">Average Response Time</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of active citizens working together to create cleaner, 
            safer, and more beautiful communities.
          </p>
          
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3 group"
            >
              Start Reporting Issues
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
