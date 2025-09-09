import dayjs, { Dayjs } from "dayjs";
import { Metadata, ResolvingMetadata } from "next";
import { getPayload } from "payload";

import { InviteCard, InviteCardProps } from "@/components/InviteCard";
import config from "@/payload.config";

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
      "event-series": { name: true, host: true },
      media: { url: true, alt: true, filename: true },
    },
  });

  const date = dayjs(event.timestamp);
  const timeOfDay = getTimeOfDay(date);
  const day = `${date.format("dddd")} ${timeOfDay}`;

  const coverUrl = typeof event.coverImage === "object" ? (event.coverImage?.url ?? undefined) : undefined;

  return {
    day: day,
    name: event.name,
    location: event.location && typeof event.location === "object" ? event.location : undefined,
    coverUrl: coverUrl,
    date: date,
    difficulty: event.difficulty,
    distance: `${event.distance} miles`,
    duration: event.duration,
    series: typeof event.series === "object" ? event.series : undefined,
    mapEmbedUrl: event.mapEmbedUrl,
    mapMeetUrl: event.mapMeetUrl,
    meetCoordinates: event.meetCoordinates,
    mapOptions: event.mapOptions,
    details: event.details,
    announcements: event.announcements,
    links: event.links,
  };
}

interface PageProps {
  params: Promise<{ eventId: string }>;
}
export async function generateMetadata({ params }: PageProps, _parent: ResolvingMetadata): Promise<Metadata> {
  const { eventId } = await params;
  const cardProps = await fetchInviteCardDetails(eventId);

  const title = cardProps.name;
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
    <main className="w-screen min-h-screen flex justify-center items-center py-4">
      <div className="fixed inset-0 bg-cross"></div>
      <InviteCard {...cardProps} />
    </main>
  );
}
