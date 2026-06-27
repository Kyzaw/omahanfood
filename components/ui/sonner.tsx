"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1c1917",
          "--normal-border": "#e8e3dd",
          "--success-bg": "#f0fdf4",
          "--success-text": "#166534",
          "--success-border": "#bbf7d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#991b1b",
          "--error-border": "#fecaca",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#92400e",
          "--warning-border": "#fde68a",
          "--info-bg": "#eff6ff",
          "--info-text": "#1e40af",
          "--info-border": "#bfdbfe",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-stone-800 group-[.toaster]:border group-[.toaster]:border-stone-200/80 group-[.toaster]:shadow-lg group-[.toaster]:shadow-stone-200/40 group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold",
          description: "group-[.toast]:text-stone-500 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-orange-500 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:shadow-sm group-[.toast]:shadow-orange-200 group-[.toast]:hover:bg-orange-600 group-[.toast]:transition-colors group-[.toast]:duration-200",
          cancelButton:
            "group-[.toast]:bg-stone-100 group-[.toast]:text-stone-600 group-[.toast]:rounded-xl group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:hover:bg-stone-200 group-[.toast]:transition-colors group-[.toast]:duration-200",
          success:
            "group-[.toaster]:!bg-emerald-50 group-[.toaster]:!border-emerald-200/80 group-[.toaster]:!text-emerald-800 group-[.toaster]:!shadow-emerald-100/40",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!border-red-200/80 group-[.toaster]:!text-red-800 group-[.toaster]:!shadow-red-100/40",
          warning:
            "group-[.toaster]:!bg-amber-50 group-[.toaster]:!border-amber-200/80 group-[.toaster]:!text-amber-800 group-[.toaster]:!shadow-amber-100/40",
          info:
            "group-[.toaster]:!bg-blue-50 group-[.toaster]:!border-blue-200/80 group-[.toaster]:!text-blue-800 group-[.toaster]:!shadow-blue-100/40",
          loading:
            "group-[.toaster]:!bg-stone-50 group-[.toaster]:!border-stone-200/80 group-[.toaster]:!text-stone-700",
          icon: "group-[.toast]:mr-1",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
