import Image from "next/image";
import loader from "./../assets/images/loader.svg";

export default function Loader() {
  return (
    <div className="flex justify-center">
      <Image src={loader} height={180} width={180} alt="loader" />
    </div>
  );
}
