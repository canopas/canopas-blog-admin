import Image from "next/image";
import Logo from "../../assets/images/logo-header.svg";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <>
      <nav className="relative mt-4 md:mt-7 w-full z-[1] bg-white py-2.5 px-[2%] md:py-5 md:px-0 font-product-sans">
        <div className="container flex flex-col flex-wrap md:flex-row md:flex-nowrap justify-start">
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
              <li className="my-2 ml-0 sm:my-0 p-0">
                <Link
                  href="/"
                  className={
                    router.pathname == "/"
                      ? "relative mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900"
                      : "mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] hover:relative hover:after:absolute hover:after:top-[29px] hover:after:md:top-[24px] hover:after:bottom-0 hover:after:left-0 hover:after:w-2/4 hover:after:h-[2px] hover:after:bg-black-900 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Home
                </Link>
              </li>

              <li className="my-2 ml-0 sm:my-0 p-0">
                <Link
                  href="https://canopas.com/jobs"
                  className={
                    router.pathname == "https://canopas.com/jobs"
                      ? "relative mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900"
                      : "mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] hover:relative hover:after:absolute hover:after:top-[29px] hover:after:md:top-[24px] hover:after:bottom-0 hover:after:left-0 hover:after:w-2/4 hover:after:h-[2px] hover:after:bg-black-900 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Career
                </Link>
              </li>

              <li className="my-2 ml-0 sm:my-0 p-0">
                <Link
                  href="https://canopas.com/portfolio"
                  className={
                    router.pathname == "https://canopas.com/portfolio"
                      ? "relative mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:bg-black-900"
                      : "mr-[20px] sm:mr-[40px] text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] hover:relative hover:after:absolute hover:after:top-[29px] hover:after:md:top-[24px] hover:after:bottom-0 hover:after:left-0 hover:after:w-2/4 hover:after:h-[2px] hover:after:bg-black-900 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Portfolio
                </Link>
              </li>

              <li className="my-2 ml-0 sm:my-0 p-0">
                <Link
                  href="https://canopas.com/contact"
                  className={
                    router.pathname == "https://canopas.com/contact"
                      ? "relative lg:rounded-full lg:border border-1 border-black-900 lg:bg-white lg:shadow-[0_4px_4px_rgba(0,0,0,0.5)] lg:py-2.5 lg:px-6 text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] lg:text-black-900 hover:lg:border hover:lg:border-1 hover:border-black-900 hover:bg-white hover:text-black-900 after:absolute after:top-[29px] after:md:top-[24px] after:bottom-0 after:left-0 after:w-2/4 after:h-[2px] after:lg:h-[0px] after:bg-black-900"
                      : "rounded-full lg:border border-1 border-black-900 lg:bg-black-900 lg:shadow-[0_4px_4px_rgba(0,0,0,0.5)] lg:py-2.5 lg:px-6 text-[1rem] font-normal leading-[1.125rem] tracking-[1px] md:text-[1.0625rem] md:leading-[1.5rem] lg:text-[1.125rem] lg:leading-[1.875rem] lg:text-white hover:relative hover:lg:border hover:lg:border-1 hover:border-black-900 hover:bg-white hover:text-black-900 hover:after:absolute hover:after:top-[29px] hover:after:md:top-[24px] hover:after:bottom-0 hover:after:left-0 hover:after:w-2/4 hover:after:h-[2px] hover:after:bg-black-900 after:origin-bottom-left after:duration-300 after:scale-x-0 hover:after:lg:h-[0px] hover:after:scale-x-100 hover:after:origin-bottom-left"
                  }
                >
                  Let&apos;s talk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
