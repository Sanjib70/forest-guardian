import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Protecting Forests,
            <br />
            Preserving Our Future
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-200">
            A unified platform to monitor reserve forests, wildlife sanctuaries,
            protected forests, and urban green ecosystems.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/map")}
              className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded font-semibold transition"
            >
              Explore Interactive Map
            </button>

            <button
              onClick={() => navigate("/report-issue")}
              className="bg-white text-green-800 hover:bg-gray-100 px-6 py-3 rounded font-semibold transition"
            >
              Report Environmental Issue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
