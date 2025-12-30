"use client"
import { useEffect, useState } from "react"

import { motion } from "motion/react"

let interval: any

type Card = {
  id: number
  image: string
}

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[]
  offset?: number
  scaleFactor?: number
}) => {
  const CARD_OFFSET = offset || 10
  const SCALE_FACTOR = scaleFactor || 0.06
  const [cards, setCards] = useState<Card[]>(items)

  useEffect(() => {
    startFlipping()

    return () => clearInterval(interval)
  }, [])
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards] // create a copy of the array
        newArray.unshift(newArray.pop()!) // move the last element to the front
        return newArray
      })
    }, 5000)
  }

  return (
    <div className="relative h-60 w-60 md:h-96 md:w-[32rem]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute dark:bg-black bg-white h-60 w-60 md:h-96 md:w-[32rem] rounded-3xl shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.05] dark:shadow-white/[0.05] overflow-hidden"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <img src={card.image || "/placeholder.svg"} alt={`Card ${card.id}`} className="object-cover w-full h-full absolute inset-0" />
          </motion.div>
        )
      })}
    </div>
  )
}
