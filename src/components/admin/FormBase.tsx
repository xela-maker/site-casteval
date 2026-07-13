import { ReactNode, useState, useEffect, type CSSProperties } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Copy, Trash, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormTab {
  value: string;
  label: string;
  content: ReactNode;
  complete?: boolean;
  icon?: ReactNode;
}

interface FormBaseProps {
  tabs: FormTab[];
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  showPreview?: boolean;
  showDuplicate?: boolean;
  showDelete?: boolean;
  statusSlot?: ReactNode;
  defaultTab?: string;
}

const actionBtnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "44px",
  padding: "10px 20px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 150ms ease",
  whiteSpace: "nowrap",
  border: "1px solid transparent",
};

export const FormBase = ({
  tabs,
  onSaveDraft,
  onPublish,
  onPreview,
  onDuplicate,
  onDelete,
  isLoading = false,
  showPreview = true,
  showDuplicate = false,
  showDelete = false,
  statusSlot,
  defaultTab,
}: FormBaseProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.value);
  const [sidebarWidth, setSidebarWidth] = useState("260px");

  // Keep floating bar aligned with the main column (outside the sidebar)
  useEffect(() => {
    const readWidth = () => {
      const aside = document.querySelector("aside");
      if (!aside) return;
      const fromVar = getComputedStyle(aside).getPropertyValue("--admin-sidebar-width").trim();
      const w = fromVar || `${Math.round(aside.getBoundingClientRect().width)}px`;
      setSidebarWidth(w);
    };
    readWidth();
    const aside = document.querySelector("aside");
    if (!aside) return;
    const observer = new ResizeObserver(readWidth);
    observer.observe(aside);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6 pb-28">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div
          className="sticky top-0 z-30 -mx-1 px-1 pb-3 pt-1"
          style={{
            background: "linear-gradient(180deg, hsl(var(--admin-bg)) 70%, transparent)",
          }}
        >
          <TabsList
            className="h-auto w-full flex-wrap justify-start gap-1.5 rounded-xl p-1.5"
            style={{
              background: "hsl(var(--admin-surface-2))",
              border: "1px solid hsl(var(--admin-line))",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "relative gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                    "data-[state=active]:shadow-none",
                  )}
                  style={{
                    background: isActive ? "hsl(var(--admin-brand))" : "transparent",
                    color: isActive ? "hsl(220 26% 10%)" : "hsl(var(--admin-muted))",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {typeof tab.complete === "boolean" && (
                    <span className="ml-0.5 inline-flex" aria-hidden>
                      {tab.complete ? (
                        <CheckCircle2
                          className="h-3.5 w-3.5"
                          style={{ color: isActive ? "hsl(220 26% 10%)" : "hsl(var(--admin-success))" }}
                        />
                      ) : (
                        <Circle
                          className="h-3.5 w-3.5 opacity-50"
                          style={{ color: isActive ? "hsl(220 26% 10%)" : "hsl(var(--admin-muted))" }}
                        />
                      )}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            forceMount
            className="mt-6 focus-visible:outline-none data-[state=inactive]:hidden"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating Action Bar — aligned to content column, not under sidebar */}
      <div
        className="fixed bottom-0 z-40 border-t"
        style={{
          left: sidebarWidth,
          right: 0,
          background: "hsl(var(--admin-surface) / 0.95)",
          borderColor: "hsl(var(--admin-line))",
          boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(12px)",
          transition: "left 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            {showDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                style={{
                  ...actionBtnBase,
                  borderColor: "hsl(var(--admin-danger) / 0.4)",
                  color: "hsl(var(--admin-danger))",
                  background: "transparent",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Trash size={16} />
                Excluir
              </button>
            )}
            {showDuplicate && (
              <button
                type="button"
                onClick={onDuplicate}
                disabled={isLoading}
                style={{
                  ...actionBtnBase,
                  borderColor: "hsl(var(--admin-line))",
                  color: "hsl(var(--admin-text))",
                  background: "transparent",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Copy size={16} />
                Duplicar
              </button>
            )}
            {statusSlot && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "hsl(var(--admin-muted))",
                  minWidth: 0,
                }}
              >
                {statusSlot}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={isLoading}
                style={{
                  ...actionBtnBase,
                  borderColor: "hsl(var(--admin-line))",
                  color: "hsl(var(--admin-text))",
                  background: "hsl(var(--admin-surface-2))",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Save size={16} />
                Salvar Rascunho
              </button>
            )}
            {showPreview && onPreview && (
              <button
                type="button"
                onClick={onPreview}
                disabled={isLoading}
                style={{
                  ...actionBtnBase,
                  borderColor: "hsl(var(--admin-line))",
                  color: "hsl(var(--admin-text))",
                  background: "hsl(var(--admin-surface-2))",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Eye size={16} />
                Visualizar
              </button>
            )}
            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={isLoading}
                style={{
                  ...actionBtnBase,
                  background: "hsl(var(--admin-brand))",
                  color: "#10131A",
                  boxShadow: "0 2px 8px hsla(var(--admin-brand), 0.35)",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                Publicar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
