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
      className="h-screen relative"
    >
      <CarouselContent className="h-full -mt-0">
        <CarouselItem className="relative">
          <Image
            src="/images/main-clothes-1.avif"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="relative">
          <Image
            src="/images/main-clothes-2.avif"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
        <CarouselItem className="relative">
          <Image
            src="/images/main-clothes-3.avif"
            fill
            className="object-cover"
            alt=""
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
