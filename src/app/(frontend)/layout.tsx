import React from "react";
import "./styles.css";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: "A website for sharing events",
    title: "Events",
    metadataBase: process.env.SERVER_URL ? new URL(process.env.SERVER_URL) : undefined,
  };
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
