"use client";

import { use } from "react";
import Image from "next/image";
import { getLinkPreview } from "link-preview-js";

interface OGPreviewResponse {
  url: string;
  title: string;
  siteName: string | undefined;
  author: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: IVideoType[];
  favicons: string[];
}

interface IVideoType {
  url: string | undefined;
  secureUrl: string | null | undefined;
  type: string | null | undefined;
  width: string | undefined;
  height: string | undefined;
}

export default function OGCard() {
  const url =
    "This is a text supposed to be parsed and the first link displayed https://www.themoviedb.org/tv/12609-dragon-ball?language=en-US";
  const ogResponse = use(getLinkPreview(url)) as OGPreviewResponse;

  if (!ogResponse.title) {
    return <div>No preview available</div>;
  }

  return (
    <div className="flex gap-2">
      {ogResponse.images.length > 0 && ogResponse.images[0] && (
        <Image
          src={ogResponse.images[0]}
          width={300}
          height={300}
          alt={ogResponse.title}
          className="aspect-video rounded-lg object-cover"
        />
      )}
      <div>
        <h4>{ogResponse.title}</h4>
        <p className="text-muted-foreground text-sm">
          {ogResponse.description}
        </p>
      </div>
    </div>
  );
}
