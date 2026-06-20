type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-3 px-4">
      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-sm text-[#b3b3b3]">{subtitle}</p> : null}
    </div>
  );
}
