// src/pages/domains/Domains.jsx
import { Link } from "react-router-dom";

const Domains = () => {
  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Explore Issues by Domain</h1>
      <ul className="space-y-2">
        <li>
          <Link to="/domain/water" className="text-blue-600 hover:underline">💧 Water Issues</Link>
        </li>
        <li>
          <Link to="/domain/garbage" className="text-blue-600 hover:underline">🗑️ Garbage Issues</Link>
        </li>
        <li>
          <Link to="/domain/road" className="text-blue-600 hover:underline">🚗 Road Issues</Link>
        </li>
        <li>
          <Link to="/domain/street" className="text-blue-600 hover:underline">💡 Street Issues</Link>
        </li>
        <li>
          <Link to="/domain/animals" className="text-blue-600 hover:underline">🐕 Animal-Related Issues</Link>
        </li>
        <li>
          <Link to="/domain/recycling" className="text-blue-600 hover:underline">♻️ Recycling Issues</Link>
        </li>
        <li>
          <Link to="/domain/others" className="text-blue-600 hover:underline">🔧 Other Issues</Link>
        </li>
      </ul>
    </div>
  );
};

export default Domains;
