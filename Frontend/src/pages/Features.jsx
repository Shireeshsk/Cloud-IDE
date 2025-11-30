import React from "react";
import { Code2, Zap, Shield, Cloud, Terminal, Play, Folder, GitBranch, Lock, Cpu, HardDrive, Gauge } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Code2 className="w-12 h-12" />,
      title: "Monaco Code Editor",
      description: "Professional-grade code editor powered by Monaco (VS Code engine) with IntelliSense, syntax highlighting, and multi-language support.",
      gradient: "from-blue-500 to-cyan-500",
      details: ["20+ Languages", "Auto-completion", "Error Detection", "Minimap View"]
    },
    {
      icon: <Play className="w-12 h-12" />,
      title: "Instant Code Execution",
      description: "Run JavaScript, Python, Java, and C++ code directly in your browser with real-time output display.",
      gradient: "from-green-500 to-emerald-500",
      details: ["Docker Containers", "15s Timeout", "Real-time Output", "Error Handling"]
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "Cloud Storage",
      description: "Store unlimited projects and files with MinIO-powered object storage. Access your code from anywhere.",
      gradient: "from-purple-500 to-pink-500",
      details: ["Unlimited Storage", "MinIO Backend", "Fast Upload", "Auto-sync"]
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure Execution",
      description: "Code runs in isolated Docker containers with strict resource limits and no network access.",
      gradient: "from-orange-500 to-red-500",
      details: ["Sandboxed", "No Network", "256MB RAM Limit", "CPU Throttling"]
    },
    {
      icon: <Folder className="w-12 h-12" />,
      title: "Project Organization",
      description: "Organize your code with folders and subfolders. Tree-view navigation makes finding files effortless.",
      gradient: "from-indigo-500 to-blue-500",
      details: ["Nested Folders", "File Tree", "Quick Search", "Drag & Drop"]
    },
    {
      icon: <Terminal className="w-12 h-12" />,
      title: "Integrated Terminal",
      description: "View code execution output in a dedicated terminal panel with syntax-highlighted error messages.",
      gradient: "from-yellow-500 to-orange-500",
      details: ["Output Panel", "Error Logs", "Execution Time", "Clear History"]
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Authentication & Security",
      description: "JWT-based authentication ensures your projects are private and secure. Only you can access your code.",
      gradient: "from-pink-500 to-rose-500",
      details: ["JWT Tokens", "Encrypted", "Private Projects", "Secure API"]
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Fast",
      description: "Optimized performance with instant file loading, real-time editing, and sub-second code execution.",
      gradient: "from-cyan-500 to-blue-500",
      details: ["<100ms Load", "Real-time Edit", "Fast Execution", "Optimized"]
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Resource Management",
      description: "Smart resource allocation ensures fair usage with CPU and memory limits per execution.",
      gradient: "from-violet-500 to-purple-500",
      details: ["0.5 CPU Cores", "256MB Memory", "64 Process Limit", "Fair Usage"]
    },
    {
      icon: <HardDrive className="w-12 h-12" />,
      title: "File Management",
      description: "Create, edit, delete, and organize files with an intuitive interface. Hover actions for quick operations.",
      gradient: "from-teal-500 to-green-500",
      details: ["Create Files", "Edit Content", "Delete Items", "Rename Support"]
    },
    {
      icon: <GitBranch className="w-12 h-12" />,
      title: "Version Control Ready",
      description: "Built with Git workflows in mind. Easily integrate with GitHub, GitLab, or Bitbucket.",
      gradient: "from-gray-500 to-slate-500",
      details: ["Git Compatible", "Branch Support", "Commit Ready", "Push/Pull"]
    },
    {
      icon: <Gauge className="w-12 h-12" />,
      title: "Performance Monitoring",
      description: "Track execution time, memory usage, and code performance with built-in monitoring tools.",
      gradient: "from-amber-500 to-yellow-500",
      details: ["Execution Time", "Memory Stats", "CPU Usage", "Performance Tips"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Powerful Features</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Everything You Need
            <br />
            to Code Like a Pro
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cloud IDE combines the power of a professional code editor with cloud storage and instant code execution.
            Build, test, and deploy from anywhere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Details */}
              <div className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Hover Gradient Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Built with Modern Technologies
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React", desc: "Frontend Framework" },
              { name: "Node.js", desc: "Backend Runtime" },
              { name: "Docker", desc: "Code Execution" },
              { name: "MinIO", desc: "Object Storage" },
              { name: "MongoDB", desc: "Database" },
              { name: "Monaco Editor", desc: "Code Editor" },
              { name: "JWT", desc: "Authentication" },
              { name: "Express", desc: "API Server" }
            ].map((tech, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
              >
                <div className="text-xl font-bold text-blue-400 mb-2">{tech.name}</div>
                <div className="text-sm text-gray-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Choose Cloud IDE?
          </h2>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">Cloud IDE</th>
                  <th className="px-6 py-4 text-center">Traditional IDEs</th>
                  <th className="px-6 py-4 text-center">Online Editors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { feature: "Browser-Based", cloudIDE: true, traditional: false, online: true },
                  { feature: "Code Execution", cloudIDE: true, traditional: true, online: false },
                  { feature: "Cloud Storage", cloudIDE: true, traditional: false, online: true },
                  { feature: "No Installation", cloudIDE: true, traditional: false, online: true },
                  { feature: "Multi-Language", cloudIDE: true, traditional: true, online: false },
                  { feature: "Secure Execution", cloudIDE: true, traditional: true, online: false },
                  { feature: "Free to Use", cloudIDE: true, traditional: false, online: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.cloudIDE ? <span className="text-green-400 text-2xl">✓</span> : <span className="text-red-400 text-2xl">✗</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.traditional ? <span className="text-green-400 text-2xl">✓</span> : <span className="text-red-400 text-2xl">✗</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.online ? <span className="text-green-400 text-2xl">✓</span> : <span className="text-red-400 text-2xl">✗</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
