import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  CheckCircle, 
  Star,
  ArrowRight,
  Smile,
  Baby,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const services = [
    {
      icon: Shield,
      title: "Preventive Dental Care",
      description: "Regular checkups, cleanings, and preventive treatments to maintain optimal oral health."
    },
    {
      icon: Heart,
      title: "Restorative Treatments",
      description: "Fillings, crowns, bridges, and other treatments to restore damaged teeth."
    },
    {
      icon: Sparkles,
      title: "Cosmetic Dentistry",
      description: "Teeth whitening, veneers, and smile makeovers for a beautiful, confident smile."
    },
    {
      icon: Baby,
      title: "Pediatric Dental Services",
      description: "Specialized dental care for children in a friendly, comfortable environment."
    },
    {
      icon: Users,
      title: "Patient Education",
      description: "Comprehensive education on oral hygiene and preventive care practices."
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Experienced Dental Team",
      description: "Our skilled professionals have years of experience in modern dental care."
    },
    {
      icon: Smile,
      title: "Digital Records & Appointments",
      description: "Advanced digital systems for efficient record keeping and easy appointment scheduling."
    },
    {
      icon: Heart,
      title: "Patient-first Approach",
      description: "We prioritize your comfort and satisfaction in every treatment we provide."
    },
    {
      icon: Shield,
      title: "Hygienic, Modern Environment",
      description: "State-of-the-art facilities with the highest standards of cleanliness and safety."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">Dr. Seidnur</span>
              <br />
              Dental Clinic
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              "Your Smile, Our Priority"
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience exceptional dental care with our modern approach to oral health. 
              We combine advanced technology with compassionate care to give you the smile you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="#about"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Login / Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Our Clinic</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Committed to Excellence in Dental Care
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Dr. Seidnur Dental Clinic is a trusted provider of modern dental care, 
                committed to delivering high-quality, patient-centered services in a safe 
                and welcoming environment.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our team of experienced professionals uses the latest technology and 
                techniques to ensure you receive the best possible care for your oral health needs.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <span className="text-gray-600">5.0 Patient Rating</span>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                alt="Modern dental office"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of dental services to meet all your oral health needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes Dr. Seidnur Dental Clinic the right choice for your dental care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Dental Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust Dr. Seidnur Dental Clinic 
            for their oral health needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Register Now
            </Link>
            <Link 
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Patient Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;