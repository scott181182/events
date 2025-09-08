import type { Event } from "../../payload-types";
import { RichText } from "./RichText";

export interface DetailsProps {
  details: Event["details"];
}
export function Details({ details }: Readonly<DetailsProps>) {
  if (!details) {
    return null;
  }

  return (
    <div>
      <h2>Details</h2>
      <RichText data={details} />
    </div>
  );
}
