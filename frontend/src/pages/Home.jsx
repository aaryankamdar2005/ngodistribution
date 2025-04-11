import image1 from "../hero.jpg";

function Home() {
  return (
    <>
      {/* Hero Section with translucent overlay */}
      <div
        className="h-[90vh] bg-cover bg-center flex items-center justify-center px-6"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-xl text-white text-center max-w-3xl w-full space-y-6 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">
            Welcome to Food Redistribution
          </h1>
          <p className="text-lg text-gray-200">
            A platform that connects donors with NGOs to reduce food wastage and help those in need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition duration-300">
              Donate Food
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition duration-300">
              Request Food
            </button>
          </div>
        </div>
      </div>

      {/* Section Below */}
      <div className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome to Our Platform
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Join us in creating a community where no food goes to waste. Whether you're a donor looking to make a difference or an NGO in need of supplies, our platform ensures fast and reliable connections.
        </p>
      </div>
    </>
  );
}

export default Home;
