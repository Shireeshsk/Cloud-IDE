import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Zap, Shield, Cloud, Terminal, Play, Folder, GitBranch } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Code Editor",
      description: "Monaco-powered editor with syntax highlighting for 20+ languages",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Run Code Instantly",
      description: "Execute JavaScript, Python, Java, C++ in isolated Docker containers",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Storage",
      description: "Store and organize your projects with MinIO-powered cloud storage",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Isolated",
      description: "Code execution in sandboxed containers with resource limits",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Folder className="w-8 h-8" />,
      title: "Project Management",
      description: "Organize files in folders with intuitive tree-view navigation",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant file loading and real-time code execution feedback",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className={`font-sans min-h-screen ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob ${isDark ? 'opacity-30' : 'opacity-20'
            }`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 ${isDark ? 'opacity-30' : 'opacity-20'
            }`}></div>
          <div className={`absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 ${isDark ? 'opacity-30' : 'opacity-20'
            }`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Cloud-Based Development Environment</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Code Anywhere,
            <br />
            Deploy Everywhere
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            A powerful cloud IDE with integrated code execution, file management, and real-time collaboration.
            Write, run, and manage your code from any browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Coding Free
                <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => navigate("/features")}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Explore Features
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-3xl font-bold text-blue-400">18+</div>
              <div className="text-sm text-gray-500">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">∞</div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">100%</div>
              <div className="text-sm text-gray-500">Cloud-Based</div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            {/* Browser Chrome */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-400">main.js - Cloud IDE</span>
              </div>
            </div>

            {/* Code Editor Mockup */}
            <div className="p-6 font-mono text-sm">
              <div className="space-y-2">
                <div className="flex gap-4">
                  <span className="text-gray-600">1</span>
                  <span className="text-purple-400">const</span>
                  <span className="text-blue-400">greet</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-yellow-400">(</span>
                  <span className="text-orange-400">name</span>
                  <span className="text-yellow-400">)</span>
                  <span className="text-purple-400">=&gt;</span>
                  <span className="text-yellow-400">{'{'}</span>
                </div>
                <div className="flex gap-4 pl-8">
                  <span className="text-gray-600">2</span>
                  <span className="text-blue-400">console</span>
                  <span className="text-gray-400">.</span>
                  <span className="text-yellow-400">log</span>
                  <span className="text-gray-400">(</span>
                  <span className="text-green-400">`Hello, ${'{'}{'}'}name{'}'}{'}'}!`</span>
                  <span className="text-gray-400">);</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">3</span>
                  <span className="text-yellow-400">{'}'}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">4</span>
                  <span className="text-gray-400"></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">5</span>
                  <span className="text-blue-400">greet</span>
                  <span className="text-gray-400">(</span>
                  <span className="text-green-400">"Cloud IDE"</span>
                  <span className="text-gray-400">);</span>
                </div>
              </div>

              {/* Output Panel */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Output</span>
                </div>
                <div className="text-green-400">
                  Hello, Cloud IDE!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Code
            </h2>
            <p className="text-xl text-gray-400">
              A complete development environment in your browser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            18+ Supported Languages
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Write and execute code in your favorite programming language
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "JavaScript", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20" },
              { name: "TypeScript", color: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20" },
              { name: "Python", color: "bg-blue-400/10 border-blue-400/20 text-blue-300 hover:bg-blue-400/20" },
              { name: "Java", color: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20" },
              { name: "C", color: "bg-blue-600/10 border-blue-600/20 text-blue-400 hover:bg-blue-600/20" },
              { name: "C++", color: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20" },
              { name: "Go", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20" },
              { name: "Rust", color: "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20" },
              { name: "Ruby", color: "bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600/20" },
              { name: "PHP", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20" },
              { name: "C#", color: "bg-purple-600/10 border-purple-600/20 text-purple-400 hover:bg-purple-600/20" },
              { name: "Swift", color: "bg-orange-600/10 border-orange-600/20 text-orange-400 hover:bg-orange-600/20" },
              { name: "Kotlin", color: "bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20" },
              { name: "Scala", color: "bg-red-700/10 border-red-700/20 text-red-400 hover:bg-red-700/20" },
              { name: "Perl", color: "bg-blue-700/10 border-blue-700/20 text-blue-400 hover:bg-blue-700/20" },
              { name: "R", color: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20" },
              { name: "Lua", color: "bg-indigo-600/10 border-indigo-600/20 text-indigo-400 hover:bg-indigo-600/20" },
              { name: "Bash", color: "bg-green-600/10 border-green-600/20 text-green-400 hover:bg-green-600/20" },
            ].map((lang, index) => (
              <div
                key={index}
                className={`px-5 py-2.5 ${lang.color} border rounded-full font-medium transition-all cursor-default text-sm`}
              >
                {lang.name}
              </div>
            ))}
          </div>

          {/* Language Categories */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-400">Web Development</h3>
              <p className="text-gray-400 text-sm mb-3">JavaScript, TypeScript, PHP</p>
              <div className="text-xs text-gray-500">Build modern web applications with full-stack support</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 text-green-400">Systems Programming</h3>
              <p className="text-gray-400 text-sm mb-3">C, C++, Rust, Go</p>
              <div className="text-xs text-gray-500">Low-level programming with high performance</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 text-purple-400">General Purpose</h3>
              <p className="text-gray-400 text-sm mb-3">Python, Java, Ruby, Kotlin</p>
              <div className="text-xs text-gray-500">Versatile languages for any project</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Coding?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join developers who are building amazing projects with Cloud IDE
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform shadow-2xl shadow-blue-500/50"
          >
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
