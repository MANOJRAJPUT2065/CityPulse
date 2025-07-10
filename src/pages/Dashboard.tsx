
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Bell, 
  LogOut, 
  ArrowLeft, 
  Image, 
  Video, 
  MapPin, 
  Send,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Droplets,
  Trash2,
  Construction,
  TreePine,
  PawPrint,
  Recycle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    isAdmin: boolean;
  };
  content: string;
  domain: string;
  location: string;
  status: 'pending' | 'complete';
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  video?: string;
}

const Dashboard = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [postContent, setPostContent] = useState('');
  const [postDomain, setPostDomain] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user] = useState({
    name: 'John Doe',
    avatar: '/api/placeholder/40/40',
    isAdmin: false
  });

  const domains = [
    { id: 'water', name: 'Water', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
    { id: 'garbage', name: 'Garbage', icon: Trash2, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'road', name: 'Road', icon: Construction, color: 'bg-orange-100 text-orange-600' },
    { id: 'street', name: 'Street', icon: TreePine, color: 'bg-green-100 text-green-600' },
    { id: 'animals', name: 'Animals', icon: PawPrint, color: 'bg-pink-100 text-pink-600' },
    { id: 'recycling', name: 'Recycling', icon: Recycle, color: 'bg-teal-100 text-teal-600' },
    { id: 'others', name: 'Others', icon: AlertCircle, color: 'bg-gray-100 text-gray-600' },
  ];

  // Sample posts data
  useEffect(() => {
    setPosts([
      {
        id: '1',
        user: { name: 'Alice Johnson', avatar: '/api/placeholder/40/40', isAdmin: false },
        content: 'Street light has been broken for 3 days on Oak Street. Making it dangerous for pedestrians at night.',
        domain: 'street',
        location: 'Oak Street, Downtown',
        status: 'pending',
        timestamp: '2 hours ago',
        likes: 12,
        comments: 5,
        image: '/api/placeholder/400/300'
      },
      {
        id: '2',
        user: { name: 'Bob Smith', avatar: '/api/placeholder/40/40', isAdmin: false },
        content: 'Large pothole on Main Street causing damage to vehicles. Needs immediate attention.',
        domain: 'road',
        location: 'Main Street & 5th Ave',
        status: 'complete',
        timestamp: '4 hours ago',
        likes: 8,
        comments: 3
      },
      {
        id: '3',
        user: { name: 'Carol Williams', avatar: '/api/placeholder/40/40', isAdmin: false },
        content: 'Garbage bins overflowing in the park area. Health hazard for visitors.',
        domain: 'garbage',
        location: 'Central Park',
        status: 'pending',
        timestamp: '6 hours ago',
        likes: 15,
        comments: 7
      }
    ]);
  }, []);

  const handleCreatePost = () => {
    if (!postContent || !postDomain || !postLocation) return;

    const newPost: Post = {
      id: Date.now().toString(),
      user,
      content: postContent,
      domain: postDomain,
      location: postLocation,
      status: 'pending',
      timestamp: 'now',
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setPostDomain('');
    setPostLocation('');
  };

  const filteredPosts = selectedDomain === 'all' 
    ? posts 
    : posts.filter(post => post.domain === selectedDomain);

  const getDomainInfo = (domainId: string) => {
    return domains.find(d => d.id === domainId) || domains[6];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Left Sidebar */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 fixed"
          >
            <div className="space-y-6">
              {/* Back Button */}
              <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
                <ArrowLeft className="w-5 h-5 mr-3" />
                Back
              </Button>

              {/* Profile */}
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.isAdmin ? 'Admin' : 'Citizen'}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 text-blue-600">
                  <Home className="w-5 h-5 mr-3" />
                  Home
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                  <Badge variant="secondary" className="ml-auto">3</Badge>
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-red-50 text-red-600">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <div className="flex">
              {/* Middle Column - Posts Feed */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex-1 max-w-2xl border-r border-gray-200"
              >
                {/* Create Post */}
                <div className="bg-white border-b border-gray-200 p-6">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea
                        placeholder="What's happening in your community?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="min-h-[100px] border-0 resize-none text-lg placeholder-gray-500 focus:ring-0"
                      />
                      
                      <div className="flex flex-wrap gap-3">
                        <Select value={postDomain} onValueChange={setPostDomain}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {domains.map(domain => (
                              <SelectItem key={domain.id} value={domain.id}>
                                <div className="flex items-center space-x-2">
                                  <domain.icon className="w-4 h-4" />
                                  <span>{domain.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex-1 min-w-[200px]">
                          <Input
                            placeholder="Enter location"
                            value={postLocation}
                            onChange={(e) => setPostLocation(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <Image className="w-5 h-5 mr-2" />
                            Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <Video className="w-5 h-5 mr-2" />
                            Video
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <MapPin className="w-5 h-5 mr-2" />
                            Location
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={handleCreatePost}
                          disabled={!postContent || !postDomain || !postLocation}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="bg-white">
                  <AnimatePresence>
                    {filteredPosts.map((post) => {
                      const domainInfo = getDomainInfo(post.domain);
                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex space-x-3">
                            <Avatar>
                              <AvatarImage src={post.user.avatar} />
                              <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">{post.user.name}</span>
                                {post.user.isAdmin && (
                                  <Badge variant="secondary" className="text-xs">Admin</Badge>
                                )}
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500 text-sm">{post.timestamp}</span>
                                
                                {/* Status Badge */}
                                <Badge 
                                  variant={post.status === 'complete' ? 'default' : 'secondary'}
                                  className={`ml-auto ${
                                    post.status === 'complete' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {post.status === 'complete' ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Clock className="w-3 h-3 mr-1" />
                                  )}
                                  {post.status === 'complete' ? 'Complete' : 'Pending'}
                                </Badge>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${domainInfo.color}`}>
                                    <domainInfo.icon className="w-3 h-3 mr-1" />
                                    {domainInfo.name}
                                  </div>
                                  <span className="text-gray-500 text-sm flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {post.location}
                                  </span>
                                </div>
                                <p className="text-gray-900 text-base leading-relaxed">{post.content}</p>
                              </div>

                              {post.image && (
                                <div className="mb-3 rounded-lg overflow-hidden">
                                  <img 
                                    src={post.image} 
                                    alt="Post" 
                                    className="w-full h-64 object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between text-gray-500">
                                <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                                  <Heart className="w-4 h-4 mr-2" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                                  <Share className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Right Column - Domain Filters */}
              <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 bg-white p-6"
              >
                <div className="sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Domain</h2>
                  
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDomain('all')}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedDomain === 'all' 
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-medium">All Issues</div>
                      <div className="text-sm text-gray-500">View all reported issues</div>
                    </motion.button>

                    {domains.map((domain) => (
                      <motion.button
                        key={domain.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedDomain === domain.id 
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${domain.color}`}>
                            <domain.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">{domain.name}</div>
                            <div className="text-sm text-gray-500">
                              {posts.filter(p => p.domain === domain.id).length} issues
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
