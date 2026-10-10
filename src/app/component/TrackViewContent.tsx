"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent } from "../../lib/metaPixel";

// Menembakkan event ViewContent sekali per konten yang dilihat.
// Dipasang di halaman detail (proyek, tipe unit, berita).
export default function TrackViewContent({
  contentName,
  contentCategory,
}: {
  contentName: string;
  contentCategory?: string;
}) {
  const firedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!contentName || firedRef.current === contentName) return;
    firedRef.current = contentName;
    trackMetaEvent("ViewContent", {
      content_name: contentName,
      ...(contentCategory ? { content_category: contentCategory } : {}),
    });
  }, [contentName, contentCategory]);

  return null;
}
