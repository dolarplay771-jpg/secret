# Secret

Sistema de gerenciamento pessoal com **Next.js, React, TypeScript, Tailwind CSS e Supabase**.

O Secret organiza a rotina em quatro areas: tarefas da semana, financas pessoais, estudos, metas e conquistas. A interface foi criada mobile first, com visual premium minimalista em branco, preto profundo e acentos em laranja com gradiente, incluindo modo claro e modo escuro.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth e Database
- Zustand com persistencia local
- React Hook Form + Zod
- Recharts
- Framer Motion
- Lucide React
- PWA basico com manifest e service worker

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Sem variaveis do Supabase, o app roda em modo demo com dados persistidos no navegador.

## Conectar Supabase

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env.local`.
3. Preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Rode o SQL em `supabase/schema.sql` no SQL Editor do Supabase.
5. Reinicie o servidor local.

## Estrutura

```txt
src/
  app/
    dashboard/
    tasks/
    finances/
    studies/
    goals/
    login/
    register/
  components/
    auth/
    ui/
    layout/
    dashboard/
    tasks/
    finances/
    studies/
    goals/
    pwa/
  lib/
    supabase/
    validations/
    data.ts
    utils.ts
  stores/
  types/
supabase/
  schema.sql
```

## Design system

Os tokens principais ficam em `src/app/globals.css`:

- Cores semanticas: `background`, `surface`, `muted`, `line`, `foreground`
- Raios: `--radius-sm`, `--radius-md`, `--radius-lg`
- Sombras: `--shadow-soft`, `--shadow-gold`, `--shadow-reactor`
- Utilitarios visuais: `secret-grid`, `gold-text`, `gold-hairline`, `glass-noise`, `hud-panel`, `hud-readout`

A direcao visual atual segue uma estetica minimalista inspirada em produtos premium: fundos claros no light mode, preto profundo no dark mode, superficies discretas, acoes principais em laranja degradê, bordas suaves e bastante respiro.

O modo escuro usa os mesmos tokens semanticos via classe `dark` no elemento `html`. O tema fica salvo em `localStorage` com a chave `secret-theme` e tambem respeita a preferencia do sistema no primeiro acesso.

O service worker de PWA registra apenas em producao para evitar cache antigo durante o desenvolvimento local.

Componentes base ficam em `src/components/ui`:

- `Button`
- `Card`
- `Badge`
- `IconFrame`
- `EmptyState`
- `Input`, `Select`, `Textarea`, `Label`, `FieldError`
- `PageHeader`
- `SectionHeading`
- `Progress`
- `StatCard`

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
