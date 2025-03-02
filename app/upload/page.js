"use client";

import ImageUploadForm from "@/components/image-upload-form";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const UploadPage = () => {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <section className="mb-12 text-center">
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-black">
            Preserve Your Precious Memories
          </h1>
          <p className="mt-4 text-sm lg:text-md text-gray-600 max-w-2xl mx-auto">
            Upload your most cherished moments and keep them alive forever. Add
            a title and description, and choose whether to share them with the
            world or keep them private.
          </p>
        </section>

        {/* User Greeting */}
        {user && (
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-500">
              Sharing memories as{" "}
              <span className="font-medium text-purple-600">
                {user.username}
              </span>
            </p>
          </div>
        )}

        {/* Upload Form */}
        <section className="flex justify-center">
          <div className="w-full max-w-lg">
            <ImageUploadForm
              username={user?.username}
              setIsUploading={setIsUploading}
              isUploading={isUploading}
            />
          </div>
        </section>

        {/* Additional Info */}
        <section className="mt-12 text-center text-gray-500 text-xs lg:text-sm">
          <p>
            Your memories are stored securely. Public memories will appear in
            the shared gallery.
          </p>
        </section>
      </div>
    </div>
  );
};

export default UploadPage;
