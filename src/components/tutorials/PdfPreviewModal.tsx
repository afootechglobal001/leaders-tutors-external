"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export default function PdfPreviewModal({
  isOpen,
  onClose,
  url,
  title,
}: PdfPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const el = viewerRef.current;
    if (!el) return;

    const updateWidth = () => setPageWidth(Math.max(0, el.clientWidth - 32));

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !url) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load material");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled)
          setError("We couldn't load this material. Try again later.");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, url]);

  useEffect(() => {
    if (!isOpen) return;

    const blockShortcuts = (e: KeyboardEvent) => {
      const isSaveOrPrint =
        (e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase());
      if (isSaveOrPrint) e.preventDefault();
    };

    window.addEventListener("keydown", blockShortcuts);
    return () => window.removeEventListener("keydown", blockShortcuts);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/80 p-2 md:p-4"
      style={{ height: "100dvh" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-t-2xl bg-white px-5 py-3 shadow-card">
        <p className="truncate pr-4 text-sm font-semibold text-ink">
          {title || "Tutorial material"}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-primary-light hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={viewerRef}
        className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 select-none overflow-auto rounded-b-2xl bg-slate-800"
      >
        <div className="mx-auto flex w-full min-w-0 items-center justify-center p-4">
          {error ? (
            <p className="text-sm text-white/80">{error}</p>
          ) : !blobUrl || !pageWidth ? (
            <Loader2 className="h-8 w-8 animate-spin text-white/70" />
          ) : (
            <Document
              file={blobUrl}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              onLoadError={() =>
                setError("We couldn't render this material. Try again later.")
              }
              loading={
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
              }
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-xl"
              />
            </Document>
          )}
        </div>
      </div>

      {blobUrl && numPages > 1 && (
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-4 rounded-b-2xl bg-white px-5 py-3 shadow-card">
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-primary-light disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium-custom text-ink">
            Page {pageNumber} of {numPages}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-primary-light disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
