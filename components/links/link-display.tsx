"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

interface Service {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: 'accommodation' | 'dining' | 'wellness' | 'services';
  featured?: boolean;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tripadvisor?: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
}

interface LinkDisplayProps {
  data: {
    hotelName: string;
    logo: string;
    coverImage: string;
    theme: string;
    location: string;
    rating: number;
    description: string;
    services: Service[];
    socialLinks: SocialLinks;
    contactInfo: ContactInfo;
  };
}

export function LinkDisplay({ data }: LinkDisplayProps) {
  const { hotelName, logo, coverImage, services, socialLinks, contactInfo, location, rating, description } = data;

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 w-full">
        <Image
          src={coverImage}
          alt={hotelName}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-2xl px-4 -mt-16 relative space-y-8 pb-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-background">
            <Image
              src={logo}
              alt={hotelName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{hotelName}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Icons.mapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>
        </div>

        {/* Featured Services */}
        {services.some(s => s.featured) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Featured</h2>
            <div className="grid gap-4">
              {services.filter(s => s.featured).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={service.url} target="_blank" rel="noopener noreferrer">
                    <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-muted">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h2 className="font-semibold">{service.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Services by Category */}
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize">{category}</h2>
            <div className="grid gap-4">
              {categoryServices.filter(s => !s.featured).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={service.url} target="_blank" rel="noopener noreferrer">
                    <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-muted">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h2 className="font-semibold">{service.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <Card className="p-4 space-y-3">
            <Link href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
              <Icons.phone className="h-4 w-4" />
              {contactInfo.phone}
            </Link>
            <Link href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
              <Icons.mail className="h-4 w-4" />
              {contactInfo.email}
            </Link>
            <Link href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
              <Icons.messageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
          </Card>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 pt-4">
          {socialLinks.instagram && (
            <Link
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icons.instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
          )}
          {socialLinks.facebook && (
            <Link
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icons.facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
          )}
          {socialLinks.twitter && (
            <Link
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icons.twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          )}
          {socialLinks.tripadvisor && (
            <Link
              href={socialLinks.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icons.star className="h-6 w-6" />
              <span className="sr-only">TripAdvisor</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 