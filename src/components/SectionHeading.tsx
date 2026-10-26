export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  id,
  tone = "light",
  mark,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  tone?: "light" | "dark";
  /** A phrase inside `title` to underline with the highlighter stroke. */
  mark?: string;
}) {
  const dark = tone === "dark";
  const at = mark ? title.indexOf(mark) : -1;
  return (
    <div data-reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className={`eyebrow ${dark ? "!text-mint" : ""}`}>{eyebrow}</p> : null}
      <h2 id={id} className={`h-section mt-2 ${dark ? "!text-white" : ""}`}>
        {at >= 0 && mark ? (
          <>
            {title.slice(0, at)}
            <span className="marker">{mark}</span>
            {title.slice(at + mark.length)}
          </>
        ) : (
          title
        )}
      </h2>
      {lede ? <p className={`lede mt-4 ${dark ? "!text-mint-light" : ""}`}>{lede}</p> : null}
    </div>
  );
}
