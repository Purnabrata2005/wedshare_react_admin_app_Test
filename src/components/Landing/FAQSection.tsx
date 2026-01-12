import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "./AnimatedContainer";

const faqs = [
  {
    q: "How do I create a wedding?",
    a: "Sign up, click Create Wedding, and fill in your details.",
  },
  {
    q: "Can guests upload photos?",
    a: "Yes. Guests can upload photos and videos easily.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade encryption with AES-256 for all photos and data. Your wedding details are protected with industry-standard security protocols.",
  },
  {
    q: "Can non-users access my wedding?",
    a: "Yes. You can share a link with guests—no account required. You control who can view and upload content.",
  },
  {
    q: "What encryption methods do you use?",
    a: "We use AES-256-GCM for data encryption and RSA-2048 for secure key management, ensuring your photos are protected in transit and at rest.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12 md:py-16 px-4 md:px-6 bg-muted/40">
      <div className="max-w-4xl mx-auto">
        <AnimatedContainer className="mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            Frequently Asked Questions
          </h2>
        </AnimatedContainer>

        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}