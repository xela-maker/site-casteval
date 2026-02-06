import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Copy, Trash } from 'lucide-react';

interface FormTab {
  value: string;
  label: string;
  content: ReactNode;
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
}

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
}: FormBaseProps) => {
  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue={tabs[0].value} className="w-full">
        <TabsList className="w-full justify-start">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating Action Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          background: 'hsl(var(--admin-surface))',
          borderColor: 'hsl(var(--admin-line))',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="admin-container py-4 flex items-center justify-between max-w-5xl">
          <div className="flex gap-2">
            {showDelete && (
              <Button
                variant="outline"
                onClick={onDelete}
                disabled={isLoading}
                style={{ color: 'hsl(var(--admin-danger))' }}
              >
                <Trash className="admin-icon-sm mr-2" />
                Excluir
              </Button>
            )}
            {showDuplicate && (
              <Button
                variant="outline"
                onClick={onDuplicate}
                disabled={isLoading}
              >
                <Copy className="admin-icon-sm mr-2" />
                Duplicar
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {onSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isLoading}
              >
                <Save className="admin-icon-sm mr-2" />
                Salvar Rascunho
              </Button>
            )}
            {showPreview && onPreview && (
              <Button
                variant="outline"
                onClick={onPreview}
                disabled={isLoading}
              >
                <Eye className="admin-icon-sm mr-2" />
                Visualizar
              </Button>
            )}
            {onPublish && (
              <Button
                className="admin-btn-primary"
                onClick={onPublish}
                disabled={isLoading}
              >
                Publicar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
