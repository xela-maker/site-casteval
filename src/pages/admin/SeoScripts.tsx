import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code, Search, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface SeoScriptsConfig {
  site_title_default: string;
  site_description_default: string;
  site_keywords_default: string;
  site_author_default: string;
  custom_scripts_json: string;
}

type ScriptPosition = "H" | "OB" | "F";

interface ScriptItem {
  id: string;
  name: string;
  position: ScriptPosition;
  code: string;
}

const initialData: SeoScriptsConfig = {
  site_title_default: "",
  site_description_default: "",
  site_keywords_default: "",
  site_author_default: "",
  custom_scripts_json: "",
};

const ConfigCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <div
    className="p-6 rounded-lg space-y-4"
    style={{
      background: "hsl(var(--admin-surface))",
      border: "1px solid hsl(var(--admin-line))",
    }}
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon className="admin-icon-md" style={{ color: "hsl(var(--admin-text))" }} />
      <h2 className="text-xl font-bold" style={{ color: "hsl(var(--admin-text))" }}>
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export default function SeoScripts() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<SeoScriptsConfig>(initialData);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["st_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("st_config").select("*");
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;
    const map: Partial<SeoScriptsConfig> = {};
    data.forEach((item: any) => {
      if (item && item.key in initialData) {
        map[item.key as keyof SeoScriptsConfig] = item.value ?? "";
      }
    });
    const merged = { ...initialData, ...map };
    setConfigs(merged);

    // carregar keywords em array a partir da string
    if (merged.site_keywords_default) {
      const parts = String(merged.site_keywords_default)
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      setKeywords(parts);
    } else {
      setKeywords([]);
    }

    // Carregar scripts dinâmicos a partir de JSON, se existir
    const rawJson = (map.custom_scripts_json as string) || "";
    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson) as ScriptItem[];
        if (Array.isArray(parsed)) {
          setScripts(
            parsed.map((s) => ({
              id: s.id || crypto.randomUUID(),
              name: s.name || "",
              position: (s.position as ScriptPosition) || "H",
              code: s.code || "",
            })),
          );
        }
      } catch {
        // se der erro, começa vazio
        setScripts([]);
      }
    } else {
      setScripts([]);
    }
  }, [data]);

  const addScript = () => {
    setScripts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        position: "H",
        code: "",
      },
    ]);
  };

  const updateScript = (id: string, patch: Partial<ScriptItem>) => {
    setScripts((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeScript = (id: string) => {
    setScripts((prev) => prev.filter((item) => item.id !== id));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Montar blocos de head/body a partir dos scripts
      const headScripts = scripts
        .filter((s) => s.position === "H" && s.code.trim())
        .map((s) => {
          const name = s.name?.trim() || "Script";
          const code = s.code.trim();
          return `<!-- start: ${name} -->\n${code}\n<!-- end: ${name} -->`;
        })
        .join("\n\n");

      const bodyScripts = scripts
        .filter((s) => s.position === "OB" || s.position === "F")
        .filter((s) => s.code.trim())
        .map((s) => {
          const name = s.name?.trim() || "Script";
          const code = s.code.trim();
          return `<!-- start: ${name} -->\n${code}\n<!-- end: ${name} -->`;
        })
        .join("\n\n");

      const payload: SeoScriptsConfig = {
        ...configs,
        site_keywords_default: keywords.join(", "),
        custom_scripts_json: JSON.stringify(scripts),
      };

      const entries = Object.entries(payload) as [keyof SeoScriptsConfig, string][];

      // Salvar campos de SEO
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from("st_config")
          .upsert({ key, value, description: "" }, { onConflict: "key" });
        if (error) throw error;
      }

      // Salvar blocos agregados (consumidos pelo TrackingScripts)
      const aggregated = [
        { key: "custom_head_scripts", value: headScripts },
        { key: "custom_body_scripts", value: bodyScripts },
      ];

      for (const item of aggregated) {
        const { error } = await supabase
          .from("st_config")
          .upsert({ key: item.key, value: item.value, description: "" }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["st_config"] });
      toast.success("Tags de SEO e scripts salvos com sucesso");
    },
    onError: () => {
      toast.error("Erro ao salvar tags de SEO e scripts");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "hsl(var(--admin-muted))" }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "hsl(var(--admin-text))" }}>
            Tags de SEO e Scripts de Monitoramento
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted))" }}>
            Cadastre aqui as tags de SEO para ranqueamento orgânico e os scripts de monitoramento
            (Google, Meta, etc.) que serão injetados em todo o site.
          </p>
        </div>

        <button
          onClick={() => saveMutation.mutate()}
          className="admin-btn admin-btn-primary"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <ConfigCard title="Tags de SEO" icon={Search}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label>Título Padrão da Página</Label>
            <Input
              value={configs.site_title_default}
              onChange={(e) =>
                setConfigs({
                  ...configs,
                  site_title_default: e.target.value,
                })
              }
              placeholder="Título padrão exibido nas páginas"
            />
          </div>
          <div className="md:col-span-1">
            <Label>Autor Padrão</Label>
            <Input
              value={configs.site_author_default}
              onChange={(e) =>
                setConfigs({
                  ...configs,
                  site_author_default: e.target.value,
                })
              }
              placeholder="Ex: Casteval"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <Label>Palavras-chave</Label>
            <div
              className="admin-input flex flex-wrap gap-2 min-h-[40px] cursor-text"
              onClick={() => {
                const el = document.getElementById("keywords-input");
                el?.focus();
              }}
            >
              {keywords.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "hsla(var(--admin-brand), 0.12)",
                    color: "hsl(var(--admin-text))",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setKeywords((prev) => prev.filter((k) => k !== tag));
                    }}
                    className="ml-1"
                    style={{ lineHeight: 0 }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                id="keywords-input"
                type="text"
                className="bg-transparent border-none outline-none text-xs flex-1 min-w-[80px]"
                placeholder={keywords.length === 0 ? "Digite e pressione Enter ou vírgula" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const value = (e.currentTarget.value || "").trim();
                    if (value && !keywords.includes(value)) {
                      const next = [...keywords, value];
                      setKeywords(next);
                    }
                    e.currentTarget.value = "";
                  }
                  if (e.key === "Backspace" && !e.currentTarget.value && keywords.length) {
                    const next = keywords.slice(0, -1);
                    setKeywords(next);
                  }
                }}
                onBlur={(e) => {
                  const value = (e.currentTarget.value || "").trim();
                  if (value && !keywords.includes(value)) {
                    const next = [...keywords, value];
                    setKeywords(next);
                  }
                  e.currentTarget.value = "";
                }}
              />
            </div>
            <p className="text-xs" style={{ color: "hsl(var(--admin-muted))" }}>
              Digite a palavra-chave e pressione Enter ou vírgula para adicionar.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Label>Descrição Padrão do Site</Label>
          <Textarea
            value={configs.site_description_default}
            onChange={(e) =>
              setConfigs({
                ...configs,
                site_description_default: e.target.value,
              })
            }
            rows={3}
            placeholder="Descrição que será usada como fallback quando uma página não tiver descrição específica."
          />
          <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted))" }}>
            Máximo recomendado: 160 caracteres.
          </p>
        </div>
      </ConfigCard>

      <ConfigCard title="Scripts de Monitoramento" icon={Code}>
        <div
          className="p-3 rounded text-sm mb-4"
          style={{ background: "hsl(var(--admin-surface-2))", color: "hsl(var(--admin-muted))" }}
        >
          Adicione quantos scripts quiser, definindo o nome, a posição (Head, After Open Body ou
          Footer) e o código completo.
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={addScript}
            className="admin-btn admin-btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Script
          </button>

          {scripts.length === 0 && (
            <p className="text-sm" style={{ color: "hsl(var(--admin-muted))" }}>
              Nenhum script cadastrado. Clique em &quot;Adicionar Script&quot; para começar.
            </p>
          )}

          {scripts.map((item) => (
            <div
              key={item.id}
              className="space-y-3 border rounded-lg p-3"
              style={{ borderColor: "hsl(var(--admin-line))" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="space-y-1 md:col-span-2">
                  <Label>Nome</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateScript(item.id, { name: e.target.value })}
                    placeholder="Ex: Meta Pixel, RD Station..."
                  />
                </div>
                <div className="space-y-1 md:col-span-1">
                  <Label>Posição</Label>
                  <select
                    className="admin-input w-full"
                    value={item.position}
                    onChange={(e) =>
                      updateScript(item.id, { position: e.target.value as ScriptPosition })
                    }
                  >
                    <option value="H">Head</option>
                    <option value="OB">After Open Body</option>
                    <option value="F">Footer</option>
                  </select>
                </div>
                <div className="flex items-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => removeScript(item.id)}
                    className="admin-btn admin-btn-danger w-full flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover Script
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Script</Label>
                <Textarea
                  value={item.code}
                  onChange={(e) => updateScript(item.id, { code: e.target.value })}
                  rows={3}
                  className="font-mono text-xs"
                  spellCheck={false}
                  style={{
                    background: "hsl(var(--admin-surface-2))",
                    borderColor: "hsl(var(--admin-line))",
                    color: "hsl(var(--admin-text))",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    lineHeight: "1.5",
                    padding: "10px 12px",
                    resize: "vertical",
                    whiteSpace: "pre",
                  }}
                  placeholder="<script>...</script>"
                />
              </div>
            </div>
          ))}
        </div>
      </ConfigCard>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          background: "hsl(var(--admin-surface))",
          borderColor: "hsl(var(--admin-line))",
          boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="admin-container py-4 flex items-center justify-end max-w-5xl">
          <button
            onClick={() => saveMutation.mutate()}
            className="admin-btn admin-btn-primary"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Salvando..." : "Salvar Tags de SEO e Scripts"}
          </button>
        </div>
      </div>
    </div>
  );
}

