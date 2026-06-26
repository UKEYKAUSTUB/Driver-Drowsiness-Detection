function LandingPage({ setShowDashboard }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white">
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">

  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

    <h1 className="text-2xl font-bold text-blue-400">
      🚗 DriverAI
    </h1>

    <div className="hidden md:flex gap-8 font-medium">

      <a
        href="#home"
        className="hover:text-blue-400 transition"
      >
        Home
      </a>

      <a
        href="#features"
        className="hover:text-blue-400 transition"
      >
        Features
      </a>

      <a
        href="#technology"
        className="hover:text-blue-400 transition"
      >
        Technology
      </a>

    </div>

    <button
      onClick={() => setShowDashboard(true)}
      className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition"
    >
      Dashboard →
    </button>

  </div>

</nav>

      {/* Hero */}
      <div id="home" className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold leading-tight">
            AI Powered
            <br />
            Driver Drowsiness &
             Yawn Detection
          </h1>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
            A real-time intelligent driver monitoring system designed to
            reduce fatigue-related accidents through continuous facial
            analysis, instant alerts and centralized dashboard monitoring.
          </p>

          <button
            onClick={() => setShowDashboard(true)}
            className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition duration-300"
          >
            🚀 Launch Dashboard
          </button>

        </div>

      </div>

      {/* Features */}

      <div id="features" className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          Why Dashboard Monitoring Matters
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">

            <div className="text-5xl mb-5">🚛</div>

            <h3 className="text-2xl font-bold mb-4">
              Fleet Management
            </h3>

            <p className="text-gray-300">
              Fleet operators can monitor every driver's alert history,
              identify fatigue trends and improve road safety across
              commercial transportation.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">

            <div className="text-5xl mb-5">📊</div>

            <h3 className="text-2xl font-bold mb-4">
              Driver Behaviour Analytics
            </h3>

            <p className="text-gray-300">
              Every drowsiness and yawn event is stored securely,
              allowing supervisors to analyse driver behaviour over time
              and take preventive actions.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">

            <div className="text-5xl mb-5">🛡️</div>

            <h3 className="text-2xl font-bold mb-4">
              Accident Prevention
            </h3>

            <p className="text-gray-300">
              Instant alerts, image evidence, GPS location and cloud
              storage enable rapid response before fatigue leads to
              serious road accidents.
            </p>

          </div>

        </div>

      </div>

      {/* Technology */}

      <div id="technology" className="bg-slate-950 py-16">

        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold mb-10">
            Technology Stack
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-slate-800 rounded-xl p-6">
              🐍
              <p className="mt-3 font-semibold">Python</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              👁️
              <p className="mt-3 font-semibold">OpenCV + Dlib</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              ⚛️
              <p className="mt-3 font-semibold">React</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              ☁️
              <p className="mt-3 font-semibold">Cloudinary + MongoDB</p>
            </div>

          </div>

        </div>
      </div>

      <footer className="bg-black border-t border-slate-700 ">

  <div className="max-w-7xl mx-auto px-6 py-12 text-center">

    <h3 className="text-3xl font-bold">
      🚗 Driver Drowsiness & Yawn Detection
    </h3>

    <p className="mt-5 text-gray-400 max-w-3xl mx-auto leading-8">
      AI-powered real-time driver monitoring system that detects
      drowsiness and yawning, stores cloud-based event history,
      tracks GPS location and enables dashboard analytics for
      fleet operators and transport organizations.
    </p>

    <div className="flex flex-wrap justify-center gap-3 mt-8">

      {[
        "Python",
        "OpenCV",
        "Dlib",
        "React",
        "Express",
        "MongoDB Atlas",
        "Cloudinary",
      ].map((tech) => (
        <span
          key={tech}
          className="bg-slate-800 px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition"
        >
          {tech}
        </span>
      ))}

    </div>

    <div className="border-t border-slate-800 mt-10 pt-6">

      <p className="text-gray-500">
        Final Year Research Project • Department of Computer Science & Engineering
      </p>

      <p className="text-gray-600 text-sm mt-2">
        © 2026 All Rights Reserved
      </p>

    </div>

  </div>

</footer>

    </div>
  );
}

export default LandingPage;