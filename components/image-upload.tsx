
"use client"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Input } from "./ui/input"
import toast from "react-hot-toast"
import { Button } from "./ui/button"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: { url: string; public_id: string }) => void
  onRemove: (public_id: string) => void
  value: string        // the secure_url for display
  publicId?: string    // the Cloudinary public_id for deletion
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  publicId,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const file = fileList[0]
    setLoading(true)
    setProgress(0)

    // Simulate progress while waiting for the server response
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 5 : prev))
    }, 150)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "hiretrack/job-covers")

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Upload failed")
      }

      const data: { url: string; public_id: string; name: string } = await res.json()
      setProgress(100)
      onChange({ url: data.url, public_id: data.public_id })
      toast.success("Image uploaded successfully")
    } catch (error: unknown) {
      clearInterval(progressInterval)
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setLoading(false)
      setProgress(0)
      // Reset input so same file can be re-uploaded
      e.target.value = ""
    }
  }

  const onDelete = async () => {
    if (!publicId) {
      onRemove("")
      return
    }
    try {
      const res = await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId, resource_type: "image" }),
      })
      if (!res.ok) throw new Error("Delete failed")
      onRemove(publicId)
      toast.success("Image deleted successfully")
    } catch {
      toast.error("Failed to delete image")
    }
  }

  return (
    <div>
      {(typeof value === 'string' && value.trim() !== '') ? (
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden">
          <Image
            src={value}
            fill
            className="w-full h-full object-cover"
            alt="Job Cover Image"
          />
          <div className="absolute z-10 top-2 right-2 cursor-pointer" onClick={onDelete}>
            <Button size={"icon"} variant={"destructive"} type="button">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed bg-neutral-50 dark:bg-neutral-900">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              {/* Progress bar */}
              <div className="w-48 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{progress.toFixed(0)}% uploading…</p>
            </div>
          ) : (
            <label className="w-full h-full">
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                <ImagePlus className="text-muted-foreground w-10 h-10" />
                <p className="text-sm text-muted-foreground">Upload an image</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled || loading}
                onChange={onUpload}
              />
            </label>
          )}
        </div>
      )}
    </div>
  )
}
