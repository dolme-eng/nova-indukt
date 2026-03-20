"use client"

import { useCallback } from "react"
import deMessages from "@/messages/de.json"

type Primitive = string | number | boolean
type Vars = Record<string, Primitive>

function resolvePath(obj: any, parts: string[]) {
  let cur = obj
  for (const part of parts) {
    if (cur == null) return undefined
    cur = cur[part]
  }
  return cur
}

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value))
  }, template)
}

export function useDeTranslations(namespace?: string) {
  return useCallback(
    (key: string, vars?: Vars) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      const parts = fullKey.split(".").filter(Boolean)

      const value = resolvePath(deMessages, parts)
      if (typeof value !== "string") return key
      return interpolate(value, vars)
    },
    [namespace],
  )
}

