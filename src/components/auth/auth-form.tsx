"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  authSchema,
  type AuthFormInputValues,
  type AuthFormValues,
} from "@/lib/validations/secret";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<AuthFormInputValues, unknown, AuthFormValues>({
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
    },
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(values: AuthFormValues) {
    setLoading(true);
    setStatus(null);

    if (mode === "register" && !values.full_name) {
      setError("full_name", {
        message: "Informe seu nome.",
        type: "manual",
      });
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus(
        "Modo demo ativo. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar Auth real.",
      );
      setTimeout(() => router.push("/dashboard"), 650);
      setLoading(false);
      return;
    }

    const response =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        : await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                full_name: values.full_name,
              },
            },
          });

    if (response.error) {
      setStatus(response.error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 secret-grid">
      <PageTransition className="w-full max-w-md">
        <Card className="glass-noise w-full p-5 md:p-6" variant="raised">
          <div className="flex items-center gap-3">
            <Image
              alt=""
              aria-hidden
              className="h-12 w-7 object-contain drop-shadow-[0_12px_26px_rgba(255,122,24,0.2)]"
              height={48}
              priority
              src="/logo-mark.png"
              width={28}
            />
            <p className="text-2xl font-semibold gold-text">Secret</p>
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase text-muted">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              {mode === "login"
                ? "Volte para o controle."
                : "Comece com clareza."}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {mode === "login"
                ? "Acesse suas tarefas, financas e estudos em uma unica visao."
                : "Crie seu acesso e conecte seus dados ao Supabase."}
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {mode === "register" ? (
              <div>
                <Label>Nome</Label>
                <Input placeholder="Seu nome" {...register("full_name")} />
                <FieldError message={errors.full_name?.message} />
              </div>
            ) : null}

            <div>
              <Label>E-mail</Label>
              <div className="relative">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                />
                <Input
                  className="pl-9"
                  placeholder="voce@email.com"
                  type="email"
                  {...register("email")}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <Label>Senha</Label>
              <div className="relative">
                <KeyRound
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                />
                <Input
                  className="pl-9"
                  placeholder="Minimo 6 caracteres"
                  type="password"
                  {...register("password")}
                />
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            {status ? (
              <p className="rounded-[var(--radius-md)] border border-line bg-surface-soft p-3 text-sm leading-6 text-foreground">
                {status}
              </p>
            ) : null}

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : null}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <Link className="font-semibold text-foreground" href="/dashboard">
              Usar demo
            </Link>
            <Link
              className="text-muted transition hover:text-foreground"
              href={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Criar conta" : "Ja tenho conta"}
            </Link>
          </div>
        </Card>
      </PageTransition>
    </main>
  );
}
