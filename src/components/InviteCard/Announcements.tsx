import type { Event } from "../../payload-types";
import { RichText } from "./RichText";

export interface AnnouncementsProps {
  announcements: NonNullable<Event["announcements"]>;
}
export function Announcements({ announcements }: Readonly<AnnouncementsProps>) {
  return (
    <div>
      <h2>Announcements</h2>
      <div className="flex flex-col gap-2 py-2">
        {announcements.docs?.map((d) => {
          if (typeof d !== "object") {
            return null;
          }

          return (
            <div className={`alert alert-${d.kind} flex flex-col items-start gap-1`} key={d.id}>
              <h3>{d.title}</h3>
              <div className="flex gap-4">
                <small>Created At: {d.createdAt}</small>|<small>Updated At: {d.updatedAt}</small>
              </div>
              <RichText data={d.content} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
