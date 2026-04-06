import { Outlet } from "react-router-dom";
import pic1 from "../assets/images/pic1.jpg";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${pic1})`,
      }}
    >
      {/* Overlay to keep text readable */}
      <div className="min-h-screen bg-black/50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
