/**
 * Mesmo valor usado no app do diretório (`diretorio-casteval`) em `profiles.role`.
 * Quem tem só essa role acessa o drive, não o painel do site — verificação em AuthContext.
 */
export const DIRECTORY_MEMBER_PROFILE_ROLE = 'directory_member' as const;
