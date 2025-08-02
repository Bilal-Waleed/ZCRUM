"use client"
import React from 'react'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import companies  from '../data/companies'
import Image from 'next/image'

const CampanyCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full py-10"
      >
        <CarouselContent className={"flex gap-5 sm:gap-10 items-center "}> 
          {companies?.map(({name, path, id}) => {
            return (<CarouselItem key={id} className={"basis-1/3 lg:basis-1/6"}>
              <Image 
              src={path}
              width={200}
              height={56}
              alt={name}
              className='h-9 sm:h-14 object-contain w-auto'
              />

            </CarouselItem>
            )
          })}  

        </CarouselContent>
      </Carousel>
  )
}

export default CampanyCarousel;