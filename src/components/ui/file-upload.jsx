import React, { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function FileUpload({ onChange, accept = ".csv" }) {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    if (onChange) onChange(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`
        relative
        w-full 
        rounded-lg 
        border-2 
        border-dashed 
        transition-all 
        duration-200
        min-h-[200px]
        flex 
        items-center 
        justify-center
        cursor-pointer
        group
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        }
      `}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="p-6 flex items-center gap-4 relative">
          <File className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800"
          >
            <X className="h-4 w-4 text-red-500 dark:text-red-400" />
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-center p-6">
          <h1 className="text-2xl text-gray-900 font font-bold dark:text-gray-500">
            Upload Your Connection CSV</h1>
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop your file here"}
            </p>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
              or click to browse
            </p>
          </div>
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Upload
              className={`
              h-6 
              w-6 
              ${
                isDragActive
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }
            `}
            />
          </div>
          <p className="text-md text-gray-400 dark:text-gray-500">
            Only CSV files are supported
          </p>
        </div>
      )}
    </div>
  );
}
