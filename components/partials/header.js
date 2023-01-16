import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import User from "../../assets/images/user.png";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCallback } from "react";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const onScroll = useCallback((event) => {
    const { pageYOffset, scrollY } = window;
    setScrollY(window.pageYOffset);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { passive: true });
    };
  }, [onScroll]);

  return (
    <>
      <nav
        className={`${
          scrollY
            ? `md:py-2 shadow-[0_13px_35px_-12px_rgba(35,35,35,0.15)]`
            : `md:px-0 md:py-3 lg:py-6`
        } sticky top-0 left-0 w-full z-[1] bg-white font-inter-medium`}
      >
        <div className="container flex flex-wrap items-center xl:justify-between py-4 ">
          <div className="items-center mr-7 mb-3 sm:my-3 xl:mr-5">
            <Link href="http://canopas.com">
              <Image
                src={Logo}
                className="mt-1 w-[205px] h-[38.5px] "
                alt="canopas-logo"
              />
            </Link>
          </div>
          <div className="flex items-center mr-0 mb-3 xs:mr-7 sm:my-2 lg:mr-4  rounded-[12px] bg-slate-100 pl-5">
            <span>
              <i className="lw-12 h-16 rounded-full text-gray-500 cursor-pointer">
                <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" />
              </i>
            </span>
            <input
              className="!w-52 !border-0 !bg-slate-100 "
              placeholder="Search"
              type="text"
            />
          </div>

          <div className="flex grow items-center">
            <ul className="flex flex-row flex-wrap items-center justify-start my-0 mb-3 sm:my-2 xl:ml-auto text-base lg:text-[1.125rem]">
              <li className="my-2 mr-4 font-normal">
                <Link
                  href="/"
                  className={
                    router.pathname == "/"
                      ? "relative md:mr-6 xl:mr-9 bg-gradient-to-r bg-clip-text pb-[5.5px] text-transparent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r from-pink-300 to-orange-300"
                      : "md:mr-6 xl:mr-9 pb-[5.5px] text-black-900 hover:relative hover:bg-clip-text hover:bg-gradient-to-r hover:text-transparent hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gradient-to-r from-pink-300 to-orange-300 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Featured
                </Link>
              </li>

              <li className="my-2 mr-4 font-normal ">
                <Link
                  href="/subscribe"
                  className={
                    router.pathname == "/subscribe"
                      ? "relative md:mr-6 xl:mr-9 bg-gradient-to-r bg-clip-text pb-[5.5px] text-transparent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r from-pink-300 to-orange-300"
                      : "md:mr-6 xl:mr-9 pb-[5.5px] text-black-900 hover:relative hover:bg-clip-text hover:bg-gradient-to-r hover:text-transparent hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gradient-to-r from-pink-300 to-orange-300 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Subscribe
                </Link>
              </li>

              <li className="my-2 mr-4 font-normal ">
                <Link
                  href="/write"
                  className={
                    router.pathname == "/write"
                      ? "relative md:mr-6 xl:mr-9 bg-gradient-to-r bg-clip-text pb-[5.5px] text-transparent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r from-pink-300 to-orange-300"
                      : "md:mr-6 xl:mr-9 pb-[5.5px] text-black-900 hover:relative hover:bg-clip-text hover:bg-gradient-to-r hover:text-transparent hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gradient-to-r from-pink-300 to-orange-300 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Write
                </Link>
              </li>

              <li className="my-2 mr-4 font-normal ">
                <Link
                  href="/login"
                  className={
                    router.pathname == "/login"
                      ? "relative md:mr-6 xl:mr-9 bg-gradient-to-r bg-clip-text pb-[5.5px] text-transparent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r from-pink-300 to-orange-300"
                      : "md:mr-6 xl:mr-9 pb-[5.5px] text-black-900 hover:relative hover:bg-clip-text hover:bg-gradient-to-r hover:text-transparent hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gradient-to-r from-pink-300 to-orange-300 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Login
                </Link>
              </li>

              <li className="my-2 font-normal">
                <div
                  onClick={() => setdropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center mr-10 md:mr-6 xl:mr-9 overflow-hidden text-black-900 
                            hover:cursor-pointer"
                >
                  Profile
                  <div className="ml-1 w-[35px] h-[35px] ">
                    <Image
                      src={User}
                      className="rounded-full h-full w-full"
                      alt="user-avtar"
                    />
                  </div>
                </div>

                <div
                  className={`${
                    dropdownOpen ? `opacity-100 visible` : "opacity-0 invisible"
                  } absolute mt-2 rounded-[10px] drop-shadow-md bg-white transition-all`}
                >
                  <Link
                    href="/stories"
                    className="block pt-4 pl-5 pr-16 text-sm lg:text-base text-slate-600 hover:text-slate-900"
                  >
                    Stories
                  </Link>
                  <Link
                    href="/logout"
                    className="block py-4 pl-5 pr-16 text-sm lg:text-base text-slate-600 hover:text-slate-900"
                  >
                    Logout
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
