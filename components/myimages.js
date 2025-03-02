"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Image from "next/image";

const MyImages = ({ username }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    // Handle responsive column count
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(2);
      } else if (window.innerWidth < 1024) {
        setColumns(3);
      } else if (window.innerWidth < 1280) {
        setColumns(4);
      } else {
        setColumns(5);
      }
    };

    // Initial column count
    handleResize();

    // Set up event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (username) fetchUserImages();
  }, [username]);

  async function fetchUserImages() {
    try {
      setLoading(true);
      const q = query(collection(db, "userImages", "images", username));
      const querySnapshot = await getDocs(q);
      const fetchedImages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load your images");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteImage(imageId) {
    try {
      const image = images.find((img) => img.id === imageId);
      if (image.isPublic) {
        const globalQuery = query(
          collection(db, "globalImages"),
          where("userImageId", "==", imageId),
          where("username", "==", username)
        );
        const globalSnapshot = await getDocs(globalQuery);
        globalSnapshot.forEach(async (globalDoc) => {
          await deleteDoc(doc(db, "globalImages", globalDoc.id));
        });
      }

      await deleteDoc(doc(db, "userImages", "images", username, imageId));
      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  }

  async function handleTogglePublic(imageId, currentIsPublic) {
    try {
      const newIsPublic = !currentIsPublic;
      const imageRef = doc(db, "userImages", "images", username, imageId);
      await updateDoc(imageRef, { isPublic: newIsPublic });

      if (newIsPublic) {
        const image = images.find((img) => img.id === imageId);
        await addDoc(collection(db, "globalImages"), {
          title: image.title,
          imageUrl: image.imageUrl,
          username,
          userImageId: imageId,
        });
      } else {
        const globalQuery = query(
          collection(db, "globalImages"),
          where("userImageId", "==", imageId),
          where("username", "==", username)
        );
        const globalSnapshot = await getDocs(globalQuery);
        globalSnapshot.forEach(async (globalDoc) => {
          await deleteDoc(doc(db, "globalImages", globalDoc.id));
        });
      }

      setImages(
        images.map((img) =>
          img.id === imageId ? { ...img, isPublic: newIsPublic } : img
        )
      );
      toast.success(`Image is now ${newIsPublic ? "public" : "private"}`);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No images yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload your first image to get started
        </p>
      </div>
    );
  }

  // Create column arrays for masonry layout
  const createMasonryLayout = () => {
    const columnArrays = Array.from({ length: columns }, () => []);

    // Distribute images across columns
    images.forEach((image, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(image);
    });

    return columnArrays;
  };

  const masonryColumns = createMasonryLayout();

  return (
    <div className="flex gap-4 px-4">
      {masonryColumns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1 flex flex-col gap-4">
          {column.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg"
            >
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={image.title || "User image"}
                width={500}
                height={500}
                className="w-full object-cover transition-transform transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="absolute top-2 right-2">
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-white hover:bg-gray-200 transition-all duration-100 ease-in"
                  >
                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                  </Button>
                </div>

                {/* Bottom Content */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-white gap-2 mt-auto">
                  <div className="truncate max-w-full sm:max-w-[50%]">
                    <h3 className="font-medium text-sm truncate">
                      {image.title || "Untitled"}
                    </h3>
                    <span className="text-xs">
                      {new Date(
                        image.createdAt?.seconds * 1000
                      ).toLocaleDateString() || "No date"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Switch
                      checked={image.isPublic}
                      onCheckedChange={() =>
                        handleTogglePublic(image.id, image.isPublic)
                      }
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label className="text-xs">Public</Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyImages;
