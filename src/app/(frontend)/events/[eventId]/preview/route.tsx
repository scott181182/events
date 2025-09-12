import { ImageResponse } from "next/og";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { html } from "satori-html";

import { fetchInviteCardDetails } from "../page";
import { InviteCardProps } from "@/components/InviteCard";
import { calendarIcon, clockIcon, hourglassIcon, mapIcon, mountainIcon, pinIcon, routeIcon } from "./icons";
import { ReactNode } from "react";

interface EventDetailProps {
  icon: ReactNode;
  content: ReactNode;
}
function EventDetail({ icon, content }: Readonly<EventDetailProps>) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>{icon}</span>
      <span>{content}</span>
    </div>
  );
}

function makeSimpleDetails(details: SerializedEditorState<SerializedLexicalNode>) {
  const htmlString = convertLexicalToHTML({
    data: details,
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      // relationship: ({ node }) => convertRelationshipNode(node),
    }),
    disableContainer: true,
  });

  console.log({ htmlString });

  return html(htmlString);
}

function EventPreview({
  name,
  date,
  coverUrl,
  coverAlt,
  location,
  distance,
  difficulty,
  duration,
  meetCoordinates,
  details,
}: Readonly<InviteCardProps>) {
  const dateString = date.format("MM/DD/YYYY");
  const timeString = date.format("hh:mm a");

  const detailsNode = details && makeSimpleDetails(details);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      {coverUrl && (
        <img
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${coverUrl}`}
          alt={coverAlt}
          style={{
            width: "100vw",
            flex: "1 0 150px",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "1rem 2rem 2rem 2rem",
          fontSize: 32,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: 72, margin: 0 }}>{name}</h1>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <EventDetail icon={calendarIcon} content={dateString} />
            <EventDetail icon={clockIcon} content={timeString} />
          </div>
        </header>
        <article style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "100%" }}>
          {/* @ts-expect-error - Satori will successfully evaluate this VNode */}
          {detailsNode && <div style={{ display: "flex", flex: "1 1 0" }}>{detailsNode}</div>}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {location && <EventDetail icon={mapIcon} content={location.name} />}
            {meetCoordinates?.latitude && meetCoordinates?.longitude && (
              <EventDetail icon={pinIcon} content={`${meetCoordinates.latitude}, ${meetCoordinates.longitude}`} />
            )}
            <EventDetail icon={routeIcon} content={distance} />
            <EventDetail icon={hourglassIcon} content={duration} />
            <EventDetail icon={mountainIcon} content={difficulty} />
          </div>
        </article>
      </section>
    </div>
  );
}

interface RouteContext {
  params: Promise<{ eventId: string }>;
}
export async function GET(req: Request, ctx: RouteContext) {
  const { eventId } = await ctx.params;
  const event = await fetchInviteCardDetails(eventId);

  return new ImageResponse(<EventPreview {...event} />, {
    width: 1200,
    height: 630,
  });
}
