import React from "react";
import Image from "next/image";
import cta800 from "../../assets/images/cta/fifth-cta-800w.webp";
import Link from "next/link";
import config from "../../config";

export default function CTA() {
  return (
    <section>
      <div className="relative -bottom-4 md:-bottom-1 bg-black-core/[0.85] py-[50px]">
        <div className="absolute right-0 top-1 hidden h-[140px] border-l-[20px] border-[#F2709C] md:block lg:top-[2.25rem] xl:h-[185px] 2xl:top-[4.25rem]"></div>
        <div className="absolute bottom-[6.25rem] left-0 hidden h-[115px] border-l-[20px] border-[#FF9472] md:block"></div>

        <div className="container flex flex-col items-center md:flex-row md:flex-row-reverse 3xl:px-20">
          <div className="flex flex-col md:relative md:items-end lg:basis-[55.49%]">
            <p className="text-center font-inter-bold text-[2.625rem] leading-[3.125rem] text-white md:text-right md:text-[3.275rem] md:leading-[3.875rem] xl:text-[5.625rem] xl:leading-[6.125rem]">
              <span className="bg-gradient-L bg-clip-text text-transparent">
                L
              </span>
              et&apos;s
              <span className="ml-3 md:ml-5 mr-[-0.2rem] bg-gradient-W bg-clip-text text-transparent">
                W
              </span>
              ork
              <br className="sm:hidden md:inline-block" />
              <span className="ml-3 md:ml-0 mr-[-0.2rem] bg-gradient-T bg-clip-text text-transparent">
                T
              </span>
              ogether
            </p>
            <p className="sm:w-[385px] mt-6 text-center font-inter-regular text-[1rem] leading-[1.5rem] text-white md:text-right md:text-[1.4rem] md:leading-[2rem] md:text-white/[0.75] xl:w-[82%] xl:text-[1.75rem] xl:leading-[2.625rem] 2xl:w-[68%]">
              Not sure where to start? We also offer code and architecture
              reviews, strategic planning, and more.
            </p>
            <Link href={`${config.WEBSITE_URL}/contact`} className="mt-10">
              <div className="flex items-center mx-auto md:mx-0 w-max rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-center font-normal  text-[1.09375rem] leading-[1.3125rem] xl:text-[1.188rem] xl:leading-[1.188rem] font-inter-semibold !tracking-[0] text-white active:scale-[0.98]">
                <span className="py-[0.9rem] md:py-[1rem] px-[1.2rem] md:px-[1.3rem] hoverable-text inline-block">
                  Get Free Consultation
                </span>
              </div>
            </Link>
          </div>
          <div className="relative lg:basis-[44.51%] mt-8 md:mt-0">
            <Image
              src={cta800}
              alt="cta-image"
              className="mt-4 w-[85%] h-[85%] sm:w-[80%] sm:h-[80%] md:w-full md:h-full md:mt-0 mx-[7.5%] sm:mx-[10%] md:mx-0"
            />

            <div className="gradient-border absolute bottom-4 left-[0.5rem] h-[55px] border-l-[13px] md:hidden"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
