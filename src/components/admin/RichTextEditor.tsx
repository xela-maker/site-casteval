import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  required?: boolean;
  description?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo...",
  minHeight = 300,
  label,
  required = false,
  description,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("rich-text-area") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    onChange(newText);

    // Restaurar foco e seleção
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: "Negrito", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Itálico", action: () => insertMarkdown("*", "*") },
    { icon: Heading2, label: "Título", action: () => insertMarkdown("## ", "") },
    { icon: List, label: "Lista", action: () => insertMarkdown("- ", "") },
    { icon: ListOrdered, label: "Lista numerada", action: () => insertMarkdown("1. ", "") },
    { icon: LinkIcon, label: "Link", action: () => insertMarkdown("[", "](url)") },
  ];

  // Conversão simples de Markdown para HTML
  const markdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^\d+\.\s+(.*$)/gim, "<li>$1</li>")
      .replace(/^-\s+(.*$)/gim, "<li>$1</li>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l|p])/gm, '<p class="mb-4">')
      .replace(/<\/li>\n<li>/g, "</li><li>")
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 mb-4">$1</ul>');
  };

  return (
    <div style={{ marginBottom: "8px" }}>
      {label && (
        <div style={{ marginBottom: "12px" }}>
          <Label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {label}
            {required && <span style={{ color: "hsl(var(--destructive))" }}>*</span>}
          </Label>
          {description && (
            <p
              style={{
                fontSize: "13px",
                color: "hsl(var(--muted-foreground))",
                marginTop: "4px",
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid hsl(var(--border))",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <TabsList
            style={{
              height: "auto",
              padding: 0,
              background: "transparent",
            }}
          >
            <TabsTrigger
              value="edit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "14px",
              }}
            >
              Editar
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "14px",
              }}
            >
              <Eye style={{ width: "16px", height: "16px" }} />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div
              className="toolbar-buttons"
              style={{
                display: "flex",
                gap: "6px",
                padding: "8px",
                flexWrap: "wrap",
              }}
            >
              {formatButtons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={btn.action}
                  title={btn.label}
                  onMouseEnter={() => setHoveredButton(i)}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    minWidth: "44px",
                    minHeight: "44px",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    background: hoveredButton === i ? "hsl(var(--accent))" : "transparent",
                    color: hoveredButton === i ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: hoveredButton === i ? "scale(1.05)" : "scale(1)",
                    padding: "10px",
                  }}
                >
                  <btn.icon style={{ width: "22px", height: "22px" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="edit" style={{ marginTop: 0 }}>
          <Textarea
            id="rich-text-area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={cn("font-mono text-sm resize-none")}
            style={{
              minHeight,
              padding: "16px",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "hsl(var(--muted-foreground))",
              marginTop: "8px",
            }}
          >
            Suporte a Markdown: **negrito**, *itálico*, ## títulos, [links](url), - listas
          </p>
        </TabsContent>

        <TabsContent value="preview" style={{ marginTop: 0 }}>
          <div
            className="border rounded-md p-4 prose prose-sm max-w-none"
            style={{
              minHeight,
              padding: "16px",
              fontSize: "15px",
              lineHeight: "1.7",
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
            }}
            dangerouslySetInnerHTML={{
              __html: value
                ? markdownToHtml(value)
                : '<p style="color: hsl(var(--muted-foreground))">Nada para visualizar</p>',
            }}
          />
        </TabsContent>
      </Tabs>

      {/* CSS Responsivo */}
      <style>{`
        @media (max-width: 768px) {
          .toolbar-buttons {
            width: 100% !important;
            justify-content: flex-start !important;
            padding: 10px 8px !important;
          }
          
          .toolbar-buttons button {
            min-width: 40px !important;
            min-height: 40px !important;
            width: 40px !important;
            height: 40px !important;
          }
          
          .toolbar-buttons button svg {
            width: 20px !important;
            height: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .toolbar-buttons {
            gap: 4px !important;
          }
          
          .toolbar-buttons button {
            min-width: 38px !important;
            min-height: 38px !important;
            width: 38px !important;
            height: 38px !important;
          }
          
          .toolbar-buttons button svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
