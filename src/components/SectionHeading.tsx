export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div data-reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="h-section mt-2">
        {title}
      </h2>
      {lede ? <p className="lede mt-4">{lede}</p> : null}
    </div>
  );
}
