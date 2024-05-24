import { UserButton } from "@clerk/clerk-react";
import Logo from "./Logo";
import { CirclePlus } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex w-full sm:py-2 py-1 sm:px-8 justify-between shadow-md">
      <Logo />
      <div className="flex">
        <button className="inline-flex items-center justify-center whitespace-nowrap gap-x-2  rounded-md sm:px-4 px-2 py-2 mt-2 sm:mr-8 mr-2  hover:bg-neutral-100 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          <CirclePlus />
          <span className="max-sm:hidden">
          Upload PDF
          </span>
        </button>
        <UserButton/>
      </div>
    </div>
  );
};

export default Navbar;