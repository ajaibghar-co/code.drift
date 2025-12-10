import Image from "next/image";

export default function ComingSoon() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundColor: "#F4E1B8",
        backgroundImage: "url('/bg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "800px", // ← smaller tiles (you can tweak this)
      }}
    >
      <Image
        src="/comingSoon.gif"
        alt="Coming Soon"
        width={800}
        height={800}
        className="w-auto h-auto max-w-full"
        priority
      />
    </div>
  );
}
