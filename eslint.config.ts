import type { ESLint } from "eslint"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

import { defineConfig, globalIgnores } from "eslint/config"

const clientBoundaryPlugin = {
  rules: {
    "no-server-imports-in-client": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow importing server-only modules from files marked with 'use client'",
        },
        schema: [],
        messages: {
          noServerImport:
            "Do not import '{{moduleName}}' in a file marked with 'use client'. Move this logic to a server file or pass serialized data via props.",
        },
      },
      create(context: {
        report: (arg0: {
          node: unknown
          messageId: "noServerImport"
          data: { moduleName: string }
        }) => void
      }) {
        let isClientComponent = false

        const isServerOnlyImport = (source: string) => {
          if (source === "server-only" || source === "@/env") {
            return true
          }

          if (source === "@/server") {
            return true
          }

          if (!source.startsWith("@/server/")) {
            return false
          }

          // Allow explicit client wrappers under /server, e.g. better-auth client.
          if (source.endsWith("/client") || source.includes("/client/")) {
            return false
          }

          return true
        }

        const reportIfServerImport = (node: {
          source?: { value?: unknown }
          importKind?: string
        }) => {
          if (!isClientComponent || node.importKind === "type") {
            return
          }

          const sourceValue = node.source?.value
          if (typeof sourceValue !== "string") {
            return
          }

          if (!isServerOnlyImport(sourceValue)) {
            return
          }

          context.report({
            node,
            messageId: "noServerImport",
            data: { moduleName: sourceValue },
          })
        }

        return {
          Program(node: { body: Array<{ type: string; directive?: string }> }) {
            isClientComponent = node.body.some(
              (statement) =>
                statement.type === "ExpressionStatement" &&
                statement.directive === "use client"
            )
          },
          ImportDeclaration(node: {
            source?: { value?: unknown }
            importKind?: string
          }) {
            reportIfServerImport(node)
          },
          ExportNamedDeclaration(node: {
            source?: { value?: unknown }
            importKind?: string
          }) {
            reportIfServerImport(node)
          },
          ExportAllDeclaration(node: {
            source?: { value?: unknown }
            importKind?: string
          }) {
            reportIfServerImport(node)
          },
        }
      },
    },
  },
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}"],
    plugins: {
      "client-boundary": clientBoundaryPlugin as unknown as ESLint.Plugin,
    },
    rules: {
      "client-boundary/no-server-imports-in-client": "error",
    },
  },
  // TODO: add drizzle-specific rules here using eslint-plugin-drizzle when it is ready.
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
