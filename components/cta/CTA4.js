import React from "react";
import Image from "next/image";
import cta2400 from "../../assets/images/cta/fourth-cta-2400w.webp";
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
      <div className="mt-[20px] lg:mt-[150px] xl:mt-[170px] 2xl:mt-[250px] 3xl:mt-[280px] bg-[#F8F8F8] font-inter-regular">
        <div className="container flex flex-col md:flex-row 3xl:w-[82.5rem]">
          <div className="md:relative order-2 md:order-first md:w-[50%]">
            <Image
              src={cta2400}
              alt="fourth-cta-image"
              className="w-[85%] h-[85%] sm:w-[80%] sm:h-[80%] md:w-fit md:h-fit object-contain mx-[7.5%] sm:mx-[10%] md:mx-0 -mb-[1.5rem] sm:-mb-[0.9rem] md:absolute md:right-[2.5rem] md:-top-[2.6rem] lg:right-[2.5rem] lg:-top-[2.9rem] xl:right-[1.5rem] xl:-top-[7.6rem] 2xl:right-[2.5rem] 2xl:-top-[11.5rem] 3xl:right-[3.5rem]"
              loading="lazy"
            />
          </div>

          <div className="flex md:w-[50%] py-[10px] lg:py-[40px] 2xl:py-[50px] 2xl:pl-[8.5rem]">
            <div className="m-auto md:m-5 md:ml-auto xl:m-auto w-[80%] sm:w-[60%] md:w-full py-[40px] md:py-0">
              <p className="text-black-core/[0.87] text-[1.5rem] leading-[1.813rem] md:text-[1.7rem] md:leading-[1.9rem] lg:text-[2.188rem] lg:leading-[2.625rem] xl:text-[3.125rem] xl:leading-[3.813rem] font-inter-bold">
                Whether you need...
              </p>
              <ul className="pl-0 pt-6 md:pt-4 lg:pt-6 text-[1rem] text-black-core/[0.6] leading-[1.25rem] md:text-[1.05rem] md:leading-[1.34rem] lg:text-[1.188rem] lg:leading-[1.5rem] xl:text-[1.375rem] xl:leading-[1.8125rem] font-inter-semibold">
                {reasons.map((reason, index) => {
                  return (
                    <li className="flex" key={index}>
                      <span className="pr-1">*</span>
                      <div className="sm:w-[90%]">{reason}</div>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-6 md:pt-4 lg:pt-6 text-black-core/[0.6] font-inter-regular text-[0.875rem] leading-[1.125rem] md:text-[0.9rem] md:leading-[1.15rem] lg:text-[1.125rem] lg:leading-[1.375rem] xl:text-[1.375rem] xl:leading-[1.813rem]">
                Bring us your toughest challenge and we&apos;ll show you the
                path to a sleek solution.
              </div>
              <Link href={`${config.WEBSITE_URL}/contact`} className="">
                <div className="flex items-center mt-5 md:mt-4 lg:mt-5 mx-auto md:mx-0 w-max rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-center font-normal text-[1rem] leading-[1.1875rem] md:text-[1.09375rem] md:leading-[1.3125rem] xl:text-[1.1875rem] xl:leading-[1.4375rem] font-inter-semibold !tracking-[0] text-white active:scale-[0.98]">
                  <span className="py-[0.7rem] px-[1.2rem] hoverable-text inline-block">
                    Talk to our experts
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
