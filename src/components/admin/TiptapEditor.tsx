import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Eraser,
  Upload,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  required?: boolean;
  description?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo...",
  minHeight = 400,
  label,
  required = false,
  description,
}: TiptapEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleInsertLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
    }
    setLinkUrl("");
    setLinkText("");
    setLinkDialogOpen(false);
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: imageAlt || "Imagem" })
        .run();
    }
    setImageUrl("");
    setImageAlt("");
    setImageDialogOpen(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validations
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem não pode ter mais de 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast({
        title: "Erro",
        description: "Formato não suportado. Use JPG, PNG, WEBP ou GIF",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage.from("files").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("files").getPublicUrl(filePath);

      editor
        .chain()
        .focus()
        .setImage({ src: publicUrl, alt: imageAlt || file.name })
        .run();

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso",
      });

      setImageDialogOpen(false);
      setImageAlt("");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    icon: any;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        minWidth: "44px",
        minHeight: "44px",
        width: "44px",
        height: "44px",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isActive ? "hsl(var(--accent))" : "transparent",
        color: isActive ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "hsl(var(--accent))";
          e.currentTarget.style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !disabled) {
          e.currentTarget.style.background = "transparent";
        }
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <Icon style={{ width: "22px", height: "22px" }} />
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label && (
        <div>
          <Label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {label}
            {required && <span style={{ color: "hsl(var(--destructive))" }}>*</span>}
          </Label>
          {description && (
            <p
              style={{
                fontSize: "14px",
                color: "hsl(var(--muted-foreground))",
                marginTop: "4px",
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          border: "1px solid hsl(var(--border))",
          borderRadius: "12px",
          overflow: "hidden",
          background: "hsl(var(--background))",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            borderBottom: "2px solid hsl(var(--border))",
            background: "hsl(var(--muted))",
            padding: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          {/* History */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={Undo}
              title="Desfazer"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={Redo}
              title="Refazer"
            />
          </div>

          {/* Text formatting */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={Bold}
              title="Negrito"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={Italic}
              title="Itálico"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={UnderlineIcon}
              title="Sublinhado"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              icon={Strikethrough}
              title="Tachado"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              icon={Code}
              title="Código"
            />
          </div>

          {/* Headings */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              icon={Heading1}
              title="Título 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              icon={Heading2}
              title="Título 2"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              icon={Heading3}
              title="Título 3"
            />
          </div>

          {/* Lists */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={List}
              title="Lista com marcadores"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              icon={ListOrdered}
              title="Lista numerada"
            />
          </div>

          {/* Special blocks */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              icon={Quote}
              title="Citação"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              icon={Minus}
              title="Linha horizontal"
            />
          </div>

          {/* Media */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => {
                const previousUrl = editor.getAttributes("link").href;
                setLinkUrl(previousUrl || "");
                setLinkDialogOpen(true);
              }}
              isActive={editor.isActive("link")}
              icon={LinkIcon}
              title="Inserir/editar link"
            />
            <ToolbarButton onClick={() => setImageDialogOpen(true)} icon={ImageIcon} title="Inserir imagem" />
          </div>

          {/* Alignment */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingRight: "12px",
              borderRight: "2px solid hsl(var(--border))",
            }}
          >
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              icon={AlignLeft}
              title="Alinhar à esquerda"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              icon={AlignCenter}
              title="Centralizar"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              icon={AlignRight}
              title="Alinhar à direita"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              icon={AlignJustify}
              title="Justificar"
            />
          </div>

          {/* Clear */}
          <div style={{ display: "flex", gap: "6px" }}>
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              icon={Eraser}
              title="Limpar formatação"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="prose-editor" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir Link</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Label htmlFor="link-text">Texto do link (opcional)</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Texto visível"
              />
            </div>
            <div>
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsertLink} disabled={!linkUrl}>
              Inserir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir Imagem</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Label htmlFor="image-alt">Texto alternativo</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Label>Opção 1: Inserir por URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <Button onClick={handleInsertImage} disabled={!imageUrl} style={{ width: "100%" }}>
                Inserir da URL
              </Button>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ width: "100%", borderTop: "1px solid hsl(var(--border))" }} />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    background: "hsl(var(--background))",
                    padding: "0 8px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Ou
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Label htmlFor="image-upload">Opção 2: Upload</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Máximo 5MB • JPG, PNG, WEBP ou GIF
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .prose-editor .ProseMirror {
          outline: none;
          padding: 20px;
          font-size: 15px;
          line-height: 1.7;
        }
        .prose-editor .ProseMirror p {
          margin: 0.75em 0;
        }
        .prose-editor .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }
        .prose-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0 0.5em;
        }
        .prose-editor .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }
        .prose-editor .ProseMirror h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1.33em 0 0.5em;
        }
        .prose-editor .ProseMirror ul,
        .prose-editor .ProseMirror ol {
          padding-left: 2em;
          margin: 0.75em 0;
        }
        .prose-editor .ProseMirror ul {
          list-style-type: disc;
        }
        .prose-editor .ProseMirror ol {
          list-style-type: decimal;
        }
        .prose-editor .ProseMirror blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        .prose-editor .ProseMirror hr {
          border: 0;
          border-top: 2px solid hsl(var(--border));
          margin: 2em 0;
        }
        .prose-editor .ProseMirror code {
          background: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .prose-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        .prose-editor .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .prose-editor .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
