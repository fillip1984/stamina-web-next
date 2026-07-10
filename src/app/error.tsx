"use client"

import Container from "@/components/styled-components/container"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <Container>
      <div className="mt-12 flex flex-col items-center gap-4">
        <h4>An application error has occurred</h4>
        <Link href="/">
          <Button>
            <HomeIcon /> Go home
          </Button>
        </Link>
      </div>
    </Container>
  )
}
