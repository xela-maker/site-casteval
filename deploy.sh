#!/usr/bin/env bash
set -e

MAIN_BRANCH="main"
DEPLOY_BRANCH="deploy"
TEMP_DIR="/tmp/vite-react-deploy-build"

SERVER_USER="u365092948"
SERVER_HOST="147.93.34.148"
SERVER_PORT="65002"
SERVER_PATH="domains/casteval.com.br/public_html/"

CURRENT_BRANCH=$(git branch --show-current)

cleanup() {
  git checkout "${CURRENT_BRANCH}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo ">> Validando estado do repositório"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Erro: há alterações locais não commitadas."
  echo "Commit, stash ou descarte antes de rodar o deploy."
  exit 1
fi

echo ">> Indo para ${MAIN_BRANCH}"
git checkout "${MAIN_BRANCH}"
git pull origin "${MAIN_BRANCH}"

echo ">> Validando .env (build injeta as variáveis no JS)"
if [[ ! -f .env ]]; then
  echo "Erro: .env não encontrado. Crie o arquivo com as variáveis necessárias para o Vite."
  exit 1
fi

echo ">> Instalando dependências"
npm install

echo ">> Gerando build (variáveis do .env são injetadas no bundle)"
npm run build

echo ">> Preparando arquivos temporários"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
cp -r dist/* "${TEMP_DIR}/"

echo ">> Limpando dist local para permitir troca de branch"
rm -rf dist

echo ">> Indo para ${DEPLOY_BRANCH}"
git checkout "${DEPLOY_BRANCH}"

if git ls-remote --exit-code --heads origin "${DEPLOY_BRANCH}" >/dev/null 2>&1; then
  git pull origin "${DEPLOY_BRANCH}"
fi

echo ">> Limpando branch deploy (preserva .git, .gitignore, .env e node_modules para não perder ao voltar)"
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' ! -name '.env' ! -name 'node_modules' -exec rm -rf {} +

echo ">> Copiando build para a raiz da deploy"
cp -r "${TEMP_DIR}"/* .

git add .

if git diff --cached --quiet; then
  echo ">> Nenhuma alteração para publicar"
else
  MAIN_COMMIT_HASH=$(git rev-parse --short "${MAIN_BRANCH}")
  git commit -m "deploy: build from ${MAIN_BRANCH} ${MAIN_COMMIT_HASH}"
  git push origin "${DEPLOY_BRANCH}"
fi

echo ">> Atualizando servidor"
ssh -p "${SERVER_PORT}" "${SERVER_USER}@${SERVER_HOST}" "cd ${SERVER_PATH} && git pull origin ${DEPLOY_BRANCH}"

echo ">> Voltando para ${MAIN_BRANCH}"
git checkout "${MAIN_BRANCH}"

trap - EXIT
echo ">> Deploy concluído com sucesso"

