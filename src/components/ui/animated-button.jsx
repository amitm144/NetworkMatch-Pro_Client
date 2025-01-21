import { Button } from "./button";
import { cn } from "@/lib/utils";


const AnimatedButton = ({ text, url, icon, className = "" }) => {
  return (
    <Button
    variant="blank"
      className={cn(
        "bg-blue-500 text-white text-sm font-medium flex justify-center group relative overflow-hidden px-6 py-3 rounded-full",
        className
      )}
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <span className="group-hover:translate-x-40 text-center transition duration-500">
          {text}
        </span>
        <div className="-translate-x-40 text-xl group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          {icon}
        </div>
      </a>
    </Button>
  );
};
export { AnimatedButton }
