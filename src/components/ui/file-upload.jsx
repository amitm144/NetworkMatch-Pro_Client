import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

// Utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (onChange) onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.error(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300">
            Upload file
          </p>
          <p className="relative z-20 font-sans text-neutral-400 dark:text-neutral-400 mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <motion.div
                  key={idx}
                  layoutId={`file-upload-${idx}`}
                  className={cn(
                    "relative bg-white dark:bg-neutral-900 flex flex-col p-4 mt-4 rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p className="text-base text-neutral-700 dark:text-neutral-300 truncate">
                      {file.name}
                    </motion.p>
                    <motion.p className="rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                  <div className="flex text-sm justify-between mt-2 text-neutral-600 dark:text-neutral-400">
                    <motion.p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                      {file.type}
                    </motion.p>
                    <motion.p>
                      Modified {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p className="text-neutral-600 flex flex-col items-center">
                    Drop it
                    <IconUpload className="h-4 w-4" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const GridPattern = () => {
  const columns = 41;
  const rows = 11;

  return (
    <div className="flex flex-wrap gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: columns }).map((_, col) => (
          <div
            key={`${col}-${row}`}
            className={`w-10 h-10 rounded-[2px] ${
              (row * columns + col) % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 dark:bg-neutral-950 shadow-inner"
            }`}
          />
        ))
      )}
    </div>
  );
};
