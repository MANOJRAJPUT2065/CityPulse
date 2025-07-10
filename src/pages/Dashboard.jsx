
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  Bell, 
  LogOut, 
  Camera, 
  MapPin, 
  Send,
  MessageCircle,
  Heart,
  Droplets,
  Trash2,
  Car,
  Lightbulb,
  Dog,
  Recycle,
  MoreHorizontal
} from "lucide-react";

const Dashboard = () => {
  const [postContent, setPostContent] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [location, setLocation] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");

  const domains = [
    { id: "water", name: "Water", icon: Droplets, color: "bg-blue-500" },
    { id: "garbage", name: "Garbage", icon: Trash2, color: "bg-green-500" },
    { id: "road", name: "Road", icon: Car, color: "bg-gray-500" },
    { id: "street", name: "Street", icon: Lightbulb, color: "bg-yellow-500" },
    { id: "animals", name: "Animals", icon: Dog, color: "bg-orange-500" },
    { id: "recycling", name: "Recycling", icon: Recycle, color: "bg-emerald-500" },
    { id: "others", name: "Others", icon: MoreHorizontal, color: "bg-purple-500" }
  ];

  const mockPosts = [
    {
      id: 1,
      user: "John Doe",
      avatar: "/placeholder.svg",
      content: "Broken streetlight on Main Street causing safety issues at night",
      domain: "street",
      location: "Main Street, Downtown",
      status: "pending",
      time: "2 hours ago",
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      user: "Sarah Wilson",
      avatar: "/placeholder.svg",
      content: "Garbage overflow near the park entrance, needs immediate attention",
      domain: "garbage",
      location: "Central Park Entrance",
      status: "complete",
      time: "5 hours ago",
      likes: 8,
      comments: 1
    }
  ];

  const filteredPosts = filterDomain === "all" ? mockPosts : mockPosts.filter(post => post.domain === filterDomain);

  const handlePost = () => {
    // Add post logic here
    console.log("Posting:", { postContent, selectedDomain, location });
    setPostContent("");
    setSelectedDomain("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-4 space-y-4"
            >
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">John Doe</h3>
                      <p className="text-sm text-gray-500">Citizen</p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-3" />
                      Home
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Report an Issue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="What's the issue in your community?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Domain</Label>
                      <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {domains.map((domain) => (
                            <SelectItem key={domain.id} value={domain.id}>
                              <div className="flex items-center space-x-2">
                                <domain.icon className="h-4 w-4" />
                                <span>{domain.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <Button variant="outline" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Media
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={handlePost} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Post Issue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{post.user}</span>
                              <span className="text-gray-500 text-sm">{post.time}</span>
                            </div>
                            <Badge 
                              variant={post.status === "complete" ? "default" : "secondary"}
                              className={post.status === "complete" ? "bg-green-500" : "bg-yellow-500"}
                            >
                              {post.status === "complete" ? "Complete" : "Pending"}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-800 mb-3">{post.content}</p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{post.location}</span>
                            <Badge variant="outline" className="ml-2">
                              {domains.find(d => d.id === post.domain)?.name}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 pt-3 border-t">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Domain Filters */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Filter by Domain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={filterDomain === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFilterDomain("all")}
                  >
                    All Issues
                  </Button>
                  {domains.map((domain) => (
                    <Button
                      key={domain.id}
                      variant={filterDomain === domain.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setFilterDomain(domain.id)}
                    >
                      <domain.icon className="h-4 w-4 mr-3" />
                      {domain.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
