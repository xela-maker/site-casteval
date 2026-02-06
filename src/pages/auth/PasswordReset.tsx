import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      toast.error('Erro ao enviar email', {
        description: error.message
      });
    } else {
      setEmailSent(true);
      toast.success('Email enviado!', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.'
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-lg shadow-lg border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Recuperar Senha</h1>
            <p className="text-muted-foreground">
              {emailSent 
                ? 'Email enviado com sucesso!' 
                : 'Digite seu email para receber o link de recuperação'}
            </p>
          </div>

          {!emailSent ? (
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Clique no link do email para redefinir sua senha.
              </p>
              <Button 
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Enviar Novamente
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm space-y-2">
            <Link to="/auth/login" className="text-primary hover:underline block">
              ← Voltar para o login
            </Link>
            <Link to="/" className="text-muted-foreground hover:underline block">
              Ir para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
