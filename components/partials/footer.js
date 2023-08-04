import React, { useState } from "react";
import Image from "next/image";
import bg from "../../assets/images/footer/new-bg.svg";
import Link from "next/link";
import axios from "axios";
import config from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faMediumM,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faBell, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import { isValidEmail } from "../../utils";

export default function Footer({ mixpanel }) {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState(false);
  const [showValidEmailError, setShowValidEmailError] = useState(false);

  if (alerts) {
    setTimeout(() => {
      setAlerts(false);
    }, 2000);
  }

  const handleIconClick = (icon) => {
    mixpanel.track(icon);
  };

  const handleSubscription = async (event) => {
    event.preventDefault();

    if (!showValidEmailError) {
      await axios
        .post(`${config.STRAPI_URL}/v1/user/subscribeUser?populate=deep`, {
          email,
        })
        .then(() => {
          setAlerts(true);
        })
        .catch((err) => {
          console.log("Error:", err);
        });

      setEmail("");
    }
  };
  return (
    <>
      <div className="relative overflow-hidden px-0 font-inter-medium z-[1] footer-section">
        <Image
          height={200}
          width={200}
          className="absolute top-[15px] sm:top-0 left-0 w-full h-full xl2:h-[unset] -z-[1] object-cover xl2:object-fill"
          src={bg}
          alt="canopas-footer"
        />
        <div className="container lg:px-20 2xl:px-32">
          <div className="grid grid-rows-2 xl:grid-rows-none xl:grid-cols-2 justify-items-stretch mt-7 md:mt-11 mb-8 md:mb-12 xl:mb-[60px]">
            <div className="max-h-1 justify-self-center xl:justify-self-end xl:order-last">
              <div className="mt-5 text-[1.375rem] leading-[1.6875rem] md:text-[1.5rem] md:leading-[1.8125rem] lg:text-[1.75rem] lg:leading-[1.9375rem] text-white/[.87] font-inter-bold">
                Subscribe Here!
              </div>
              <form
                className="flex flex-row space-x-2 m-auto mt-[1.5rem] xl:mt-8 items-center"
                onSubmit={handleSubscription}
              >
                <div className="w-56 md:w-72">
                  <input
                    className="w-full rounded-full border border-white bg-transparent py-2 md:py-3 pl-3 text-white floating-input focus:outline-none"
                    placeholder="Enter Your E-mail"
                    id="subscribeEmail"
                    type="email"
                    value={email}
                    onBlur={() => {
                      setShowValidEmailError(isValidEmail(email));
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button className="hidden md:block rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-white">
                  <div className="py-[0.63rem] px-[0.5rem] md:px-[1.1rem] text-md md:text-xl hoverable-text inline-block">
                    Subscribe
                  </div>
                </button>
                <button
                  className="md:hidden w-[45px] h-[45px] rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff]"
                  aria-label="SubscribeBtn"
                >
                  <div className="w-[21px] h-[21px] inline-block">
                    <FontAwesomeIcon
                      icon={faBell}
                      className="fab footer-icon w-full h-full hoverable-text mt-0.5"
                    />
                  </div>
                </button>
              </form>
              {email.trim().length != 0 && showValidEmailError ? (
                <span className="error gradient-text">
                  Please enter valid email address
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="justify-self-center xl:justify-self-start">
              <div className="mt-8 xl:mt-5 text-[1.375rem] leading-[1.6875rem] md:text-[1.5rem] md:leading-[1.8125rem] lg:text-[1.75rem] lg:leading-[1.9375rem] text-white/[.87] font-inter-bold">
                Follow us on
              </div>
              <ul className="flex flex-wrap justify-center w-full m-auto mt-[1.5rem] xl:mt-8 pl-0 cursor-pointer list-none">
                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mr-1 md:mr-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.FACEBOOK_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_facebook");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>

                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mx-1 md:mx-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.INSTAGRAM_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_instagram");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>

                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mx-1 md:mx-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.TWITTER_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_twitter");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faTwitter}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>

                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mx-1 md:mx-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.BLOG_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_medium");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faMediumM}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>

                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mx-1 md:mx-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.LINKEDIN_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_linkedin");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>

                <li className="flex justify-center !items-center w-10 h-10 md:w-[62px] md:h-[62px] mx-1 md:mx-1.5 !rounded-full text-center cursor-pointer gradient-border-btn !border-0">
                  <Link
                    href={config.YOUTUBE_URL}
                    target="_blank"
                    onClick={() => {
                      handleIconClick("tap_footer_youtube");
                    }}
                    aria-label="footerLink"
                    className="w-5 h-5 md:w-8 md:h-8"
                  >
                    <FontAwesomeIcon
                      icon={faYoutube}
                      className="fab footer-icon w-5 h-5 md:w-8 md:h-8"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-8 md:mb-9 text-[0.75rem] leading-[0.9375rem] md:text-[0.84375rem] md:leading-[1.03125rem] lg:text-[0.9375rem] lg:leading-[1.125rem] text-white/[.87] text-center">
            <div className="w-3 h-3 md:w-4 md:h-4 mr-1 inline-block">
              <FontAwesomeIcon
                icon={faCopyright}
                className="w-full h-full mt-0.5"
              />
            </div>
            {new Date().getFullYear()} Canopas Software LLP. All rights
            reserved.
          </div>
          <svg width="0" height="0">
            <linearGradient id="lgrad" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop
                offset="-24.42%"
                style={{ stopColor: "#ff835b", stopOpacity: 1 }}
              />
              <stop
                offset="101.76%"
                style={{ stopColor: "#f2709c", stopOpacity: 1 }}
              />
            </linearGradient>
          </svg>
        </div>
        {alerts ? (
          <div
            className="fixed bottom-[5%] inset-x-[5%] sm:inset-x-[20%] xl:inset-x-[27%] flex flex-rows justify-between items-center w-[90%] sm:w-7/12 xl:w-5/12 z-[500] rounded-[10px] from-[#ff835b] to-[#f2709c] bg-gradient-to-r py-5 font-inter-semibold text-center text-white md:text-xl"
            role="alert"
          >
            <p className="block sm:inline mx-7">Subscribe Successfully!</p>
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
      </div>
    </>
  );
}
