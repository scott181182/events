import React from "react";

import "./styles.css";

export default function HomePage() {
  return (
    <div className="hero w-screen h-screen">
      <main className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold">Events</h1>
          <p className="py-6">
            This site is used to host event details and share invites.
            <br />
            If you&apos;re looking for an event, you&apos;ll need a direct link.
          </p>
        </div>
      </main>
    </div>
  );
}
