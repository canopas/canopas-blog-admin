import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import config from "../../config";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Header({ mixpanel }) {
  const HOST_URL = config.WEBSITE_URL;
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContributionMenu, setShowContributionMenu] = useState(false);
  const [submenuTimeout, setSubmenuTimeout] = useState(null);

  const handleMenuClick = (Menu) => {
    mixpanel.track(Menu);
  };

  const handleMouseEnter = () => {
    clearTimeout(submenuTimeout);
    setShowContributionMenu(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowContributionMenu(false);
    }, 100);

    setSubmenuTimeout(timeout);
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setShowHeader(currentScrollPos < lastScrollPos);

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(submenuTimeout);
    };
  }, [showHeader, lastScrollPos, submenuTimeout]);

  return (
    <>
      <header
        className={`sticky w-full top-0 z-10 bg-white duration-500 ${
          isMenuOpen
            ? ``
            : `${
                showHeader
                  ? `${lastScrollPos > 0 ? "drop-shadow-lg" : ""}`
                  : "!-top-44"
              }`
        } header-section`}
      >
        <nav className="py-5 md:py-[1.75rem] font-inter-medium">
          <div className="container flex flex-row flex-wrap justify-start items-center 3xl:px-24">
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
                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/services`}
                    className={`relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/services`
                        ? "gradient-text"
                        : "hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                    onClick={() => {
                      handleMenuClick("tap_header_services");
                    }}
                  >
                    Services
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/portfolio`}
                    className={`relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/portfolio`
                        ? "gradient-text"
                        : "hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                    onClick={() => {
                      handleMenuClick("tap_header_portfolio");
                    }}
                  >
                    Portfolio
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/contributions`}
                    className="relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    Contribution
                  </Link>
                  <ul
                    className={`${
                      showContributionMenu
                        ? "block absolute left-auto top-[5.5rem] flex-col space-y-6 w-max border rounded-[5px] bg-white shadow-md pb-[1.5rem]"
                        : "hidden"
                    } ml-[-1.3rem] xl:ml-[-2rem] py-[1.5rem]`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <li className="relative ml-0 my-2 sm:my-0">
                      <Link
                        href={`${HOST_URL}/contributions`}
                        className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[27px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        onClick={() => {
                          handleMenuClick("tap_header_contributions");
                        }}
                      >
                        Open Source
                        <div className="absolute left-[-17px] top-[0] w-0 h-[100%] from-[#FF835B] to-[#F2709C] bg-gradient-to-r transition-all duration-300 ease group-hover:h-[100%] z-[-1] group-hover:w-[156px] group-hover:xl:w-[181px]"></div>
                      </Link>
                    </li>

                    <li className="ml-0 my-2 sm:my-0 relative">
                      <Link
                        href="https://blog.canopas.com/"
                        className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[27px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        onClick={() => {
                          handleMenuClick("tap_header_blog");
                        }}
                        target="_blank"
                      >
                        Blog
                        <div className="absolute left-[-17px] top-[0] w-0  h-[100%] from-[#FF835B] to-[#F2709C] bg-gradient-to-r transition-all duration-300 ease   group-hover:h-[100%] z-[-1] group-hover:w-[156px] group-hover:xl:w-[181px]"></div>{" "}
                      </Link>
                    </li>
                    <li className="ml-0 my-2 sm:my-0 relative">
                      <Link
                        href={`${HOST_URL}/resources`}
                        className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[27px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        onClick={() => {
                          handleMenuClick("tap_header_resources");
                        }}
                      >
                        Resources
                        <div
                          className="absolute left-[-17px] top-[0] w-0  h-[100%] from-[#FF835B] to-[#F2709C] bg-gradient-to-r transition-all duration-300 ease   group-hover:h-[100%] z-[-1] ${
                           group-hover:w-[156px] group-hover:xl:w-[181px]"
                        ></div>{" "}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/jobs`}
                    className={`relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/jobs`
                        ? "gradient-text"
                        : "hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                    onClick={() => {
                      handleMenuClick("tap_header_career");
                    }}
                  >
                    Career
                  </Link>
                </li>

                <li className="ml-0 my-2 sm:my-0">
                  <Link
                    href={`${HOST_URL}/about`}
                    className={`relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] ${
                      router.pathname == `${HOST_URL}/about`
                        ? "gradient-text"
                        : "hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
                    onClick={() => {
                      handleMenuClick("tap_header_about");
                    }}
                  >
                    About
                  </Link>
                </li>

                <li className="order-last ml-0 my-2 sm:my-0 p-0">
                  <Link
                    href={`${HOST_URL}/contact`}
                    className={`relative mb-0 mr-3.5 xl:mr-[25px] rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff835b] hover:shadow-[inset_2px_1000px_1px_#fff] py-[0.75rem] font-inter-bold text-white ${
                      router.pathname == `${HOST_URL}/contact`
                        ? "bg-clip-border gradient-text"
                        : ""
                    }`}
                    onClick={() => {
                      handleMenuClick("tap_header_cta");
                    }}
                  >
                    <span className="py-[1rem] px-[0.7rem] xl:px-[1.05rem] hoverable-text inline-block ">
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
                className={`fixed top-0 right-0 w-full h-screen bg-white p-4 md:px-10 duration-500 ease-in-out ${
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

                <ul className="flex flex-col justify-start h-[50%] sm:h-[45%] mt-5 text-[1rem] text-[1.09375rem] leading-[1.125rem] overflow-y-scroll">
                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/services`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left hoverable-text"
                      onClick={() => {
                        handleMenuClick("tap_header_services");
                      }}
                    >
                      Services
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/portfolio`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left hoverable-text"
                      onClick={() => {
                        handleMenuClick("tap_header_portfolio");
                      }}
                    >
                      Portfolio
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={``}
                      className="relative mr-3.5 xl:mr-[30px] after:absolute after:top-[29px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                      onClick={() => setShowContributionMenu((prev) => !prev)}
                    >
                      Contribution
                    </Link>
                    <ul
                      className={`flex-col space-y-6 ${
                        showContributionMenu
                          ? "mt-8 w-full px-6 bg-white"
                          : "hidden overflow-hidden"
                      }`}
                    >
                      <li className="relative">
                        <Link
                          href={`${HOST_URL}/contributions`}
                          className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[25px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                          onClick={() => {
                            handleMenuClick("tap_header_contributions");
                          }}
                        >
                          Open Source
                          <div className="fixed mt-[-31px] left-0 w-0 from-[#F2709C] to-[#FF835B] bg-gradient-to-r transition-all duration-100 ease group-hover:w-screen group-hover:h-[5%] z-[-1]"></div>{" "}
                        </Link>
                      </li>
                      <li className="relative">
                        <Link
                          href="https://blog.canopas.com/"
                          className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[25px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                          onClick={() => {
                            handleMenuClick("tap_header_blog");
                          }}
                        >
                          Blog
                          <div className="fixed mt-[-31px] left-0 w-0 from-[#F2709C] to-[#FF835B] bg-gradient-to-r transition-all duration-100 ease group-hover:w-screen group-hover:h-[5%] z-[-1]"></div>
                        </Link>
                      </li>
                      <li className="relative">
                        <Link
                          href={`${HOST_URL}/resources`}
                          className="relative mr-3.5 xl:mr-[30px] mx-2 font-inter-medium text-black-core/[0.6] after:absolute after:top-[25px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] hoverable-text hover:bg-gradient-to-r after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                          onClick={() => {
                            handleMenuClick("tap_header_resources");
                          }}
                        >
                          Resources
                          <div className="fixed mt-[-31px] left-0 w-0 from-[#F2709C] to-[#FF835B] bg-gradient-to-r transition-all duration-100 ease group-hover:w-screen group-hover:h-[5%] z-[-1]"></div>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/jobs`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left hoverable-text"
                      onClick={() => {
                        handleMenuClick("tap_header_career");
                      }}
                    >
                      Career
                    </Link>
                  </li>

                  <li className="my-5">
                    <Link
                      href={`${HOST_URL}/about`}
                      className="relative hover:bg-gradient-to-r after:absolute after:top-[26px] after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left hoverable-text"
                      onClick={() => {
                        handleMenuClick("tap_header_about");
                      }}
                    >
                      About
                    </Link>
                  </li>
                </ul>
                <div className="w-full h-auto bg-white p-4">
                  <div className="grid p-3 pb-5">
                    <Link
                      href={`${HOST_URL}/contact`}
                      className="relative justify-self-center rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] font-inter-bold text-white "
                      onClick={() => {
                        handleMenuClick("tap_header_cta");
                      }}
                    >
                      <div className="py-[0.8rem] px-[1.05rem] sm:px-[2rem] text-lg hoverable-text inline-block">
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
