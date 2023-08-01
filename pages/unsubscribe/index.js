import Image from "next/image";
import axios from "axios";
import config from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import emailTemplate from "../../assets/images/emailTemplate.webp";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Unsubscribe() {
  const [alerts, setAlerts] = useState(false);
  const [email, setEmail] = useState("");

  if (alerts) {
    setTimeout(() => {
      setAlerts(false);
      window.location.replace(config.WEBSITE_URL + "/resources");
    }, 2000);
  }

  const userUnsubscribe = async (e) => {
    if (e.target.innerHTML == "yes") {
      if (email) {
        await axios
          .put(`${config.STRAPI_URL}/v1/user/unSubscribeUser?email=${email}`)
          .then(() => {
            setAlerts(true);
          });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (
      localStorage.getItem("userEmail") === null ||
      localStorage.getItem("userEmail") != email
    ) {
      if (email) {
        localStorage.setItem("userEmail", email);
      }
    }
    setEmail(localStorage.getItem("userEmail"));

    setTimeout(() => {
      const newUrl = window.location.pathname;
      window.history.replaceState(null, null, newUrl);
    }, 100);
  }, []);

  return (
    <>
      <div className="container w-[90%] sm:w-[70%] lg:w-[50%] 2xl:w-[40%] h-fit-content min-h-[50vh] my-16 rounded-[12px] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-6">
        <div className="text-center">
          <h1 className="mb-3 text-3xl">Unsubscribe</h1>
          <hr />
          <p className="my-3">{email}</p>
          <div className="w-[50%] h-auto mx-[24%]">
            <Image
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover inset-0"
              src={emailTemplate}
              alt="email"
            />
          </div>

          <p className="mb-4 text-base text-neutral-600">
            are you sure you wish to unsubscribe from Canopas blog?
          </p>
          <div className="flex justify-center space-x-3 ">
            <button className="w-auto rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] text-[1.1rem] font-semibold text-white hover:shadow-[inset_2px_1000px_1px_#fff] hover:cursor-pointer">
              <div
                className="px-[1.35rem] py-[0.3rem] align-middle text-center tracking-wider hoverable-text capitalize"
                onClick={userUnsubscribe}
              >
                yes
              </div>
            </button>
            <Link
              href={config.WEBSITE_URL + "/resources"}
              onClick={handleLogout}
            >
              <button className="w-auto rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] text-[1.1rem] font-semibold text-white hover:shadow-[inset_2px_1000px_1px_#fff] hover:cursor-pointer">
                <div className="px-[1.35rem] py-[0.3rem] align-middle text-center tracking-wider hoverable-text capitalize">
                  no
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {alerts ? (
        <div className="absolute bottom-10 flex flex-rows inset-x-[5%] sm:inset-x-[20%] md:inset-x-[25%] xl:inset-x-[30%] justify-between items-center w-[90%] sm:w-7/12 md:w-6/12 xl:w-5/12 z-10 rounded-[10px] bg-gradient-to-r from-[#f2709c] to-[#ff9472] py-5 text-white">
          <p className="mx-7 tracking-wider md:text-xl font-medium">
            Unsubscribe Successfully!
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            className="w-5 h-5 mr-5 hover:cursor-pointer"
            onClick={() => {
              setAlerts(false);
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
