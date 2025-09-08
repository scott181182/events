"use client";

import dynamic from "next/dynamic";
import { InviteMapProps } from "./map";

const LazyInviteMap = dynamic(() => import("./map").then((mod) => mod.InviteMap), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export function InviteMap(props: Readonly<InviteMapProps>) {
  return <LazyInviteMap {...props} />;
}
