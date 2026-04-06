const Footer = () => {
  return (
    <footer className="bg-green-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Section */}
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Forest Guardian. All rights reserved.
        </div>

        {/* Center Links */}
        <div className="flex gap-4 text-sm">
          <a
            href="#"
            className="hover:text-green-300 transition"
          >
            About
          </a>

          <a
            href="#"
            className="hover:text-green-300 transition"
          >
            Contact
          </a>

          <a
            href="#"
            className="hover:text-green-300 transition"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right Section */}
        <div className="text-sm text-center md:text-right">
          Built with 🌱 for Wildlife Conservation
        </div>

      </div>
    </footer>
  );
};

export default Footer;
