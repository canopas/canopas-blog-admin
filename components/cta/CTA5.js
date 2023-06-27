import React from "react";
import Image from "next/image";
import cta2400 from "../../assets/images/cta/fifth-cta-2400w.webp";
import Link from "next/link";
import config from "../../config";

export default function CTA() {
  const reasons = [
    "High-performing mobile apps",
    "Bulletproof cloud solutions",
    "Custom solutions for your business.",
  ];

  return (
    <section>
      <div className="from-[#F98584] to-[#F47695] bg-gradient-to-b font-inter-regular">
        <div className="container flex flex-col md:flex-row max-w-[1878px] -mb-[16px] sm:mb-[0px] 3xl:-mb-[1px]">
          <div className="hidden md:block md:w-[45%] xl:w-[40%] 2xl:pl-[74px]">
            <Image
              src={cta2400}
              alt="portfolio-cta-image"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex md:w-[55%]">
            <div className="m-auto md:ml-auto xl:m-auto w-[80%] sm:w-[60%] md:w-[80%] lg:w-[90%] 2xl:w-9/12 py-[20px] text-white">
              <p className="text-white text-[1.5rem] leading-[1.813rem] md:text-[1.7rem] md:leading-[1.9rem] lg:text-[2.188rem] lg:leading-[2.625rem] xl:text-[3.125rem] xl:leading-[3.813rem] font-inter-bold">
                Whether you need...
              </p>
              <ul className="pl-0 pt-6 md:pt-4 lg:pt-6 text-[1rem] text-white leading-[1.25rem] md:text-[1.05rem] md:leading-[1.34rem] lg:text-[1.188rem] lg:leading-[1.5rem] xl:text-[1.375rem] xl:leading-[1.8125rem] font-inter-semibold">
                {reasons.map((reason, index) => {
                  return (
                    <li className="flex" key={index}>
                      <span className="pr-1">*</span>
                      <div className="sm:w-[90%]">{reason}</div>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-6 md:pt-4 lg:pt-6 text-white font-inter-regular text-[0.875rem] leading-[1.125rem] md:text-[0.9rem] md:leading-[1.15rem] lg:text-[1.125rem] lg:leading-[1.375rem] xl:text-[1.375rem] xl:leading-[1.813rem]">
                Bring us your toughest challenge and we&apos;ll show you the
                path to a sleek solution.
              </div>
              <Link
                className="flex items-center mt-5 md:mt-4 lg:mt-5 xl:mb-5 mx-auto md:mx-0 w-max rounded-full text-center font-normal text-[1rem] leading-[1.1875rem] md:text-[1.09375rem] md:leading-[1.3125rem] lg:text-[1.1875rem] lg:leading-[1.4375rem] font-inter-medium !tracking-[0] border-[1px] border-solid border-white bg-white hover:bg-transparent"
                href={`${config.CANOPAS_URL}/contact`}
              >
                <span className="bg-gradient-to-l bg-clip-text text-transparent from-[#ff9472] to-[#f2709c] py-[0.7rem] xl:py-[0.8rem] px-[1.2rem] font-inter-semibold hover:text-white">
                  Talk to our experts
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
