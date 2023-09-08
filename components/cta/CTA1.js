import Image from "next/image";
import background400w from "../../assets/images/cta/first-cta-400w.webp";
import desktop_background2400w from "../../assets/images/cta/first-cta-2400w.webp";
import Link from "next/link";
import config from "../../config";

export default function CTA() {
  return (
    <section className="relative bg-[#FDE0E2] bg-gradient-background md:mt-0 md:bg-none">
      <div className="md:hidden mb-[-15px] sm:mb-0">
        <Image
          src={background400w}
          alt="background-image"
          className="absolute h-full w-full"
          loading="lazy"
        />
        <div className="container sticky flex flex-col items-center justify-center py-20">
          <p className="gradient-text flex text-center font-inter-medium text-base leading-[1.21rem]">
            Get started today
          </p>
          <p className="mt-6 text-center font-inter-bold text-4xl leading-[2.723rem] text-black-core/[0.85]">
            Let&apos;s build the next big thing!
          </p>
          <p className="mt-4 text-center font-inter-regular text-sm leading-[1.313rem] text-black-core/[0.75]">
            Let&apos;s improve your business&apos;s digital strategy and
            implement robust mobile apps to achieve your business objectives.
            Schedule Your Free Consultation Now.
          </p>
          <Link href={`${config.WEBSITE_URL}/contact`}>
            <div className="flex items-center mt-10 mx-auto md:mx-0 w-max rounded-full border border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-center font-normal text-[1.1875rem] leading-[1.1875rem] font-inter-semibold tracking-normal text-white active:scale-[0.98]">
              <span className="py-4 px-[1.2rem] hoverable-text inline-block">
                Get Free Consultation
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <Image
          src={desktop_background2400w}
          alt="background-image"
          className="absolute h-full w-full"
          loading="lazy"
        />
        <div className="container sticky z-[1] flex flex-col items-center justify-center py-20 4xl:py-32">
          <p className="gradient-text text-center font-inter-medium text-lg leading-[1.375rem] xl:text-xl xl:leading-[1.513rem]">
            Get started today
          </p>
          <p className="mt-4 4xl:mt-6 text-center font-inter-bold text-[2.813rem] leading-[3.438rem] text-black-core/[0.85] xl:text-[3.438rem] xl:leading-[4.16rem]">
            Let&apos;s build the next big thing!
          </p>
          <p className="mt-4 4xl:mt-6 w-[75%] text-center font-inter-regular text-[1.063rem] leading-[1.625rem] text-black-core/[0.75] xl:text-xl xl:leading-[1.875rem]">
            Let&apos;s improve your business&apos;s digital strategy and
            implement robust mobile apps to achieve your business objectives.
            Schedule Your Free Consultation Now.
          </p>
          <Link href={`${config.WEBSITE_URL}/contact`}>
            <div className="flex items-center mt-10 mx-auto md:mx-0 w-max rounded-full border border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-center font-normal text-[1.1875rem] leading-[1.1875rem] font-inter-semibold tracking-normal text-white active:scale-[0.98]">
              <span className="py-4 px-[1.2rem] hoverable-text inline-block">
                Get Free Consultation
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
