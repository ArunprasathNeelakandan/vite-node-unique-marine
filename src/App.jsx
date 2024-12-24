import Home from "./components/Home/home";
import Login from "./components/Login";
import Admin from "./components/Admin/admin";
import NotFound from "./components/NotFound/notfound"
import Cookies from 'js-cookie'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";

function App() {
  const ProtectedRoute = () => {
    const token = Cookies.get(process.env.JWT_COOKIE_NMAE);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <>
      <div className="root">
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" exact element={<Admin />} />
            </Route>
            <Route path="/login" exact element={<Login />} />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
