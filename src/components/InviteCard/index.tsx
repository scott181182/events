import { default as dayjs, Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

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
}: Readonly<InviteCardProps>) {
  return (
    <article className="card bg-base-300 max-w-4xl min-h-[5in] shadow-lg">
      {coverUrl && (
        <figure className="relative">
          <img src={coverUrl} alt={coverAlt ?? location} />
        </figure>
      )}
      <div className="card-body">
        <span className="-mb-2">
          You&apos;re invited to a <em>{day}</em> hike at
        </span>
        <h1 className="card-title text-4xl">{location}</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 grow">
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
        </div>
        {series?.host && <div>Let {series.host} know if you&apos;ll be able to make it!</div>}
      </div>
    </article>
  );
}
