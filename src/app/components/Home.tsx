import HomeImage from "../../../public/images/home_image.png"
import OrangeButton from "../styles/orangeButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[90vh] w-full">
      <div className="flex flex-col text-left text-lg items-start w-1/2 py-8 pl-24 gap-4 mt-32">
        <p className="montserrat text-6xl font-bold">Unlock Potential, Not Wallets</p>
        <p>Join a vibrant community where knowledge is currency. Learn, share, and grow — together.</p>
        <OrangeButton 
          style={{ padding: "20px 80px 20px 80px", marginTop: "2rem" }}
          >
            Get Started
        </OrangeButton>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <img 
          src={HomeImage.src}
          alt="blob"
          className="w-[43rem] mt-8"
        />
      </div>

    </div>
  );
}
