"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function MasonryGrid() {
  const [images, setImages] = useState([]);
  const [columns, setColumns] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobalImages() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "globalImages"));
        // console.log(querySnapshot.docs[0])
        const fetchedImages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().imageUrl,
          username: doc.data().username,
          userImageId: doc.data().userImageId,
          title: doc.data().title || "Untitled",
        }));
        // console.log(fetchedImages);
        setImages(fetchedImages);
      } catch (error) {
        toast.error("Failed to fetch images");
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalImages();
  }, []);

  useEffect(() => {
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <h3 className="text-xl font-medium mb-2">No public images yet</h3>
        <p className="text-gray-500">Check back later for more content!</p>
      </div>
    );
  }

  const createMasonryLayout = () => {
    const columnArrays = Array.from({ length: columns }, () => []);

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
              className="relative group overflow-hidden rounded-lg shadow-md"
            >
              <Image
                width={500}
                height={500}
                src={image.url || "/placeholder.svg"}
                alt={image.title || "User image"}
                className="w-full object-cover transition-transform transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium truncate">
                    {image.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    <Link
                      href={`/@${image.username}`}
                      className="hover:underline hover:text-white transition-colors duration-200"
                    >
                      @{image.username}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
