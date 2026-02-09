import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Users, Calendar, TrendingUp, Shield } from 'lucide-react';

export default function SignedOutLanding() {
  const { login, loginStatus } = useInternetIdentity();
  const [logoError, setLogoError] = useState(false);
  const [heroError, setHeroError] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!logoError ? (
              <img
                src="/assets/generated/gym-logo.dim_512x512.png"
                alt="GymFlow Logo"
                className="h-10 w-10"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Dumbbell className="h-10 w-10 text-primary" />
            )}
            <span className="font-bold text-2xl">GymFlow</span>
          </div>
          <Button onClick={handleLogin} disabled={loginStatus === 'logging-in'} size="lg">
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Sign In'}
          </Button>
        </div>
      </header>

      <main className="container">
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Modern Gym Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your fitness center operations with powerful member management, class scheduling, and attendance
            tracking.
          </p>
          <Button onClick={handleLogin} disabled={loginStatus === 'logging-in'} size="lg" className="text-lg px-8">
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Get Started'}
          </Button>
        </section>

        <section className="py-12">
          <div className="rounded-2xl overflow-hidden border bg-card shadow-lg">
            {!heroError ? (
              <img
                src="/assets/generated/gym-hero.dim_1600x600.png"
                alt="Gym Management Dashboard"
                className="w-full h-auto"
                onError={() => setHeroError(true)}
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                <Dumbbell className="h-32 w-32 text-primary/20" />
              </div>
            )}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Member Management</CardTitle>
                <CardDescription>Track member profiles, memberships, and status in one place.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Class Scheduling</CardTitle>
                <CardDescription>Organize classes, manage capacity, and handle registrations.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>Monitor check-ins and analyze member engagement patterns.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>Built on Internet Computer with decentralized authentication.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="py-20 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Transform Your Gym?</CardTitle>
              <CardDescription className="text-lg">
                Join modern fitness centers using GymFlow to manage their operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} disabled={loginStatus === 'logging-in'} size="lg" className="text-lg px-8">
                {loginStatus === 'logging-in' ? 'Connecting...' : 'Sign In Now'}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8 mt-20">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
