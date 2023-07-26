import React, { useState, useEffect } from "react";
import Image from "next/image";
import bg400 from "../../assets/images/cta/second-cta-400.svg";
import bg2400 from "../../assets/images/cta/second-cta-2400.svg";
import loaderImage from "../../assets/images/small-loader.svg";
import { isValidEmail, isValidPhoneNumber } from "../../utils";
import { submitFormData } from "./api";

export default function CTA() {
  const width = 680;
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
    <div className="relative -bottom-5 sm:-bottom-2 overflow-hidden xl:mt-32 px-0 font-inter-medium z-[1]">
      <div className="absolute w-full h-[8%] sm:h-[6%] bg-white md:hidden"></div>
      {width < 600 ? (
        <Image
          src={bg400}
          className="absolute w-full -z-[1]"
          alt="canopas-contact-footer"
        />
      ) : (
        <Image
          src={bg2400}
          className="absolute top-0 left-0 w-full h-full xl2:h-[unset] -z-[1] object-cover xl2:object-fill"
          alt="canopas-contact-footer"
        />
      )}

      <div className="mt-20 sm:mt-14 text-center gradient-text text-3xl md:text-[3rem] md:leading-[3.625rem] lg:text-[4.0625rem] lg:leading-[4.9375rem] font-inter-bold">
        Say Hello!
      </div>
      <div className="container text-center">
        <div>
          <form onSubmit={submitForm} method="POST">
            <div className="py-5 px-8 lg:px-20 xl:px-44">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative md:col-span-2 md:mb-5 pt-3 lg:pt-10 text-left">
                  <input
                    type="text"
                    id="username"
                    className="block peer my-2 mx-0 w-full rounded-none border-b border-white/[.6] bg-transparent px-0 transition ease-in-out appearance-none text-lg md:text-xl lg:text-2xl text-white placeholder-white/[.6] floating-input focus:outline-none active:outline-none"
                    name="username"
                    required
                    autoComplete="given-username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                  />
                  <label
                    htmlFor="username"
                    className="absolute top-4 left-0 mb-5 z-[2] text-white/[.6] text-[1rem] leading-[1.1875rem] md:text-[1.375rem] md:leading-[1.6875rem] lg:text-[1.75rem] lg:leading-[2.125rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Your name
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
                    className="block peer my-2 mx-0 w-full rounded-none border-b border-white/[.6] bg-transparent px-0 transition ease-in-out appearance-none text-lg md:text-xl lg:text-2xl text-white placeholder-white/[.6] floating-input focus:outline-none active:outline-none"
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
                    className="absolute top-4 left-0 mb-5 z-[2] text-white/[.6] text-[1rem] leading-[1.1875rem] md:text-[1.375rem] md:leading-[1.6875rem] lg:text-[1.75rem] lg:leading-[2.125rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Your email
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
                    className="block peer my-2 mx-0 w-full rounded-none border-b border-white/[.6] bg-transparent px-0 transition ease-in-out appearance-none text-lg md:text-xl lg:text-2xl text-white placeholder-white/[.6] floating-input focus:outline-none active:outline-none"
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
                    className="absolute top-4 left-0 mb-5 z-[2] text-white/[.6] text-[1rem] leading-[1.1875rem] md:text-[1.375rem] md:leading-[1.6875rem] lg:text-[1.75rem] lg:leading-[2.125rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Phone number
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
                    className="block peer my-2 mx-0 w-full rounded-none border-b border-white/[.6] bg-transparent px-0 transition ease-in-out appearance-none text-lg md:text-xl lg:text-2xl text-white placeholder-white/[.6] floating-input focus:outline-none active:outline-none myTextarea"
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
                    className="absolute top-4 left-0 mb-5 z-[2] text-white/[.6] text-[1rem] leading-[1.1875rem] md:text-[1.375rem] md:leading-[1.6875rem] lg:text-[1.75rem] lg:leading-[2.125rem] transform -translate-y-4 origin-[0] scale-75 duration-300 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Project detail
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

              <div className="flex justify-center mt-10 md:mt-12">
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
                      className="relative justify-self-center rounded-full border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] text-white font-inter-bold"
                    >
                      <span className="py-[0.6rem] px-[1.8rem] md:py-[0.8rem] text-md lg:text-xl hoverable-text inline-block">
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
    </div>
  );
}
