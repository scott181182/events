import { getPayload } from "payload";
import dayjs, { Dayjs } from "dayjs";

import { PageProps } from ".next/types/app/(frontend)/events/[eventId]/page";
import { InviteCard, InviteCardProps } from "@/components/InviteCard";
import config from "@/payload.config";
import { Metadata, ResolvingMetadata } from "next";

function getTimeOfDay(date: Dayjs): string {
  if (date.hour() < 12) {
    return "morning";
  } else if (date.hour() < 16) {
    return "afternoon";
  } else if (date.hour() < 19) {
    return "evening";
  } else {
    return "night";
  }
}
async function fetchInviteCardDetails(eventId: string): Promise<InviteCardProps> {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const event = await payload.findByID({
    collection: "events",
    id: eventId,
    populate: {
      media: { url: true, alt: true, filename: true },
      "event-series": { name: true, host: true },
    },
  });

  const date = dayjs(event.timestamp);
  const timeOfDay = getTimeOfDay(date);
  const day = `${date.format("dddd")} ${timeOfDay}`;

  const coverUrl = typeof event.coverImage === "object" ? (event.coverImage?.url ?? undefined) : undefined;

  return {
    day: day,
    location: event.location,
    coverUrl: coverUrl,
    date: date,
    difficulty: event.difficulty,
    distance: `${event.distance} miles`,
    duration: event.duration,
    series: typeof event.series === "object" ? event.series : undefined,
    mapEmbedUrl: event.mapEmbedUrl,
    mapMeetUrl: event.mapMeetUrl,
  };
}

export async function generateMetadata({ params }: PageProps, _parent: ResolvingMetadata): Promise<Metadata> {
  const { eventId } = await params;
  const cardProps = await fetchInviteCardDetails(eventId);

  const title = `${cardProps.day} Hike Invite`;
  const description = `You're invited to a hike on ${cardProps.day}. Click for more details!`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: cardProps.coverUrl,
      url: `/events/${eventId}`,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { eventId } = await params;
  const cardProps = await fetchInviteCardDetails(eventId);

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-cross">
      <InviteCard {...cardProps} />
    </main>
  );
}
