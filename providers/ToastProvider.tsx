"use client";

import { Toaster } from "react-hot-toast"

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
  )
}