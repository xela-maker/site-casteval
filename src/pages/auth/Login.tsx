import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { hasStaffPanelAccess } from '@/lib/staffRoles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isAdmin, isEditor, rolesReady, signOut } = useAuth();
  const navigate = useNavigate();
  const deniedToastRef = useRef(false);

  // Já logado: só entra no painel com admin/editor; senão encerra sessão nesta tela.
  useEffect(() => {
    if (!user) {
      deniedToastRef.current = false;
      return;
    }
    if (!rolesReady) return;

    if (isAdmin || isEditor) {
      navigate('/admin', { replace: true });
      return;
    }

    if (deniedToastRef.current) {
      return;
    }
    deniedToastRef.current = true;
    void signOut();
    toast.error('Acesso negado ao painel', {
      description:
        'Esta conta não tem permissão de administrador ou editor. O painel é só para a equipe autorizada.',
    });
  }, [user, rolesReady, isAdmin, isEditor, navigate, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error('Erro ao fazer login', {
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message
      });
      setIsLoading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) {
      toast.error('Não foi possível iniciar a sessão');
      setIsLoading(false);
      return;
    }

    const { data: roleRows, error: rolesError } = await supabase
      .from('st_user_roles')
      .select('role')
      .eq('user_id', uid);

    if (rolesError) {
      deniedToastRef.current = true;
      await signOut();
      toast.error('Não foi possível verificar permissões', {
        description: rolesError.message,
      });
      setIsLoading(false);
      return;
    }

    if (!hasStaffPanelAccess(roleRows)) {
      deniedToastRef.current = true;
      await signOut();
      toast.error('Acesso negado ao painel', {
        description:
          'Sua conta não possui permissão. Solicite acesso à equipe Casteval.',
      });
      setIsLoading(false);
      return;
    }

    toast.success('Login realizado com sucesso!');
    navigate('/admin', { replace: true });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-lg shadow-lg border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Casteval Admin</h1>
            <p className="text-muted-foreground">Faça login para acessar o painel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/auth/password-reset" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-primary hover:underline">
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
