import { Button } from "@/components/ui/button";
import SigninButton from "./components/Signin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {/* Main Heading */}
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-foreground leading-tight">
              Welcome to
              <span className="block text-main mt-2">Inventory Management</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-base max-w-2xl mx-auto">
              Streamline your product and store management with our powerful inventory system.
              Manage products, track inventory, and oversee multiple stores all in one place.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Card className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Product Management</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Create and manage your product catalog with ease
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Store Operations</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Oversee multiple stores and their inventory levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Real-time Tracking</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Monitor inventory changes and consumption patterns
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Sign In Section */}
          <div className="flex justify-center pt-4 sm:pt-8">
            <Card className="w-full max-w-md border-2 border-border shadow-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Get Started</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Sign in with your Google account to begin managing your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <SigninButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
