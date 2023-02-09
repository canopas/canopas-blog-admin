import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  var [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setShowHeader(currentScrollPos < lastScrollPos);

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showHeader, lastScrollPos]);

  return (
    <>
      <header
        className={`sticky w-full top-0 z-10 bg-white ${
          showHeader
            ? `visible ${lastScrollPos > 0 ? "drop-shadow-lg" : ""}`
            : "invisible"
        }`}
      >
        <nav className="mt-4 md:mt-7 py-2.5 md:py-5 px-[2%] md:px-0 font-product-sans">
          <div className="container flex flex-col md:flex-row flex-wrap md:flex-nowrap justify-start">
            <div className="mr-4 py-[0.3125rem] text-[1.25rem] text-black no-underline whitespace-nowrap">
              <Link href="http://canopas.com">
                <Image
                  src={Logo}
                  className="mt-1 w-[205px] h-[38.5px]"
                  alt="canopas-logo"
                />
              </Link>
            </div>

            <div className="flex grow items-center">
              <ul className="flex flex-row flex-wrap items-center justify-start mb-[10px] my-0 md:ml-auto p-0 text-black-900/80">
                <li className="ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href="/"
                    className={`relative mr-[20px] sm:mr-[40px] text-[1rem] md:text-[1.0625rem] lg:text-[1.125rem] font-normal leading-[1.125rem] md:leading-[1.5rem] lg:leading-[1.875rem] tracking-[1px] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900 ${
                      router.pathname == "/"
                        ? ""
                        : "after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Home
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href="https://canopas.com/jobs"
                    className={`relative mr-[20px] sm:mr-[40px] text-[1rem] md:text-[1.0625rem] lg:text-[1.125rem] font-normal leading-[1.125rem] md:leading-[1.5rem] lg:leading-[1.875rem] tracking-[1px] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900 ${
                      router.pathname == "https://canopas.com/jobs"
                        ? ""
                        : "after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Career
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href="https://canopas.com/portfolio"
                    className={`relative mr-[20px] sm:mr-[40px] text-[1rem] md:text-[1.0625rem] lg:text-[1.125rem] font-normal leading-[1.125rem] md:leading-[1.5rem] lg:leading-[1.875rem] tracking-[1px] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900 ${
                      router.pathname == "https://canopas.com/portfolio"
                        ? ""
                        : "after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Portfolio
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href="https://canopas.com/contact"
                    className={`relative lg:rounded-full lg:border border-1 border-black-900 lg:bg-black-900 lg:shadow-[0_4px_4px_rgba(0,0,0,0.5)] lg:py-2.5 lg:px-6 text-[1rem] md:text-[1.0625rem] lg:text-[1.125rem] font-normal leading-[1.125rem] md:leading-[1.5rem] lg:leading-[1.875rem] tracking-[1px] lg:text-white hover:lg:border hover:lg:border-1 hover:border-black-900 hover:bg-white hover:text-black-900 after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:lg:h-[0px] after:bg-black-900 ${
                      router.pathname == "https://canopas.com/contact"
                        ? ""
                        : "after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Let&apos;s talk
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
