import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <>
      <nav className="sticky bg-white px-2 py-4 w-full z-20 top-0 left-0 font-inter-medium sm:px-4 md:py-9 md:px-0 dark:bg-gray-900">
        <div className="container flex flex-wrap items-center mx-auto xl:justify-start">
          <div className="flex items-center md:pr-2">
            <a href="https://flowbite.com/">
              <Image
                src={Logo}
                className="w-[205px] h-[38.5px] mt-1"
                alt="canopas-logo"
              />
            </a>
          </div>
          <div className="flex grow items-center">
            <ul className="flex flex-row flex-wrap items-center justify-start mb-2.5 my-0 p-0 md:ml-auto">
              <li className="my-2 font-normal sm:mr-auto md:text-[19px] md:font-medium ">
                <Link
                  href="/"
                  className={
                    router.pathname == "/"
                      ? "mr-4 pb-[5.5px] relative lg:mr-11 bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-transparent bg-clip-text after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] dark:text-white"
                      : "mr-4 lg:mr-11 text-[#000000de] hover:pb-[5.5px] hover:relative hover:after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1.5px] hover:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:text-transparent hover:bg-clip-text dark:text-white"
                  }
                >
                  Home
                </Link>
              </li>
              <li className="my-2 font-normal md:text-[19px] md:font-medium sm:mx-auto ">
                <Link
                  href="https://canopas.com/jobs"
                  className={
                    router.pathname == "https://canopas.com/jobs"
                      ? "mr-4 pb-[5.5px] relative lg:mr-11 bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-transparent bg-clip-text after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] dark:text-white"
                      : "mr-4 lg:mr-11 text-[#000000de] hover:pb-[5.5px] hover:relative hover:after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1.5px] hover:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:text-transparent hover:bg-clip-text dark:text-white"
                  }
                >
                  Career
                </Link>
              </li>
              <li className="my-2 font-normal md:text-[19px] md:font-medium sm:mx-auto">
                <Link
                  href="/categories"
                  className={
                    router.pathname == "/404"
                      ? "mr-4 pb-[5.5px] relative lg:mr-11 bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-transparent bg-clip-text after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] dark:text-white"
                      : "mr-4 lg:mr-11 text-[#000000de] hover:pb-[5.5px] hover:relative hover:after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1.5px] hover:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:text-transparent hover:bg-clip-text dark:text-white"
                  }
                >
                  Categories
                </Link>
              </li>
              <li className="my-2 font-normal md:text-[19px] md:font-medium sm:mx-auto">
                <Link
                  href="/authors"
                  className={
                    router.pathname == "/404"
                      ? "mr-4 pb-[5.5px] relative lg:mr-11 bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-transparent bg-clip-text after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] dark:text-white"
                      : "mr-4 lg:mr-11 text-[#000000de] hover:pb-[5.5px] hover:relative hover:after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1.5px] hover:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] hover:text-transparent hover:bg-clip-text dark:text-white"
                  }
                >
                  Authors
                </Link>
              </li>
              <li className="my-2 font-normal md:text-[19px] md:font-medium sm:ml-auto">
                <Link
                  href="https://canopas.com/contact"
                  className={
                    router.pathname == "https://canopas.com/contact"
                      ? "pb-[5.5px] relative bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-transparent bg-clip-text lg:font-semibold lg:text-white lg:rounded-[29px] lg:px-6 lg:py-4 lg:text-center lg:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] lg:text-transparent lg:bg-clip-text after:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] dark:text-white"
                      : "lg:font-semibold lg:text-white lg:rounded-[29px] lg:px-6 lg:py-5 lg:text-center lg:bg-gradient-to-r from-[#F2709C] via-[#f87881ed] to-[#FF835B] text-[#000000de] dark:text-white"
                  }
                >
                  Get Free Consultaion
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
