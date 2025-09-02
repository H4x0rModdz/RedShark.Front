"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  src?: string | null
  alt?: string
  name?: string
  className?: string
  fallbackClassName?: string
}

const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps
>(({ src, alt, name, className, fallbackClassName, ...props }, ref) => {
  // Generate initials from name
  const getInitials = (name?: string): string => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = getInitials(name || alt)

  return (
    <Avatar ref={ref} className={cn("ring-offset-background", className)} {...props}>
      <AvatarImage src={src || ""} alt={alt || name || "User avatar"} />
      <AvatarFallback className={cn("bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold text-sm", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
})
UserAvatar.displayName = "UserAvatar"

export { UserAvatar }