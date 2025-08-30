import type { Event } from "../../payload-types";
import { RichText } from "./RichText";

export interface DetailsProps {
  details: NonNullable<Event["details"]>;
}
export function Details({ details }: Readonly<DetailsProps>) {
  return (
    <div>
      <h2>Details</h2>
      <RichText data={details} />
    </div>
  );
}
