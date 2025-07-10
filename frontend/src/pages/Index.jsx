import { Link } from "react-router-dom";

const features = [
  {
    icon: "🚨",
    title: "Report Issues",
    description: "Quickly report civic issues like garbage, potholes, broken lights, and more with photos and location.",
  },
  {
    icon: "👥",
    title: "Community Driven",
    description: "Connect citizens, government bodies, and NGOs in one platform for collaborative problem-solving.",
  },
  {
    icon: "📍",
    title: "Location-Based",
    description: "Track issues by location and domain to ensure targeted resolution and accountability.",
  },
  {
    icon: "✅",
    title: "Track Progress",
    description: "Monitor the status of reported issues from pending to completion with real-time updates.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold">C</div>
          <span className="font-bold text-xl">CityPulse</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your City, <span className="text-blue-600">One Report at a Time</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          CityPulse bridges the gap between citizens, government bodies, and NGOs to solve everyday civic issues.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Get Started</Link>
          <Link to="/login" className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50">Login to Dashboard</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How CityPulse Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Empowering communities through transparent collaboration and efficient issue resolution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg mb-8">Join thousands of citizens creating cleaner, safer, and better communities.</p>
        <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100">
          Start Reporting Issues Today
        </Link>
      </section>
    </div>
  );
};

export default Index;
  