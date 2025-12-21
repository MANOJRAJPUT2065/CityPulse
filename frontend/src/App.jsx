import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './ProtectedRoute';
import {
  publicRoutes,
  protectedRoutes,
  domainRoutes,
  errorRoutes,
} from './config/routes';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* ===== PROTECTED ROUTES ===== */}
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRole={route.role}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}

          {/* ===== DOMAIN-SPECIFIC ROUTES ===== */}
          {domainRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* ===== ERROR ROUTES ===== */}
          {errorRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
