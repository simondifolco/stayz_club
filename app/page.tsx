import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Hotel, 
  Smartphone, 
  Calendar,
  MessageSquare, 
  Settings2, 
  BarChart3,
  ArrowRight,
  Github,
  Twitter,
  MoreVertical,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import Footer from '@/components/footer';

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col w-full">
        <Navbar />
        {/* Hero Section */}
        <section className="min-h-[90vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-primary/5 to-secondary/20">
          <div className="w-full max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left Column - Text Content */}
            <div className="space-y-8 text-left relative z-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-[1.1] lg:max-w-[140%]">
                The only link you need
                <br />
                for your hotel
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                One powerful platform to manage bookings, services, and guest experiences. Share everything your hotel offers in a single link.
              </p>
              
              {/* URL Preview */}
              <div className="max-w-md relative">
                <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-muted-foreground">mhotel.app/</span>
                  <Input 
                    placeholder="yourhotel" 
                    className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button 
                  size="sm" 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Claim
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 border-primary/20 hover:bg-primary/5"
                >
                  View Live Demo
              </Button>
            </div>
              
              <p className="text-sm text-muted-foreground">
              Trusted by 500+ hotels worldwide
            </p>
            </div>

            {/* Right Column - Mobile Mockup */}
            <div className="absolute mr-24 right-36 h-[605px] w-1/3 hidden lg:block">
              {/* Phone Frame */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-[290px] h-[580px] bg-black rounded-[2.9rem] shadow-2xl transform rotate-12 border border-white/10">
                {/* Screen Border */}
                <div className="absolute inset-[2px] rounded-[2.8rem] overflow-hidden bg-background">
                  {/* Status Bar */}
                  <div className="relative w-full h-7 bg-background px-4 flex items-center justify-between z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-muted rounded-b-[1rem] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] bg-foreground/80 rounded-full absolute right-4" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="relative h-[calc(100%-27px)] w-full overflow-y-auto">
                    {/* Profile Content */}
                    <div className="flex flex-col items-center pt-8 px-6">
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden">
                        <div className="w-full h-full bg-muted-foreground/5" />
                      </div>
                      
                      {/* Profile Name */}
                      <h3 className="mt-4 text-xl font-semibold text-foreground">@hotelname</h3>
                      <p className="text-sm text-muted-foreground mt-1">Luxury Hotel & Spa</p>

                      {/* Social Links */}
                      <div className="flex gap-4 mt-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Twitter className="w-5 h-5 text-foreground/80" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Github className="w-5 h-5 text-foreground/80" />
                        </div>
                      </div>

                      {/* Services Section */}
                      <div className="w-full mt-8">
                        <h4 className="text-sm font-medium mb-3 px-2 text-muted-foreground">Services</h4>
                        <div className="space-y-3">
                          <div className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors">
                            <span className="text-foreground">Book a Room</span>
                            <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                          </div>
                          <div className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors">
                            <span className="text-foreground">Restaurant</span>
                            <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                          </div>
                          <div className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors">
                            <span className="text-foreground">Spa & Wellness</span>
                            <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                          </div>
                          <div className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors">
                            <span className="text-foreground">Events</span>
                            <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                          </div>
                        </div>
                      </div>

                      {/* Collections Section */}
                      <div className="w-full mt-8 pb-8">
                        <h4 className="text-sm font-medium mb-3 px-2 text-muted-foreground">Collections</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="aspect-video bg-muted rounded-xl" />
                          <div className="aspect-video bg-muted rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-[5px] flex items-center justify-center pb-1">
                    <div className="w-[134px] h-1 bg-muted-foreground/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-dot-pattern">
          <div className="w-full max-w-[1200px] mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Everything Your Hotel Needs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Hotel className="h-6 w-6 text-primary" />
                    Room Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Efficiently manage room bookings, availability, and maintenance schedules in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Smartphone className="h-6 w-6 text-primary" />
                    Mobile App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Give guests a seamless mobile experience for bookings, check-ins, and service requests.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Calendar className="h-6 w-6 text-primary" />
                    Smart Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Automate staff schedules, room cleaning, and maintenance with AI-powered tools.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Guest Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Stay connected with guests through integrated messaging and automated notifications.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Settings2 className="h-6 w-6 text-primary" />
                    Service Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Manage all hotel services from room service to spa bookings in one place.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Analytics & Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">
                    Get detailed insights into occupancy rates, revenue, and guest satisfaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 bg-gradient-to-b from-background to-secondary/5">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-3 p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/10">
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">98%</h3>
                <p className="text-base text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/10">
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">500+</h3>
                <p className="text-base text-muted-foreground">Hotels Worldwide</p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/10">
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">1+</h3>
                <p className="text-base text-muted-foreground">Happy Guests</p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/10">
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">24/7</h3>
                <p className="text-base text-muted-foreground">Support Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-[1200px] mx-auto backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-center">
                Ready to Transform Your Hotel Management?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of successful hotels already using our platform to deliver exceptional guest experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 border-primary/20 hover:bg-primary/5"
                >
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer/>
      </main>
    </>
  );
}
