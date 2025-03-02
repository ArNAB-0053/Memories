import Link from "next/link";
import { Oswald, Poppins } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: "700" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return (
    <Link href="/" className="flex flex-col items-start">
      <div className={`${oswald.className} text-xl font-extrabold text-black tracking-tight flex items-center justify-start gap-x-2`}>
        Memories
        <span className="bg-black h-2 w-2 rounded-full translate-y-[0.2rem]"></span>
      </div>

      <span className={`${poppins.className} text-xs text-gray-600 tracking-tighter`}>
        Capture. Cherish. Share.
      </span>
    </Link>
  );
};

export default Logo;
