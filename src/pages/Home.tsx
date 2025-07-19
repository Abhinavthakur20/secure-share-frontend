import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: 'End-to-End Encryption',
      description: 'Files are encrypted before upload and decrypted only upon authorized download'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'OTP Verification',
      description: 'One-time passwords sent via email/SMS ensure only intended recipients can access files'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'One-Time Download',
      description: 'Links expire after single use or time limit, ensuring maximum security'
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Audit Trail',
      description: 'Complete tracking of all file activities with IP logging and timestamps'
    }
  ];

  const benefits = [
    'Military-grade AES encryption',
    'Automatic link expiration',
    'No permanent storage',
    'Email & SMS notifications',
    'IP-based access control',
    'Complete audit logging'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm animate-glow">
                <Shield className="h-16 w-16 text-primary animate-float" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Secure File Sharing
              <br />
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up">
              Share sensitive files with confidence using military-grade encryption, 
              one-time download links, and OTP verification. Your security is our priority.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="hero" size="xl" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="glass" size="xl" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-white/10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Security Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with security professionals in mind, SecureShare provides the tools you need 
              to share sensitive information safely and efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="gradient-card hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How SecureShare Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple steps to secure file sharing with enterprise-level protection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload & Encrypt',
                description: 'Upload your file and specify recipient details. Files are automatically encrypted using AES-256 encryption.'
              },
              {
                step: '2',
                title: 'Generate Secure Link',
                description: 'Receive a unique, time-limited download link. An OTP is automatically sent to the recipient\'s email.'
              },
              {
                step: '3',
                title: 'Secure Download',
                description: 'Recipient enters OTP to decrypt and download the file. Link expires after use for maximum security.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-glow">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose SecureShare?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Designed for businesses and individuals who need to share sensitive information 
                without compromising security. Our platform ensures your files remain private 
                and accessible only to intended recipients.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="gradient-card shadow-glow">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Trusted by 10,000+ Users</h4>
                        <p className="text-sm text-muted-foreground">Businesses worldwide rely on SecureShare</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Security Rating</span>
                        <span className="font-semibold">99.9%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="gradient-primary h-2 rounded-full" style={{ width: '99.9%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        "SecureShare has transformed how we handle confidential documents. 
                        The peace of mind knowing our files are truly secure is invaluable."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-20 lg:py-32 gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Share Files Securely?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who trust SecureShare for their sensitive file sharing needs.
              Get started today with our free plan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Sharing Securely
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;