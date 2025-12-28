"use client";

import { Button } from "@/components/ui/button";
import SigninButton from "./components/Signin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Store, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Building2,
  ShoppingCart,
  Activity,
  Github,
  Globe,
  Linkedin,
  Twitter
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Create and manage your complete product catalog. Add products, track details, and maintain a centralized database for all your inventory items."
    },
    {
      icon: Store,
      title: "Multi-Store Operations",
      description: "Oversee multiple store locations from a single dashboard. Monitor inventory levels, track stock movements, and manage operations across all your stores."
    },
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "Get instant updates on inventory changes. Monitor stock levels, track consumption patterns, and receive real-time alerts on inventory movements."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Manufacturers control product catalogs and store creation, while store owners manage their local inventory independently with secure access controls."
    },
    {
      icon: BarChart3,
      title: "Inventory Analytics",
      description: "Track initial and current quantities to identify slow-moving items. Foundation for advanced analytics to optimize your inventory turnover."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with Google OAuth authentication. Your data is protected with industry-standard encryption and access controls."
    }
  ];

  const benefits = [
    "Eliminate inventory visibility gaps across multiple locations",
    "Reduce stockouts and overstock situations",
    "Improve decision-making with real-time data",
    "Streamline operations with centralized management",
    "Scale effortlessly as your business grows",
    "Access your inventory from anywhere, anytime"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign In",
      description: "Authenticate securely with your Google account. No complex setup required."
    },
    {
      step: "2",
      title: "Choose Your Role",
      description: "Select between Manufacturer or Store Owner role based on your needs."
    },
    {
      step: "3",
      title: "Start Managing",
      description: "Manufacturers create products and stores. Store owners manage inventory."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-7xl mx-auto space-y-12 sm:space-y-16">
          {/* Main Heading */}
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-base border-2 border-border bg-secondary-background shadow-shadow text-sm font-base mb-4">
              <Zap className="size-4" />
              <span>Modern Inventory Management Solution</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading text-foreground leading-tight">
              Take Control of Your
              <span className="block text-main mt-2">Inventory Management</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-base max-w-3xl mx-auto leading-relaxed">
              Streamline your product and store management with our powerful inventory system. 
              Manage products, track inventory across multiple locations, and oversee operations all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="w-full sm:w-auto">
                <SigninButton />
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-border shadow-shadow text-center">
              <CardContent className="pt-6">
                <div className="text-2xl sm:text-3xl font-heading text-main mb-2">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-base">Real-time</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-border shadow-shadow text-center">
              <CardContent className="pt-6">
                <div className="text-2xl sm:text-3xl font-heading text-main mb-2">∞</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-base">Stores</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-border shadow-shadow text-center">
              <CardContent className="pt-6">
                <div className="text-2xl sm:text-3xl font-heading text-main mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-base">Access</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-border shadow-shadow text-center">
              <CardContent className="pt-6">
                <div className="text-2xl sm:text-3xl font-heading text-main mb-2">✓</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-base">Secure</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-24 bg-secondary-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-foreground">
              Powerful Features for
              <span className="block text-main mt-2">Modern Businesses</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-base max-w-2xl mx-auto">
              Everything you need to manage your inventory efficiently and scale your operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                >
                  <CardHeader>
                    <div className="size-12 rounded-base border-2 border-border bg-main/10 flex items-center justify-center mb-4">
                      <Icon className="size-6 text-main" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-foreground">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-base max-w-2xl mx-auto">
              Get started in minutes with our simple, intuitive process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {howItWorks.map((item, index) => (
              <Card 
                key={index}
                className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all relative"
              >
                <CardHeader>
                  <div className="absolute -top-4 -left-4 size-12 rounded-full bg-main border-4 border-background flex items-center justify-center">
                    <span className="text-main-foreground font-heading text-xl">{item.step}</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mt-4 mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-foreground">
                Why Choose Our
                <span className="block text-main mt-2">Inventory System?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-base leading-relaxed">
                Built specifically for businesses managing inventory across multiple locations. 
                Our solution addresses the core challenges of inventory visibility and control.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-main mt-0.5 shrink-0" />
                    <span className="text-foreground font-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-2 border-border shadow-shadow p-6">
                <Building2 className="size-8 text-main mb-4" />
                <h3 className="font-heading text-lg mb-2">Multi-Store</h3>
                <p className="text-sm text-muted-foreground font-base">
                  Manage unlimited stores from one dashboard
                </p>
              </Card>
              <Card className="border-2 border-border shadow-shadow p-6">
                <ShoppingCart className="size-8 text-main mb-4" />
                <h3 className="font-heading text-lg mb-2">Product Catalog</h3>
                <p className="text-sm text-muted-foreground font-base">
                  Centralized product management system
                </p>
              </Card>
              <Card className="border-2 border-border shadow-shadow p-6">
                <Activity className="size-8 text-main mb-4" />
                <h3 className="font-heading text-lg mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground font-base">
                  Instant inventory tracking and alerts
                </p>
              </Card>
              <Card className="border-2 border-border shadow-shadow p-6">
                <BarChart3 className="size-8 text-main mb-4" />
                <h3 className="font-heading text-lg mb-2">Analytics Ready</h3>
                <p className="text-sm text-muted-foreground font-base">
                  Foundation for advanced reporting
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="border-2 border-border shadow-shadow text-center">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-heading">
                Ready to Transform Your Inventory Management?
              </CardTitle>
              <CardDescription className="text-base sm:text-lg font-base max-w-2xl mx-auto">
                Join businesses that have streamlined their operations with our powerful inventory management system. 
                Get started in seconds with Google authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <SigninButton />
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-secondary-background py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col gap-8">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-heading text-xl text-foreground mb-2">Inventory Management System</h3>
                <p className="text-sm text-muted-foreground font-base">
                  Streamline your operations with modern inventory tracking
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/vishalkumargeed/INSYD.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-base border-2 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex items-center justify-center group"
                    aria-label="GitHub Repository"
                  >
                    <Github className="size-5 text-foreground group-hover:text-main transition-colors" />
                  </a>
                  <a
                    href="https://vishalkumargeed.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-base border-2 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex items-center justify-center group"
                    aria-label="Portfolio"
                  >
                    <Globe className="size-5 text-foreground group-hover:text-main transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/vishalkumargeed/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-base border-2 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex items-center justify-center group"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="size-5 text-foreground group-hover:text-main transition-colors" />
                  </a>
                  <a
                    href="https://x.com/vishalctx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-base border-2 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex items-center justify-center group"
                    aria-label="Twitter Profile"
                  >
                    <Twitter className="size-5 text-foreground group-hover:text-main transition-colors" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground font-base">
                   Vishal Kumar Geed
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
