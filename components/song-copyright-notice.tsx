"use client";

import { members } from "@/data/members";
import type { SongCopyrightRecord } from "@/lib/copyright-constants";
import { PLATFORM_DOMAIN } from "@/lib/copyright-constants";

type SongCopyrightNoticeProps = {
  record: SongCopyrightRecord;
};

function formatMemberNames(slugs: string[]): string {
  return slugs
    .map((slug) => members.find((member) => member.slug === slug)?.name ?? slug)
    .join(", ");
}

export function SongCopyrightNotice({ record }: SongCopyrightNoticeProps) {
  return (
    <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5 text-left">
      <h2 className="text-lg font-bold">Family rights &amp; catalog</h2>
      <p className="mt-2 text-xs leading-relaxed text-[var(--jb-muted)]">
        Part of the Cousin Radio family legacy on {PLATFORM_DOMAIN}. All rights reserved unless
        noted in our family charter.
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-bold text-[var(--jb-text)]">Registry ID</dt>
          <dd className="font-mono text-xs text-[var(--jb-muted)]">{record.registryId}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--jb-text)]">Catalog owner</dt>
          <dd className="text-[var(--jb-muted)]">{record.catalogOwner}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--jb-text)]">Family producer</dt>
          <dd className="text-[var(--jb-muted)]">{record.familyProducer}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--jb-text)]">About / featuring</dt>
          <dd className="text-[var(--jb-muted)]">{formatMemberNames(record.subjectMemberSlugs)}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--jb-text)]">Production</dt>
          <dd className="text-[var(--jb-muted)]">Google Gemini · family-directed prompts</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--jb-text)]">Audio fingerprint</dt>
          <dd className="break-all font-mono text-xs text-[var(--jb-muted)]">{record.audioSha256}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[11px] leading-relaxed text-[var(--jb-muted)]">
        Full policy:{" "}
        <a
          href="https://github.com/heyitschien/family-jukebox/blob/main/docs/COPYRIGHT-AND-OWNERSHIP.md"
          className="text-amber-300/90 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Copyright &amp; family ownership
        </a>
      </p>
    </section>
  );
}
