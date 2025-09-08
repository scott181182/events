import type { Event } from "../../payload-types";

export interface MeetupDirectionsProps {
  mapMeetUrl?: string | null;
  meetCoordinates?: Event["meetCoordinates"];
}

export function MeetupDirections({ mapMeetUrl, meetCoordinates }: Readonly<MeetupDirectionsProps>) {
  if (meetCoordinates?.latitude && meetCoordinates.longitude) {
    const latlng = `${meetCoordinates.latitude},${meetCoordinates.longitude}`;
    const directionHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(latlng)}`;
    return (
      <a href={directionHref} target="_blank" className="link">
        Directions to Meetup
      </a>
    );
  }
  if (mapMeetUrl) {
    return (
      <a href={mapMeetUrl} target="_blank" className="link">
        Meet Here
      </a>
    );
  }

  return null;
}
