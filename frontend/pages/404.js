import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import firstErrorLetter from "../assets/images/404page_4_1.svg";
import middleErrorLetter from "../assets/images/icon.svg";
import lastErrorLetter from "../assets/images/404page_4_2.svg";

export default function Custom404() {
  return (
    <>
      <div className="container flex items-center justify-center flex-col my-0 mx-auto py-60 px-[5%] min-h-[50vh]">
        <div className="flex flex-row my-auto mx-auto text-center">
          <Image src={firstErrorLetter} className="h-24" alt="404" />
          <Image
            src={middleErrorLetter}
            className="mx-4 w-[6.5rem]"
            alt="404"
          />
          <Image className="h-24" src={lastErrorLetter} alt="404" />
        </div>
        <div className="mt-[2rem] text-center text-[1.4rem] leading-8">
          The page you’re looking for was moved, renamed or might never existed.
        </div>
        <div className="hover:text-[#fff]">
          <Link
            className="gradient-border-btn hover:text-[#fff] rounded-[0.6rem] p-[1rem] m-[5px] text-center border-[1px] border-solid border-transparent from-[#ff9472] via-[#ff909c] to-[#f2709c] bg-gradient-to-r shadow-[inset_2px_1000px_1px_#fff] active:scale-[0.98]  my-16 flex flex-row items-center"
            href="/"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-6 h-6 fa text-[#f2709c] text-[2.1rem] mr-[5px] "
              id="leftArrow"
            />
            <span className="text-center font-bold text-[1.1rem] my-0 mx-[6px] text-[#3d3d3d]  ">
              Back to Home page
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
