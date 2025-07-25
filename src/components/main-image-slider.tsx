'use client';

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function MainImageSlider() {
  return (
    <Carousel
      orientation="vertical"
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="relative w-full h-96 overflow-hidden rounded-2xl mx-auto"
    >
      <CarouselContent className="h-full -mt-0">
        <CarouselItem className="relative">
          <Image
            src="/images/main-1.jpg"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="relative">
          <Image
            src="/images/main-2.jpg"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="relative">
          <Image
            src="/images/main-3.jpg"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
