import axios from "axios";
import config from "../../config";

export function submitFormData(
  formData,
  setShowSuccessMessage,
  resetForm,
  setShowLoader,
  setShowErrorMessage,
  setErrorMessage
) {
  axios
    .post(config.API_BASE + "/api/send-contact-mail", formData)
    .then(() => {
      setShowSuccessMessage(true);
      resetForm();

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
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
