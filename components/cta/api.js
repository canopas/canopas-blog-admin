import axios from "axios";
import config from "../../config";

export function submitFormData(
  formData,
  resetForm,
  setShowLoader,
  setShowErrorMessage,
  setErrorMessage
) {
  axios
    .post(config.API_BASE + "/api/send-contact-mail", formData)
    .then(() => {
      window.location.href = config.CANOPAS_URL + "/thank-you";
      localStorage.setItem("client-name", JSON.stringify(formData.name));
      resetForm();
    })
    .catch((err) => {
      if (err.response.status === 401) {
        setErrorMessage("Invalid recaptcha score");

        setShowErrorMessage(true);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 3000);
      }
    })
    .finally(() => {
      setShowLoader(false);
    });
}
