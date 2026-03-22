import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux store
import { store } from './redux/store';
import { loadUser } from './redux/slices/authSlice';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import FloatingCTA from './components/common/FloatingCTA';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import BookingSteps from './pages/BookingSteps';
import BookingSuccess from './pages/BookingSuccess';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// Styles
import './App.css';
import './styles/global.css';

function AppContent() {
  useEffect(() => {
    // Load user on app start if token exists
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Booking Routes - Allow public access */}
            <Route path="/booking" element={<BookingSteps />} />
            <Route path="/booking/:serviceSlug" element={<BookingSteps />} />
            <Route path="/booking-success" element={<BookingSuccess />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ErrorBoundary><Profile /></ErrorBoundary></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoute />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FloatingCTA />
        <Footer />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
