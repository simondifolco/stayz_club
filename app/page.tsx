import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Elevate Your Hotel's Guest Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline operations, personalize stays, and delight guests with our intelligent hotel management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Book a Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by over 500+ hotels worldwide
            </p>
          </div>
        </section>
        <section className="text-center py-10">
          <h2 className="text-3xl font-bold">Invoicing, Time tracking, File reconciliation, Storage, Financial Overview & your own Assistant made for Founders</h2>
          <div className="flex justify-center gap-4 mt-6">
            <Button>Talk to founders</Button>
            <Button variant="outline">Start free trial</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Start free trial, no credit card required.</p>
        </section>
        <section className="flex flex-col items-center gap-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Subscribe to our Newsletter</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </CardContent>
          </Card>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Luxury Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our rooms are designed to provide you with the utmost comfort and luxury.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exclusive Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Check out our exclusive offers and discounts available for a limited time.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Have any questions? Feel free to reach out to us anytime.
              </p>
            </CardContent>
          </Card>
        </section>
        <section className="text-center py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-2xl font-bold">13,500+</h3>
              <p className="text-muted-foreground">Businesses</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">5,500+</h3>
              <p className="text-muted-foreground">Bank accounts</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">1.3M</h3>
              <p className="text-muted-foreground">Transactions</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">$812M</h3>
              <p className="text-muted-foreground">Transaction value</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
