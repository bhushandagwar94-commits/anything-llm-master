import { useTranslation } from "react-i18next";
import useUser from "@/hooks/useUser";

/**
 * Quick action buttons for home and empty workspace states.
 * @param {Object} props
 * @param {boolean} props.hasAvailableWorkspace - Whether the user has a workspace they can use
 * @param {Function} props.onCreateAgent - Handler for "Create an Agent" action
 * @param {Function} props.onEditWorkspace - Handler for "Edit Workspace" action
 * @param {Function} props.onUploadDocument - Handler for "Upload a Document" action
 */
export default function QuickActions({
  hasAvailableWorkspace,
  onCreateAgent,
  onEditWorkspace,
  onUploadDocument,
}) {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <QuickActionButton
        label={t("main-page.quickActions.createAgent")}
        onClick={onCreateAgent}
        show={!user || ["admin"].includes(user?.role)}
      />
      <QuickActionButton
        label={t("main-page.quickActions.editWorkspace")}
        onClick={onEditWorkspace}
        show={
          hasAvailableWorkspace &&
          (!user || ["admin", "manager"].includes(user?.role))
        }
      />
      <QuickActionButton
        label={t("main-page.quickActions.uploadDocument")}
        onClick={onUploadDocument}
        // Any user can upload documents.
        show={true}
      />
    </div>
  );
}

function QuickActionButton({ label, onClick, show = true }) {
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl bg-white/5 light:bg-black/5 text-white/60 light:text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/10 transition-all duration-300 border border-white/10 light:border-black/5 shadow-lg backdrop-blur-md"
    >
      {label}
    </button>
  );
}
