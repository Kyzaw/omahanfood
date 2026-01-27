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
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "oklch(0.95 0.08 60)",
          "--success-text": "oklch(0.25 0.15 30)",
          "--success-border": "oklch(0.8 0.12 40)",
          "--error-bg": "oklch(0.95 0.08 20)",
          "--error-text": "oklch(0.4 0.18 25)",
          "--error-border": "oklch(0.7 0.15 20)",
          "--warning-bg": "oklch(0.97 0.06 45)",
          "--warning-text": "oklch(0.35 0.12 35)",
          "--warning-border": "oklch(0.75 0.1 40)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-2xl backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-orange-500 group-[.toast]:to-red-500 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-medium group-[.toast]:shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:font-medium hover:bg-muted/80 transition-colors duration-200",
          icon: "group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
