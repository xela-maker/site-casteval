/**
 * Valor legado / opcional em `profiles.role` se o banco permitir no CHECK.
 * Na prática o painel marca membro do drive por `signup_origin === 'diretorio'` no JWT/metadata
 * ou por esta coluna quando existir e for permitida pela constraint `profiles_role_check`.
 */
export const DIRECTORY_MEMBER_PROFILE_ROLE = 'directory_member' as const;
