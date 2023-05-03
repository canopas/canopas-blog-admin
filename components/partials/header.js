import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import config from "../../config";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Header() {
  const HOST_URL = config.CANOPAS_URL;
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  var [lastScrollPos, setLastScrollPos] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          isMenuOpen
            ? ``
            : `${
                showHeader
                  ? `${lastScrollPos > 0 ? "drop-shadow-lg" : ""}`
                  : "-top-44"
              }`
        }`}
      >
        <nav className="mt-2.5 py-5 md:py-[1.75rem] px-[2%] lg:px-0 font-inter-medium">
          <div className="container flex flex-row flex-wrap justify-start items-center">
            <div className="mr-4 py-[0.3125rem] text-[1.25rem] text-black no-underline whitespace-nowrap">
              <Link href={HOST_URL}>
                <Image
                  src={Logo}
                  className="mt-1 w-[205px] h-[38.5px]"
                  alt="canopas-logo"
                />
              </Link>
            </div>

            <div className="grid grow items-center mt-2 lg:mt-0">
              <ul className="hidden lg:flex flex-row flex-wrap items-center justify-start lg:ml-auto pl-0 text-[1rem] md:text-[1.10375rem] xl:text-[1.1875rem] leading-[1.125rem] md:leading-[1.28125rem] lg:leading-[1.4375rem]">
                {config.SHOW_SERVICES_PAGE ? (
                  <li className="ml-0 my-2 sm:my-0">
                    <Link
                      href={`${HOST_URL}/services`}
                      className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                        router.pathname == `${HOST_URL}/services`
                          ? "canopas-gradient-text"
                          : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                      }`}
                    >
                      Services
                    </Link>
                  </li>
                ) : (
                  ""
                )}

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/portfolio`}
                    className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
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
                    href={`${HOST_URL}/resources`}
                    className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] canopas-gradient-text`}
                  >
                    Resources
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href="https://blog.canopas.com/"
                    className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == "https://blog.canopas.com/"
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                    target="_blank"
                  >
                    Blog
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/jobs`}
                    className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
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
                    href={`${HOST_URL}/about`}
                    className={`relative mr-[14px] xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/about`
                        ? "canopas-gradient-text"
                        : "gradient-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                  >
                    About
                  </Link>
                </li>

                <li className="order-last ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href={`${HOST_URL}/contact`}
                    className={`relative mb-0 mr-[14px] xl:mr-[25px] rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff835b] hover:shadow-[inset_2px_1000px_1px_#fff] py-[0.75rem] font-bold text-white ${
                      router.pathname == `${HOST_URL}/contact`
                        ? "bg-clip-border canopas-gradient-text"
                        : ""
                    }`}
                  >
                    <span className="py-[1rem] px-[0.7rem] xl:px-[1.05rem] gradient-text inline-block ">
                      Get Free Consultation
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <section className="lg:hidden">
              <div
                className="h-6 w-6 space-y-2"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faBars} className="w-full h-full" />
              </div>

              <div
                className={`fixed top-0 right-0 w-full h-screen bg-white p-4 md:px-10 duration-500 ease-in-out overflow-y-hidden ${
                  isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="sticky top-0 w-full py-3">
                  <div className="flex justify-between items-center">
                    <div className="text-[1.25rem] text-black no-undurline whitespace-nowrap">
                      <Link href={HOST_URL}>
                        <Image
                          src={Logo}
                          className="mt-1 w-[190px] h-[34.5px]"
                          alt="canopas-logo"
                        />
                      </Link>
                    </div>
                    <div
                      className="h-6 w-6"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <ul className="flex flex-col justify-start mt-5 text-[1rem] text-[1.09375rem] leading-[1.125rem] overflow-y-auto">
                  {config.SHOW_SERVICES_PAGE ? (
                    <li className="my-5">
                      <Link
                        href={`${HOST_URL}/services`}
                        className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left gradient-text"
                      >
                        Services
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/portfolio`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left gradient-text"
                    >
                      Portfolio
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/resources`}
                      className={`relative after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] canopas-gradient-text`}
                    >
                      Resources
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href="https://blog.canopas.com/"
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left gradient-text"
                    >
                      Blog
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/jobs`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left gradient-text"
                    >
                      Career
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/about`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left gradient-text"
                    >
                      About
                    </Link>
                  </li>
                </ul>
                <div
                  className={`fixed bottom-0 left-0 w-full h-auto bg-white p-4 ${
                    isMenuOpen ? "shadow-[0_25px_50px_-12px_rgb(0,0,0)]" : ""
                  }`}
                >
                  <div className="grid p-3 pb-5">
                    <Link
                      href={`${HOST_URL}/contact`}
                      className="relative justify-self-center rounded-[8px] border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] font-bold text-white "
                    >
                      <div className="py-[0.8rem] px-[2.5rem] text-lg gradient-text inline-block">
                        Get Free Consultation
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </nav>
      </header>
    </>
  );
}
