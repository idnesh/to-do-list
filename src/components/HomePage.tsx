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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FiCheckSquare className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TodoPro</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Life with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Todos
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The most intuitive task management app that adapts to your workflow.
            Create, prioritize, and complete tasks with ease while staying focused on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignup}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 group"
            >
              Start for Free
              <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <FiPlay className="h-5 w-5" />
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently and achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See TodoPro in action
            </h2>
            <p className="text-xl text-gray-600">
              Experience the intuitive interface that makes task management effortless.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="ml-4 text-gray-600 text-sm">TodoPro Dashboard</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FiCheckSquare className="h-5 w-5 text-green-600" />
                <span className="flex-1 text-gray-900">Complete project presentation</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High Priority</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                <span className="flex-1 text-gray-900">Review quarterly reports</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                <span className="flex-1 text-gray-900">Schedule team meeting</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their productivity journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have transformed their task management with TodoPro.
          </p>
          <button
            onClick={onSignup}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <FiCheckSquare className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">TodoPro</span>
            </div>
            <div className="text-gray-400">
              © 2024 TodoPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};