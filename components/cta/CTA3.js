import React, { useState, useEffect } from "react";
import Image from "next/image";
import loaderImage from "../../assets/images/small-loader.svg";
import { isValidEmail, isValidPhoneNumber } from "../../utils";
import { submitFormData } from "./api";

export default function CTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectInfo, setProjectInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNameValidationError, setShowNameValidationError] = useState(false);
  const [showEmailValidationError, setShowEmailValidationError] =
    useState(false);
  const [showValidEmailError, setShowValidEmailError] = useState(false);
  const [showProjectInfoValidationError, setShowProjectInfoValidationError] =
    useState(false);
  const [showPhoneNumberValidationError, setShowPhoneNumberValidationError] =
    useState(false);
  const [showValidPhoneNumberError, setShowValidPhoneNumberError] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Something went wrong on our side",
  );
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const validateForm = () => {
    setShowNameValidationError(name.trim().length === 0);
    setShowEmailValidationError(email.trim().length === 0);
    setShowProjectInfoValidationError(projectInfo.trim().length === 0);
    setShowPhoneNumberValidationError(phoneNumber.trim().length === 0);

    return (
      showNameValidationError ||
      showEmailValidationError ||
      showValidEmailError ||
      showProjectInfoValidationError ||
      showPhoneNumberValidationError ||
      showValidPhoneNumberError
    );
  };

  useEffect(() => {
    const myText = document.querySelector(".myTextarea");
    myText.style.minHeight = "100px";
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setShowLoader(true);
    }

    grecaptcha.enterprise.ready(() => {
      grecaptcha.enterprise
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
          action: "verify",
        })
        .then((token) => {
          if (!validateForm()) {
            let formData = {
              name: name,
              email: email,
              project_info: projectInfo
                ? projectInfo.replace(/\./g, ".\n")
                : "NA",
              phone_number: phoneNumber,
              token,
            };

            submitFormData(
              formData,
              resetForm,
              setShowLoader,
              setShowErrorMessage,
              setErrorMessage,
            );
          }
        })
        .catch(() => {
          setErrorMessage("Invalid recaptcha score");

          setShowErrorMessage(true);
          setTimeout(() => {
            setShowErrorMessage(false);
          }, 3000);
        });
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setProjectInfo("");
    setPhoneNumber("");
  };

  return (
    <>
      <hr className="md:hidden" />
      <div className="relative top-5 md:top-0.5 w-full h-auto">
        <div className="container flex flex-col md:flex-row md:space-x-6 lg:space-x-0 md:-mt-[60px] xl:px-20 3xl:px-32">
          <div className="mt-10 md:mt-40 basis-7/12 lg:basis-3/5">
            <div className="flex flex-col items-center md:items-stretch space-y-4 md:w-[16.2rem] lg:w-[20rem] 2xl:w-[22.23rem]">
              <div className="text-[1.2rem] lg:text-[1.5rem] 2xl:text-[1.75rem] leading-[1.75rem] lg:leading-[2rem] 2xl:leading-[2.3rem] font-poppins-regular">
                Talk to an expert
              </div>
              <div className="md:grid grid-rows-2 justify-items-stretch text-[2.3rem] sm:text-[3rem] lg:text-[3.4rem] lg:text-[3.7rem] 2xl:text-[4.125rem] font-poppins-medium uppercase">
                <span className="mr-3 md:mr-0">get in</span>
                <span className="md:justify-self-end">touch</span>
              </div>
              <div className="text-center md:text-left text-[0.9rem] lg:text-[1rem] 2xl:text-[1.25rem] leading-[1.25rem] lg:leading-[1.5rem] 2xl:leading-[1.75rem] font-poppins-regular">
                Our team is happy to answer your questions. Fill out the form
                and we’ll get back to you as soon as possible
              </div>
            </div>
          </div>
          <div className="relative top-14 lg:top-20 xl:top-[5.5rem] h-fit w-full bg-white cta-box-shadow text-center font-poppins-regular">
            <form onSubmit={submitForm} method="POST">
              <div className="pt-[3rem] md:pt-[5rem] lg:pt-[6rem] pb-10 lg:pb-14 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative md:col-span-2 md:mb-5 pt-3 lg:pt-10 text-left">
                    <input
                      type="text"
                      id="username"
                      className="block peer mb-2 mx-0 w-full rounded-none border-b border-black-900 bg-transparent px-0 transition ease-in-out appearance-none text-md md:text-lg lg:text-xl text-black-900 placeholder-white/[.6] focus:outline-none active:outline-none"
                      name="username"
                      required
                      autoComplete="given-username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="username"
                      className="absolute top-1 lg:top-[1.6rem] left-0 mb-5 z-[2] text-black-900/[.8] text-[1.07rem] leading-[1.1875rem] lg:text-[1.35rem] md:leading-[1.6875rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-black-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Name*
                    </label>
                    {showNameValidationError ? (
                      <span className="error gradient-text">
                        Name is required
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="relative md:mb-5 pt-3 lg:pt-9 text-left">
                    <input
                      className="block peer mb-2 mx-0 w-full rounded-none border-b border-black-900 bg-transparent px-0 transition ease-in-out appearance-none text-md md:text-lg lg:text-xl text-black-900 placeholder-white/[.6]  focus:outline-none active:outline-none"
                      type="text"
                      name="email"
                      id="email"
                      required
                      autoComplete="given-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => {
                        setShowValidEmailError(isValidEmail(email));
                      }}
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute top-1 lg:top-[1.6rem] left-0 mb-5 z-[2] text-black-900/[.8] text-[1.07rem] leading-[1.1875rem] lg:text-[1.35rem] md:leading-[1.6875rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-black-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email*
                    </label>
                    {showEmailValidationError ? (
                      <span className="error gradient-text">
                        Email is required
                      </span>
                    ) : (
                      ""
                    )}
                    {email.trim().length != 0 && showValidEmailError ? (
                      <span className="error gradient-text">
                        Please enter valid email address
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="relative md:mb-5 pt-3 lg:pt-9 text-left">
                    <input
                      type="text"
                      id="phonenumber"
                      className="block peer mb-2 mx-0 w-full rounded-none border-b border-black-900 bg-transparent px-0 transition ease-in-out appearance-none text-md md:text-lg lg:text-xl text-black-900 placeholder-white/[.6]  focus:outline-none active:outline-none"
                      name="phonenumber"
                      required
                      autoComplete="given-phonenumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={() => {
                        setShowValidPhoneNumberError(
                          isValidPhoneNumber(phoneNumber),
                        );
                      }}
                      placeholder=" "
                    />
                    <label
                      htmlFor="phonenumber"
                      className="absolute top-1 lg:top-[1.6rem] left-0 mb-5 z-[2] text-black-900/[.8] text-[1.07rem] leading-[1.1875rem] lg:text-[1.35rem] md:leading-[1.6875rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-black-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Phone number*
                    </label>
                    {showPhoneNumberValidationError ? (
                      <span className="error gradient-text">
                        Phone number is required
                      </span>
                    ) : (
                      ""
                    )}
                    {phoneNumber.trim().length != 0 &&
                    showValidPhoneNumberError ? (
                      <span className="error gradient-text">
                        Please enter valid Phone number
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="relative md:col-span-2 md:mb-5 pt-3 lg:pt-10 text-left">
                    <textarea
                      className="block peer mb-2 mx-0 w-full rounded-none border-b border-black-900 bg-transparent px-0 transition ease-in-out appearance-none text-md md:text-lg lg:text-xl text-black-900 placeholder-white/[.6]  focus:outline-none active:outline-none myTextarea"
                      id="project"
                      name="project"
                      rows="3"
                      required
                      autoComplete="given-project-info"
                      onChange={(e) => setProjectInfo(e.target.value)}
                      value={projectInfo}
                      placeholder=" "
                    ></textarea>
                    <label
                      htmlFor="project"
                      className="absolute top-1 lg:top-[1.6rem] left-0 mb-5 z-[2] text-black-900/[.8] text-[1.07rem] leading-[1.1875rem] lg:text-[1.35rem] md:leading-[1.6875rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-black-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Project detail*
                    </label>
                    {showProjectInfoValidationError ? (
                      <span className="error gradient-text">
                        This field is required
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="flex mt-6 lg:mt-10">
                  {showLoader ? (
                    <Image
                      src={loaderImage}
                      className="w-[64px] h-[64px]"
                      alt="loader-image"
                    />
                  ) : (
                    <div className="relative">
                      {showErrorMessage ? (
                        <div className="absolute -top-[2rem] sm:-top-[1.875rem] md:-top-[2.875rem] text-center -right-[4rem] sm:-right-[11rem] md:-right-[15rem] lg:-right-[18rem] xl:-right-[18rem] 2xl:-right-[20.5rem] w-[190%] sm:w-max">
                          <span
                            className={`flex text-center gradient-text ${
                              errorMessage === "Invalid Recaptcha score"
                                ? "sm:!mr-[7rem] md:!mr-[12rem] lg:!mr-[15rem] xl:!mr-[16rem] 2xl:!mr-[17rem] !text-[1.5rem]"
                                : ""
                            }`}
                          >
                            {errorMessage}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      <button
                        id="submit"
                        className="border-[2px] border-solid border-transparent bg-black-900 text-white hover:border-black-900 hover:bg-white hover:text-black-900 font-inter-bold"
                      >
                        <span className="py-[0.6rem] px-[1rem] lg:px-[1.8rem] lg:py-[0.8rem] text-[1rem] lg:text-[1.1875rem] inline-block">
                          Get Free Consultation
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-black-900 w-full h-[84px] md:h-[70px] lg:h-[83px] xl:h-[94px]"></div>
      </div>
    </>
  );
}
