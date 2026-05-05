#!/bin/sh
set -e

echo "🌐 Verificando conexão com o banco..."
npx prisma migrate deploy

echo "🚀 Subindo Cur10usX..."
exec npx next start