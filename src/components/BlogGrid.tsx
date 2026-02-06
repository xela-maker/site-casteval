import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getImageUrl } from "@/lib/imageUtils";
import fotoLivro03 from "@/assets/foto-livro-03.webp";

export const BlogGrid = () => {
  const { data, isLoading } = useBlogPosts({ 
    is_published: true, 
    pageSize: 9 
  });
  
  const posts = data?.data || [];
  return (
    <section className="mobile:py-24 desktop:py-32 bg-surface-50">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="grid desktop:grid-cols-3 mobile:grid-cols-1 gap-32">
          {/* Coluna esquerda e central: Posts do Blog (2 colunas) */}
          <div className="desktop:col-span-2">
            {isLoading ? (
              <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 mobile:gap-24 desktop:gap-32">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-16">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-16 w-24" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-3/4" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-64">
                <p className="text-ink-600 text-body-l">Nenhum post publicado ainda</p>
              </div>
            ) : (
              <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 mobile:gap-24 desktop:gap-32">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="bg-surface-0 rounded-lg shadow-card-rest hover:shadow-card-hover transition-shadow duration-300 overflow-hidden block"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={getImageUrl(post.imagem_card) || "/placeholder.svg"} 
                        alt={post.titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.categoria}
                      </Badge>
                      <h3 className="text-h3 font-semibold text-ink-800 mb-3 line-clamp-2">
                        {post.titulo}
                      </h3>
                      <p className="text-body-s text-ink-600 mb-4 line-clamp-3">
                        {post.resumo}
                      </p>
                      <div className="flex items-center justify-between text-caption text-ink-500">
                        <span>
                          {post.data_publicacao 
                            ? format(new Date(post.data_publicacao), "dd 'de' MMMM, yyyy", { locale: ptBR })
                            : "Data não informada"}
                        </span>
                        <span>{post.autor_nome || "Equipe Casteval"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita: Livro Casteval */}
          <aside className="desktop:sticky desktop:top-24 desktop:self-start">
            <div className="bg-ink-900 rounded-lg p-6 shadow-card-rest">
              <img 
                src={fotoLivro03} 
                alt="História da Casteval - 60 anos de tradição" 
                className="w-full h-auto rounded-lg shadow-lg mb-4"
              />
              <p className="text-brand-gold text-caption font-bold tracking-overline uppercase mb-3">
                LIVRO CASTEVAL
              </p>
              <h3 className="text-h3 font-bold text-white mb-4">
                Uma história construída com sucesso
              </h3>
              <p className="text-body-s text-white/85 mb-4 leading-relaxed">
                Nossa forte raiz, imagem e desempenho mostram como a Casteval ajudou a 
                desenhar bairros e modas em Curitiba.
              </p>
              <p className="text-body-s text-white/75 mb-6 leading-relaxed">
                Baixe gratuitamente ou leia online e compartilhe com clientes e parceiros.
              </p>
              <Button 
                className="w-full bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold shadow-card-rest hover:shadow-card-hover rounded-pill"
              >
                BAIXE O LIVRO GRATUITAMENTE
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};