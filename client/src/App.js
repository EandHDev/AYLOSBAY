import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homescreen from "./screens/Homescreen";
import AddRoom from "./screens/AddRoom";
import AdminRoom from "./screens/AdminRoom";
import BookingScreen from "./screens/BookingScreen"; // Make sure this is imported
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import "antd/dist/reset.css";
import BookingSuccessScreen from "./screens/BookingSuccessScreen"; // Make sure this is imported
import BookingFailureScreen from "./screens/BookingFailureScreen"; // Make sure this is imported
import AdminPanel from "./components/AdminPanel";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error:", error);
    console.log("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="container mt-5">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Wrap each route in an error boundary
const RouteWithErrorBoundary = ({ element }) => (
  <ErrorBoundary>{element}</ErrorBoundary>
);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={<RouteWithErrorBoundary element={<Homescreen />} />}
          />
          <Route
            path="/home"
            element={<RouteWithErrorBoundary element={<Homescreen />} />}
          />
          <Route
            path="/admin/addroom"
            element={<RouteWithErrorBoundary element={<AddRoom />} />}
          />
          <Route
            path="/admin/rooms"
            element={<RouteWithErrorBoundary element={<AdminRoom />} />}
          />
          {/* --- ADD THIS ROUTE BACK --- */}
          <Route
            path="/book/:roomid"
            element={<RouteWithErrorBoundary element={<BookingScreen />} />}
          />
          <Route path="/admin" element={<AdminPanel />} />
          {/* --- END ADDITION --- */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          {/* --- ADD THESE NEW ROUTES FOR PAYSTACK REDIRECTS --- */}
          <Route
            path="/booking-success"
            element={
              <RouteWithErrorBoundary element={<BookingSuccessScreen />} />
            }
          />
          <Route
            path="/booking-failure"
            element={
              <RouteWithErrorBoundary element={<BookingFailureScreen />} />
            }
          />
          {/* --- END ADDITION --- */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
