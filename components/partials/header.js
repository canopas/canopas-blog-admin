import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import Link from "next/link";
import config from "../../config";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Header() {
  const HOST_URL = config.HOST_URL;
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
        className={`sticky w-full top-0 z-10 bg-white duration-500 ${
          showHeader
            ? `${lastScrollPos > 0 ? "drop-shadow-lg" : ""}`
            : "-top-36"
        }`}
      >
        <nav className="lg:mt-3 py-5 px-[2%] lg:px-0 font-inter-medium">
          <div className="container flex flex-col xl:flex-row flex-wrap lg:flex-nowrap justify-start">
            <div className="mr-4 py-[0.3125rem] text-[1.25rem] text-black no-underline whitespace-nowrap">
              <Link href={HOST_URL}>
                <Image
                  src={Logo}
                  className="mt-1 w-[205px] h-[38.5px]"
                  alt="canopas-logo"
                />
              </Link>
            </div>

            <div className="flex grow items-center mt-2 lg:mt-0">
              <ul className="flex flex-row flex-wrap items-center justify-start xl:ml-auto pl-0 text-[1rem] md:text-[1.09375rem] lg:text-[1.1875rem] leading-[1.125rem] md:leading-[1.28125rem] lg:leading-[1.4375rem]">
                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/portfolio`}
                    className={`relative mr-[20px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/portfolio`
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Portfolio
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/about`}
                    className={`relative mr-[20px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/about`
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    About
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/jobs`}
                    className={`relative mr-[20px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/jobs`
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Career
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href="https://blog.canopas.com/"
                    className={`relative mr-[20px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == "https://blog.canopas.com/"
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    Blog
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/resources`}
                    className={`relative mr-[20px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] canopas-gradient-text`}
                  >
                    Resources
                  </Link>
                </li>

                <li className="lg:order-last ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href={`${HOST_URL}/contact`}
                    className={`relative lg:mb-0 mr-[20px] lg:mr-0 lg:ml-[20px] lg:rounded-full lg:border-[1px] lg:border-solid lg:border-transparent lg:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:lg:shadow-[inset_2px_1000px_1px_#fff] lg:py-[0.75rem] lg:font-bold lg:text-white ${
                      router.pathname == `${HOST_URL}/contact`
                        ? "lg:bg-clip-border canopas-gradient-text"
                        : ""
                    }`}
                  >
                    <span className="lg:py-[1rem] lg:px-[1.05rem] gradient-text lg:inline-block hidden">
                      Get Free Consulation
                    </span>
                    <span className="inline-block lg:hidden gradient-text">
                      Let&apos;s talk
                    </span>
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
