"use client";

import { useState, useRef } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ImageUploadForm({ username, setIsUploading, isUploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedFile || !username) {
      toast.error("Please select a file and ensure you're signed in.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${username}/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // console.error("Upload failed:", error);
          toast.error("Upload failed: " + error.message);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save full image data to user-specific collection
          const userImageRef = await addDoc(collection(db, "userImages", "images", username), {
            username,
            title,
            description,
            isPublic,
            imageUrl: downloadURL,
            createdAt: serverTimestamp(),
          });

          // If public, add a reference to globalImages
          if (isPublic) {
            await addDoc(collection(db, "globalImages"), {
              title,
              imageUrl: downloadURL,
              username,
              userImageId: userImageRef.id, 
            });
          }

          toast.success("Image uploaded successfully!");
          resetForm();
        }
      );
    } catch (error) {
      // console.error("Upload error:", error);
      toast.error("An unexpected error occurred.");
      setIsUploading(false);
    }
  }

  function resetForm() {
    setSelectedFile(null);
    setPreview(null);
    setTitle("");
    setDescription("");
    setIsPublic(true);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {!preview ? (
          <div className="group relative flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors duration-200 ease-in-out">
            <Label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center space-y-2">
              <Upload className="h-10 w-10 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                <span className="underline">Click to browse</span>
              </p>
              <p className="text-xs text-gray-400">Supports JPG, PNG (max 10MB)</p>
            </Label>
            <input
              id="fileInput"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 rounded-full"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title"
                  className="mt-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Description <span className="text-gray-400">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this image..."
                  rows={4}
                  className="mt-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <Label htmlFor="public" className="text-sm font-medium text-gray-700">
                  Make this image public
                </Label>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-gray-800"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full  text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading {Math.round(uploadProgress)}%</span>
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}