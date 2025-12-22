import type React from "react"
/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface TooltipHelperProps {
  content: string
  children?: React.ReactNode
}

export function TooltipHelper({ content, children }: TooltipHelperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
