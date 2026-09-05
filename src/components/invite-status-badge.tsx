import {
  INVITE_STATUS_LABEL,
  type InviteStatus,
} from "@/lib/invite";

const STYLES: Record<InviteStatus, string> = {
  invited: "bg-teal/10 text-teal-deep",
  pending: "bg-gold/20 text-ink",
  active: "bg-teal text-white",
  declined: "bg-danger/10 text-danger",
};

export function InviteStatusBadge({ status }: { status: InviteStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${STYLES[status]}`}
    >
      {INVITE_STATUS_LABEL[status]}
    </span>
  );
}
