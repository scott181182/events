import type { Event } from "../../payload-types";

interface LinkItemProps {
  link: NonNullable<Event["links"]>[number];
}
export function LinkItem({ link }: Readonly<LinkItemProps>) {
  const iconSvg = typeof link.website === "object" ? link.website?.monochrome_icon_svg : null;

  return (
    <li key={link.id} className="grid grid-cols-subgrid grid-rows-subgrid col-span-2">
      {iconSvg ? (
        <span className="**:fill-base-content *:max-h-5 *:max-w-5" dangerouslySetInnerHTML={{ __html: iconSvg }}></span>
      ) : (
        <span></span>
      )}
      <div className="flex items-center">
        <a className="link" href={link.href}>
          {link.text || link.href}
        </a>
      </div>
    </li>
  );
}

export interface LinksProps {
  links: NonNullable<Event["links"]>;
}
export function Links({ links }: Readonly<LinksProps>) {
  return (
    <article>
      <h2>Links</h2>
      <ul className="grid grid-cols-[min-content_auto] auto-rows-fr gap-x-1 gap-y-2 py-2">
        {links.map((l) => (
          <LinkItem link={l} key={l.id} />
        ))}
      </ul>
    </article>
  );
}
