import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { default as dayjs, Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import type { Event } from "../../payload-types";
import { Links } from "./Links";
import { Details } from "./Details";
import { Announcements } from "./Announcements";

dayjs.extend(advancedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export interface Series {
  name: string;
  host?: string | null;
}

export interface InviteCardProps {
  day: string;
  location: string;
  coverUrl?: string;
  coverAlt?: string;
  date: Dayjs;
  difficulty: string;
  distance: string;
  duration: string;
  series?: Series | null;
  mapEmbedUrl?: string | null;
  mapMeetUrl?: string | null;

  details?: Event["details"];
  announcements?: Event["announcements"];
  links?: Event["links"];
}

export function InviteCard({
  day,
  location,
  coverUrl,
  coverAlt,
  date,
  difficulty,
  distance,
  duration,
  series,

  mapEmbedUrl,
  mapMeetUrl,

  details,
  announcements,
  links,
}: Readonly<InviteCardProps>) {
  return (
    <div className="card bg-base-300 max-w-4xl shadow-lg">
      {coverUrl && (
        <figure className="relative">
          <img src={coverUrl} alt={coverAlt ?? location} />
        </figure>
      )}
      <div className="card-body">
        <header>
          <span className="-mb-2">
            You&apos;re invited to a <em>{day}</em> hike at
          </span>
          <h1 className="card-title">{location}</h1>
          {series && (
            <small>
              {series.host ? (
                <>
                  Part of {series.host}&apos;s <em>{series.name} Series</em>
                </>
              ) : (
                <>
                  Part of the <em>{series.name} Series</em>
                </>
              )}
            </small>
          )}
        </header>
        <section>
          <article className="grid grid-cols-1 md:grid-cols-2 grow">
            <dl className="grid grid-cols-[max-content_auto] gap-x-4 *:even:font-bold">
              <dt>Date</dt>
              <dd>{date.format("dddd, MMMM Do")}</dd>
              <dt>Meet Time</dt>
              <dd>{date.format("h:mma z")}</dd>
              <dt>Hike Time</dt>
              <dd>{date.add(10, "minutes").format("h:mma z")}</dd>
              <dt>Difficulty</dt>
              <dd>{difficulty}</dd>
              <dt>Distance</dt>
              <dd>{distance}</dd>
              <dt>Est. Duration</dt>
              <dd>{duration}</dd>
            </dl>
            <div className="flex flex-col items-center text-center">
              {mapEmbedUrl && (
                <iframe
                  title="Map"
                  src={mapEmbedUrl}
                  className="w-full min-h-32"
                  style={{ border: "1px solid black" }}
                ></iframe>
              )}
              {mapMeetUrl && (
                <a href={mapMeetUrl} target="_blank">
                  Meet Here
                </a>
              )}
            </div>
          </article>
          {announcements && <Announcements announcements={announcements} />}
          {details && <Details details={details} />}
          {links && links.length > 0 && <Links links={links} />}
        </section>
        <footer>{series?.host && <div>Let {series.host} know if you&apos;ll be able to make it!</div>}</footer>
      </div>
    </div>
  );
}
