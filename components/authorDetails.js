import Image from "next/image";

export default function AuthorDetails({ postData }) {
  return (
    <div className="w-full mt-16 bg-[#f7f7f7] py-0.5 text-[#374151]">
      <div className="sm:hidden container mx-5">
        <hr className="bg-gray-600 w-full py-[0.7px] !mt-2 mb-0" />
        <div className="flex flex-col items-center my-5">
          <div className="relative w-48 h-40 mx-auto">
            <Image
              width={150}
              height={100}
              className="absolute inset-x-5 !my-0 rounded-full object-cover"
              src={postData.authorImage}
              alt={postData.authorAltText}
            />
          </div>
          <div className="flex flex-col space-y-3 items-center">
            <div className="text-[1.7rem] font-product-black tracking-wide text-[#000000d6]">
              {postData.authorName}
            </div>
            {postData.authorBio ? (
              <>
                <div className="text-[1rem] leading-snug tracking-wide text-center">
                  {postData.authorBio}
                </div>
                <div className="!mt-7 text-[0.9rem] capitalize">
                  {postData.authorRole}
                </div>
              </>
            ) : (
              <div className="text-[0.9rem] capitalize">
                {postData.authorRole}
              </div>
            )}
          </div>
        </div>
        <hr className="bg-gray-600 w-full py-[0.5px] !mb-3 mt-0" />
      </div>
      <div className="hidden sm:block container mx-5">
        <hr className="bg-gray-600 w-full py-px !my-3" />
        <div className="grid grid-cols-3 items-center">
          <div className="relative w-48 h-48">
            <Image
              width={100}
              height={100}
              className="absolute lg:left-4 top-2 rounded-full object-cover"
              src={postData.authorImage}
              alt={postData.authorAltText}
            />
          </div>
          <div
            className={`sm:col-span-2 flex flex-col ${
              postData.authorBio ? "space-y-4" : "space-y-1"
            } md:-ml-16 xl:-ml-10 2xl:-ml-16`}
          >
            <div className="text-[1.7rem] font-product-black tracking-wide text-[#000000d6]">
              {postData.authorName}
            </div>
            {postData.authorBio ? (
              <div className="text-[1rem] leading-snug tracking-wide">
                {postData.authorBio}
              </div>
            ) : (
              ""
            )}
            <div className="text-[0.9rem] capitalize">
              {postData.authorRole}
            </div>
          </div>
        </div>
        <hr className="bg-gray-600 w-full py-px !my-3" />
      </div>
    </div>
  );
}
