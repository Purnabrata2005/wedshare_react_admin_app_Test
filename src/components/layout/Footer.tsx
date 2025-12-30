import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "WedShare",
    links: [
      { name: "Features", href: "#features" },
      { name: "Photo Gallery", href: "#" },
      { name: "Guest List", href: "#" },
      { name: "RSVP", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "FAQ", href: "#faq" },
      { name: "Feedback", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Blog", href: "#" },
      { name: "Stories", href: "#" },
      { name: "Events", href: "#" },
      { name: "Instagram", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms & Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

export const Footer = ({
  logo = {
    url: "#",
    src: "https://cdn-icons-png.flaticon.com/512/3176/3176367.png",
    alt: "WedShare logo",
    title: "WedShare",
  },
  sections = defaultSections,
  description = "WedShare helps you plan, organize, and celebrate your wedding with ease. Capture every moment, manage your guests, and create memories that last a lifetime.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 WedShare. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: FooterProps) => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left w-full lg:w-1/3">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-10 w-10 rounded-full shadow"
                />
              </a>
              <h2 className="text-xl font-semibold text-primary">{logo.title}</h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground mx-auto lg:mx-0">
              {description}
            </p>
            <ul className="flex items-center justify-center lg:justify-start space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-8 md:grid-cols-3 lg:gap-16 mt-8 lg:mt-0">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-primary/90">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary">
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground text-center md:text-left">
          <p className="order-2 md:order-1 w-full md:w-auto">{copyright}</p>
          <ul className="order-1 md:order-2 flex flex-col md:flex-row gap-2 md:gap-6 w-full md:w-auto justify-center md:justify-end">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
