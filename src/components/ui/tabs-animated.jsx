// src/components/ui/animated-tabs.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}) => {
  const [activeTab, setActiveTab] = useState(propTabs[0]);
  const [hovering, setHovering] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center gap-2 [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              "relative rounded-lg transition-all duration-300 ease-in-out",
              tabClassName,
              activeTab.value === tab.value ? "bg-zinc-200 shadow-sm font-extrabold text-md" : "font-normal"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {activeTab.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 rounded-lg",
                  activeTabClassName
                )}
              />
            )}
            <span className={cn(
              "relative block",
              activeTab.value === tab.value ? "text-lg font-extrabold" : "text-base font-normal"
            )}>
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={propTabs}
        activeTab={activeTab}

        className={cn("mt-4 ", contentClassName)}
      />
    </>
  );
};

const FadeInDiv = ({ className, tabs, activeTab, hovering }) => {
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: tab.value === activeTab.value ? 1 : 0.95 - idx * 0.05,
            top: hovering ? idx * -30 : 0,
            zIndex: tab.value === activeTab.value ? 1 : -idx,
            opacity: tab.value === activeTab.value ? 1 : idx < 2 ? 0.7 - idx * 0.2 : 0,
          }}
          animate={{
            y: tab.value === activeTab.value ? [0, 20, 0] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={cn(
            "w-full h-full absolute top-0 left-0 transition-all duration-300 overflow-hidden",
            className
          )}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};