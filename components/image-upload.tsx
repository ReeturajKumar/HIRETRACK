/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { storage } from "@/config/firebase.config"
import { deleteObject, ref, uploadBytesResumable } from "firebase/storage"
import toast from "react-hot-toast"
import {getDownloadURL} from "firebase/storage"
import { Button } from "./ui/button"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (url: string) => void
  onRemove: (url: string) => void
  value: string
}

export default function ImageUpload({disabled, onChange, onRemove, value}: ImageUploadProps) {
  const [isMounted, setisMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)


  useEffect(() => {
    setisMounted(true)
  }, [])
  if (!isMounted) {
    return null
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
  
    const file: File = fileList[0];
    setLoading(true);
  
    const uploadTask = uploadBytesResumable(
      ref(storage, `JobCoverImage/${Date.now()}-${file.name}`),
      file,
      {
        contentType: "image/jpeg",
      }
    );
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        toast.error(error.message);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setLoading(false);
          toast.success("Image uploaded successfully");
        });
      }
    );
  };


  const onDelete = () => {
    onRemove(value)
    deleteObject(ref(storage, value)).then(() => {
      toast.success("Image deleted successfully")
    })
  }
  
  return (
    <div>
      {value ? <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden">
        <Image
          src={value}
          fill
          className="w-full h-full object-cover"
          alt="Image"
        />

        <div className="absolute z-10 top-2 right-2 cursor-pointer"
        onClick={onDelete}
        >
          <Button size={"icon"} variant={"destructive"}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>

      </div> : <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed bg-neutral-50 dark:bg-neutral-900">
        {loading ? (
          <>
          <p>{`${progress.toFixed(2)}%`}</p>
          </>
        ) : (
          <>
          <label>
            <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
              <ImagePlus className="text-muted-foreground w-10 h-10" />
              <p className="text-sm text-muted-foreground">Upload an image</p>
            </div>

            <Input 
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onUpload}
            />
          </label>
          </>
        )}
        </div>}
    </div>
  )
}
