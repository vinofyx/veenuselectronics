"use client";

import Link from "next/link";
import type { ComponentProps, MouseEventHandler } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  event: TrackEvent;
  eventParams?: Record<string, unknown>;
};

/** Link that records a GA4 event on click. External links (tel:, wa.me) render a plain <a>. */
export function TrackedLink({ href, event, eventParams, onClick, children, ...rest }: Props) {
  const handle: MouseEventHandler<HTMLAnchorElement> = (e) => {
    track(event, eventParams);
    onClick?.(e);
  };

  const external = /^(https?:|tel:|mailto:)/.test(href);
  if (external) {
    const isWeb = href.startsWith("http");
    return (
      <a href={href} onClick={handle} {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
