import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/EmptyState";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useBannersHome, useDeleteBanner, useReorderBanners } from "@/hooks/useBannersHome";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

export default function Banners() {
  const navigate = useNavigate();
  const { data: banners, isLoading } = useBannersHome(true);
  const deleteMutation = useDeleteBanner();
  const reorderMutation = useReorderBanners();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !banners) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      ordem: index + 1,
    }));

    reorderMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 style={{ color: "hsl(var(--admin-text))", fontSize: "24px", fontWeight: 600 }}>
            Banners Home
          </h1>
        </div>
        <div style={{ color: "hsl(var(--admin-muted))" }}>Carregando...</div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 style={{ color: "hsl(var(--admin-text))", fontSize: "24px", fontWeight: 600 }}>
            Banners Home
          </h1>
          <Button className="admin-btn-primary" onClick={() => navigate("/admin/banners/novo")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Banner
          </Button>
        </div>
        <EmptyState
          icon={Plus}
          title="Nenhum banner cadastrado"
          description="Crie seu primeiro banner para aparecer na home"
          actionLabel="Criar Banner"
          onAction={() => navigate("/admin/banners/novo")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 style={{ color: "hsl(var(--admin-text))", fontSize: "24px", fontWeight: 600 }}>
          Banners Home
        </h1>
        <Button className="admin-btn-primary" onClick={() => navigate("/admin/banners/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Banner
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {banners.map((banner, index) => (
                <Draggable key={banner.id} draggableId={banner.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        background: "hsl(var(--admin-surface))",
                        border: "1px solid hsl(var(--admin-line))",
                        borderRadius: "8px",
                        padding: "16px",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5" style={{ color: "hsl(var(--admin-muted))" }} />
                        </div>

                        <div
                          style={{
                            width: "120px",
                            height: "80px",
                            borderRadius: "4px",
                            overflow: "hidden",
                            background: "hsl(var(--admin-bg))",
                          }}
                        >
                          <img
                            src={banner.background_image}
                            alt={banner.titulo}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>

                        <div className="flex-1">
                          <h3 style={{ color: "hsl(var(--admin-text))", fontWeight: 600, marginBottom: "4px" }}>
                            {banner.titulo}
                          </h3>
                          {banner.subtitulo && (
                            <p style={{ color: "hsl(var(--admin-muted))", fontSize: "14px" }}>
                              {banner.subtitulo}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              style={{
                                fontSize: "12px",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: banner.is_active ? "hsl(var(--admin-success) / 0.1)" : "hsl(var(--admin-muted) / 0.1)",
                                color: banner.is_active ? "hsl(var(--admin-success))" : "hsl(var(--admin-muted))",
                              }}
                            >
                              {banner.is_active ? "Ativo" : "Inativo"}
                            </span>
                            <span style={{ fontSize: "12px", color: "hsl(var(--admin-muted))" }}>
                              Ordem: {banner.ordem}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/banners/${banner.id}`)}
                            style={{ borderColor: "hsl(var(--admin-line))" }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(banner.id)}
                            style={{ borderColor: "hsl(var(--admin-line))", color: "hsl(var(--admin-error))" }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Banner"
        description="Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
