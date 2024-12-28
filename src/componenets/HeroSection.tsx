const HeroSection = () => {
    return (
      <div className="hero bg-gradient-to-r from-blue-500 to-teal-400 text-white flex items-center justify-center h-screen">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Your App</h1>
          <p className="text-lg mb-6">
            Simplify your workflow and achieve more with our amazing features.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-100">
              Sign Up
            </button>
            <button className="bg-teal-500 px-6 py-2 rounded shadow hover:bg-teal-600">
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default HeroSection;
  