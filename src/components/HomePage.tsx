import React, { useState } from 'react';
import {
  FiCheckSquare,
  FiUsers,
  FiZap,
  FiShield,
  FiStar,
  FiArrowRight,
  FiPlay,
} from 'react-icons/fi';

interface HomePageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogin, onSignup }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FiCheckSquare className="h-8 w-8" />,
      title: "Smart Task Management",
      description: "Create, organize, and track your tasks with intelligent priority management and due date reminders.",
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: "Personal Workspace",
      description: "Your tasks, your way. Each user gets a private workspace to manage their personal productivity.",
    },
    {
      icon: <FiZap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built for speed with instant search, quick filters, and seamless task operations.",
    },
    {
      icon: <FiShield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security and remains completely private.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "This todo app has transformed how I manage my daily tasks. The interface is intuitive and the features are exactly what I need.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Software Developer",
      content: "Clean, fast, and reliable. Perfect for managing both personal tasks and work projects.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Student",
      content: "Love the tagging system and priority management. Helps me stay on top of my assignments and deadlines.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FiCheckSquare className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">TodoPro</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onLogin}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Organize Your Life with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Smart Todos
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors">
            The most intuitive task management app that adapts to your workflow.
            Create, prioritize, and complete tasks with ease while staying focused on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignup}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2 group"
            >
              Start for Free
              <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <FiPlay className="h-5 w-5" />
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Powerful features designed to help you manage tasks efficiently and achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-xl bg-white dark:bg-gray-700 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              See TodoPro in action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
              Experience the intuitive interface that makes task management effortless.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-black/50 p-8 max-w-4xl mx-auto transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="ml-4 text-gray-600 dark:text-gray-400 text-sm transition-colors">TodoPro Dashboard</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                <FiCheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="flex-1 text-gray-900 dark:text-gray-100 transition-colors">Complete project presentation</span>
                <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-1 rounded transition-colors">High Priority</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors">
                <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-500 rounded"></div>
                <span className="flex-1 text-gray-900 dark:text-gray-100 transition-colors">Review quarterly reports</span>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded transition-colors">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors">
                <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-500 rounded"></div>
                <span className="flex-1 text-gray-900 dark:text-gray-100 transition-colors">Schedule team meeting</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded transition-colors">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
              See what our users have to say about their productivity journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl transition-colors duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white transition-colors">{testimonial.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm transition-colors">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 transition-colors">
            Join thousands of users who have transformed their task management with TodoPro.
          </p>
          <button
            onClick={onSignup}
            className="bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors font-semibold text-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <FiCheckSquare className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">TodoPro</span>
            </div>
            <div className="text-gray-400 dark:text-gray-500 transition-colors">
              © 2024 TodoPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};