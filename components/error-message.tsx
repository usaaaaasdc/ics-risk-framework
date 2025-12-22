"use client"

/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

import { AlertCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface ErrorMessageProps {
  title?: string
  message: string
  type?: "error" | "warning"
  onRetry?: () => void
}

export function ErrorMessage({ title, message, type = "error", onRetry }: ErrorMessageProps) {
  const Icon = type === "error" ? XCircle : AlertCircle
  const variant = type === "error" ? "destructive" : "default"

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <button onClick={onRetry} className="ml-4 underline hover:no-underline">
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  )
}
