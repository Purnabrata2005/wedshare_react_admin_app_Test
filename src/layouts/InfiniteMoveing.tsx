"use client";

// import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "WedShare made our wedding day unforgettable! All our guests could upload photos and we relive those memories every day.",
    name: "Priya & Arjun",
    title: "Married in 2025",
  },
  {
    quote:
      "Managing RSVPs and guest preferences was so easy. We had zero stress and everyone loved the digital invites!",
    name: "Emily & Daniel",
    title: "Happily Married",
  },
  {
    quote:
      "The event timeline kept our families on track and the notifications were a lifesaver. Highly recommend WedShare!",
    name: "Aisha & Omar",
    title: "Bride & Groom",
  },
  {
    quote:
      "We created our wedding registry and shared it with guests in seconds. WedShare is a must-have for modern couples.",
    name: "Sofia & Miguel",
    title: "Newlyweds",
  },
  {
    quote:
      "From photo galleries to guest management, everything was seamless. Our wedding memories are safe forever!",
    name: "Riya & Karan",
    title: "Celebrated with WedShare",
  },
];
