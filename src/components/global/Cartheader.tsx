import Image from "next/image";
import { useBranch } from "../../contexts";

const branchData = [
  {
    name: "Tools YGN",
    title: "U Than Ohn & Sons (YGN Tools Shop)",
    address: "No.105,Shwedagon Pagoda Rd.\nLatha Township,Yangon",
    contacts: "(+951)204021,95-1-378956,378928",
    link: "#",
    imageSrc: "/images/uto-logo.png",
    color: "text-red-500",
  },
  {
    name: "Tools MDY",
    title: "U Than Ohn & Sons (MDY Tools Shop)",
    address: "No.269,32 Street, between 83rd x 84th Street.\nMandalay",
    contacts: "09263334837, 09789193965, 09976765101",
    link: "#",
    imageSrc: "/images/uto-logo.png",
    color: "text-red-500",
  },
  {
    name: "Medical YGN",
    title: "U Than Ohn & Sons (YGN Medical Shop)",
    address: "No.20, Loatthar St.\nThingangyun Township,Yangon",
    contacts: "(+951)8565902,09779098501, 09779098502,09895171732, 09887805906",
    link: "#",
    imageSrc: "/images/uto-medical.png",
    color: "text-blue-500",
  },
  {
    name: "Medical MDY",
    title: "U Than Ohn & Sons (MDY Medical Shop)",
    address:
      "No. (24/A), 22nd Street, Between 81st x 82nd Street\nMandalay, Myanmar",
    contacts: "(+952)4064097, 4033735, 09404045377, 09974464559",
    link: "#",
    imageSrc: "/images/uto-medical.png",
    color: "text-blue-500",
  },
  {
    name: "GetWell YGN",
    title: "Get Well Instruments (YGN Medical)",
    address:
      "No. 50/51,Zaya Theikdi Street,48 Ward,North Dagon Township,Yangon",
    contacts: "09772457754, 09772457774",
    imageSrc: "/images/getwell.png",
    color: "text-orange-500",
  },
  {
    name: "GetWell MDY",
    title: "Get Well Instruments (MDY Medical)",
    address:
      "No. ( 24/A ), 22 nd Street, Between 81 st x 82 nd Street,Mandalay, Myanmar",
    contacts: "(+952) 4064097 , 4033735, 09-404045377, 09974464559",
    imageSrc: "/images/getwell.png",
    color: "text-orange-500",
  },
];

export const Cartheader = () => {
  const { branchName } = useBranch();

  const renderedContent = branchData.find(
    (branch) => branch.name === branchName
  );

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1
            className={`mb-3 text-2xl font-semibold ${
              renderedContent?.color || ""
            }`}
          >
            {renderedContent?.title}
          </h1>
          <div className="text-sm font-semibold leading-7">
            <p className="">{renderedContent?.address}</p>
            <p>{renderedContent?.contacts}</p>
            {renderedContent?.link && (
              <a href={renderedContent.link} className="underline">
                www.utotools.com
              </a>
            )}
          </div>
        </div>
        <div className="block">
          <Image
            src={renderedContent?.imageSrc || "/fallback-image.png"}
            className="object-cover"
            width={150}
            height={150}
            alt=""
          />
        </div>
      </div>
    </>
  );
};
