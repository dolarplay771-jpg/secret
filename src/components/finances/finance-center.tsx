"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currentMonth, formatCurrency, formatDate, todayIsoDate } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { useSecretStore } from "@/stores/use-secret-store";
import {
  financeTransactionSchema,
  type FinanceTransactionFormValues,
} from "@/lib/validations/secret";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";

const transactionDefaults: FinanceTransactionFormValues = {
  amount: 0,
  category_id: "food",
  date: todayIsoDate(),
  notes: "",
  title: "",
  type: "expense",
};

type ChartPayload = {
  color?: string;
  name?: string;
  value?: number | string;
  payload?: {
    color?: string;
    fill?: string;
    name?: string;
  };
};

function daysInSelectedMonth(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);

  return new Date(year, monthIndex, 0).getDate();
}

function chartDate(month: string, day: number) {
  return `${month}-${String(day).padStart(2, "0")}`;
}

function MoneyTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: ChartPayload[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-line bg-surface/95 p-3 text-xs shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      {label ? (
        <p className="mb-2 font-semibold text-foreground">{label}</p>
      ) : null}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div className="flex min-w-40 items-center justify-between gap-4" key={item.name}>
            <span className="flex items-center gap-2 text-muted">
              <span
                className="size-2 rounded-full"
                style={{
                  background:
                    item.color ??
                    item.payload?.fill ??
                    item.payload?.color ??
                    "var(--gold)",
                }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinanceCenter() {
  const mounted = useMounted();
  const transactions = useSecretStore((state) => state.transactions);
  const categories = useSecretStore((state) => state.financeCategories);
  const selectedMonth = useSecretStore((state) => state.selectedMonth);
  const setSelectedMonth = useSecretStore((state) => state.setSelectedMonth);
  const addTransaction = useSecretStore((state) => state.addTransaction);
  const deleteTransaction = useSecretStore((state) => state.deleteTransaction);

  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<FinanceTransactionFormValues>({
    defaultValues: transactionDefaults,
    resolver: zodResolver(financeTransactionSchema),
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const availableCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.type === selectedType || category.type === "both",
      ),
    [categories, selectedType],
  );

  useEffect(() => {
    const firstCategory = availableCategories[0];

    if (
      firstCategory &&
      !availableCategories.some((category) => category.id === selectedCategoryId)
    ) {
      setValue("category_id", firstCategory.id, {
        shouldValidate: true,
      });
    }
  }, [availableCategories, selectedCategoryId, setValue]);

  const monthTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.date.startsWith(selectedMonth))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [selectedMonth, transactions],
  );

  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = income - expenses;
  const savedRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const radialSavings = Math.max(0, Math.min(100, savedRate));
  const monthExpenseTotal = Math.max(expenses, 1);
  const maxTransactionDay = monthTransactions.reduce((max, transaction) => {
    const day = Number(transaction.date.slice(8, 10));

    return Number.isFinite(day) ? Math.max(max, day) : max;
  }, 1);
  const dayLimit =
    selectedMonth === currentMonth()
      ? Math.max(new Date().getDate(), maxTransactionDay)
      : daysInSelectedMonth(selectedMonth);

  const cashflowData = Array.from({ length: dayLimit }).reduce<{
    balance: number;
    data: Array<{
      day: string;
      Entradas: number;
      Saidas: number;
      Saldo: number;
    }>;
  }>(
    (acc, _, index) => {
      const day = index + 1;
      const date = chartDate(selectedMonth, day);
      const dayTransactions = monthTransactions.filter(
        (transaction) => transaction.date === date,
      );
      const dayIncome = dayTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const dayExpenses = dayTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const nextBalance = acc.balance + dayIncome - dayExpenses;

      return {
        balance: nextBalance,
        data: [
          ...acc.data,
          {
            day: String(day).padStart(2, "0"),
            Entradas: dayIncome,
            Saidas: dayExpenses,
            Saldo: nextBalance,
          },
        ],
      };
    },
    { balance: 0, data: [] },
  ).data;

  const expenseByCategory = categories
    .map((category) => {
      const value = monthTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category_id === category.id,
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        color: category.color,
        name: category.name,
        share: Math.round((value / monthExpenseTotal) * 100),
        value,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const flowData = [
    { name: "Entradas", value: income, fill: "var(--chart-income)" },
    { name: "Saidas", value: expenses, fill: "var(--chart-expense)" },
    {
      name: "Resultado",
      value: Math.abs(balance),
      fill: balance >= 0 ? "var(--chart-balance)" : "var(--chart-rose)",
    },
  ];
  const radialSavingsData = [
    {
      fill: savedRate >= 0 ? "var(--chart-income)" : "var(--chart-rose)",
      name: "Economia",
      value: radialSavings,
    },
  ];

  function onSubmit(values: FinanceTransactionFormValues) {
    addTransaction(values);
    reset({
      ...transactionDefaults,
      date: todayIsoDate(),
      type: values.type,
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        description="Registre entradas e saidas, acompanhe o mes e entenda rapidamente para onde o dinheiro esta indo."
        eyebrow="Financas pessoais"
        title="Dinheiro claro, decisoes melhores."
        actions={
          <Input
            aria-label="Selecionar mes"
            className="h-11 w-full min-w-44"
            max={currentMonth()}
            onChange={(event) => setSelectedMonth(event.target.value)}
            type="month"
            value={selectedMonth}
          />
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="Resultado entre entradas e saidas"
          icon={WalletCards}
          label="Saldo do mes"
          tone={balance >= 0 ? "green" : "rose"}
          value={formatCurrency(balance)}
        />
        <StatCard
          detail="Receitas registradas no periodo"
          icon={ArrowUpRight}
          label="Entradas"
          tone="green"
          value={formatCurrency(income)}
        />
        <StatCard
          detail="Despesas e aportes do periodo"
          icon={ArrowDownRight}
          label="Saidas"
          tone="gold"
          value={formatCurrency(expenses)}
        />
        <StatCard
          detail={savedRate >= 0 ? "Margem positiva do mes" : "Atencao ao ritmo"}
          icon={PiggyBank}
          label="Economia"
          tone={savedRate >= 0 ? "blue" : "rose"}
          value={`${savedRate}%`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(320px,0.62fr)_minmax(0,1.38fr)]">
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <Card className="p-4" variant="raised">
          <SectionHeading
            eyebrow="Novo lancamento"
            title="Controle no detalhe"
          />

          <form className="mt-4 space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Tipo</Label>
                <Select {...register("type")}>
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </Select>
                <FieldError message={errors.type?.message} />
              </div>

              <div>
                <Label>Valor</Label>
                <Input
                  min="0"
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                />
                <FieldError message={errors.amount?.message} />
              </div>
            </div>

            <div>
              <Label>Descricao</Label>
              <Input placeholder="Ex: Mercado da semana" {...register("title")} />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Categoria</Label>
                <Select {...register("category_id")}>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.category_id?.message} />
              </div>
              <div>
                <Label>Data</Label>
                <Input type="date" {...register("date")} />
                <FieldError message={errors.date?.message} />
              </div>
            </div>

            <div>
              <Label>Notas</Label>
              <Textarea
                placeholder="Opcional: contexto, parcela, decisao ou alerta"
                {...register("notes")}
              />
              <FieldError message={errors.notes?.message} />
            </div>

            <Button className="w-full" type="submit">
              <Plus aria-hidden className="size-4" />
              Registrar movimento
            </Button>
          </form>
        </Card>

        <Card className="p-4" variant="raised">
          <SectionHeading
            action={<Badge tone={savedRate >= 0 ? "green" : "rose"}>{savedRate}%</Badge>}
            eyebrow="Saude do mes"
            title={savedRate >= 0 ? "Margem positiva" : "Ritmo de alerta"}
          />

          <div className="mt-3 grid grid-cols-[7.5rem_1fr] items-center gap-3">
            <div className="relative h-28">
              {mounted ? (
                <ResponsiveContainer height="100%" width="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    data={radialSavingsData}
                    endAngle={-270}
                    innerRadius="72%"
                    outerRadius="100%"
                    startAngle={90}
                  >
                    <RadialBar
                      background={{ fill: "rgba(127,127,127,0.12)" }}
                      cornerRadius={10}
                      dataKey="value"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold">{radialSavings}%</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Receita</span>
                <span className="font-semibold">{formatCurrency(income)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Gasto</span>
                <span className="font-semibold">{formatCurrency(expenses)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface-soft/70 px-3 py-2">
                <span className="text-muted">Saldo</span>
                <span className="font-semibold">{formatCurrency(balance)}</span>
              </div>
            </div>
          </div>
        </Card>
        </div>

        <div className="grid gap-4">
          <Card className="p-4 md:p-5" variant="raised">
            <SectionHeading
              action={<Badge tone="blue">{dayLimit} dias</Badge>}
              eyebrow="Fluxo diario"
              title="Entradas, saidas e saldo acumulado"
            />

            <div className="mt-4 h-72">
              {mounted ? (
                <ResponsiveContainer height="100%" width="100%">
                  <AreaChart data={cashflowData} margin={{ left: 0, right: 4 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-income)" stopOpacity={0.36} />
                        <stop offset="95%" stopColor="var(--chart-income)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-expense)" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="var(--chart-expense)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="balanceGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-balance)" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="var(--chart-balance)" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--line)" strokeDasharray="3 6" vertical={false} />
                    <XAxis
                      axisLine={false}
                      dataKey="day"
                      minTickGap={16}
                      tick={{ fill: "var(--muted)", fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 11 }}
                      tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                      tickLine={false}
                      width={42}
                    />
                    <Tooltip content={<MoneyTooltip />} />
                    <Area
                      dataKey="Entradas"
                      fill="url(#incomeGradient)"
                      stroke="var(--chart-income)"
                      strokeWidth={2.4}
                      type="monotone"
                    />
                    <Area
                      dataKey="Saidas"
                      fill="url(#expenseGradient)"
                      stroke="var(--chart-expense)"
                      strokeWidth={2.4}
                      type="monotone"
                    />
                    <Area
                      dataKey="Saldo"
                      fill="url(#balanceGradient)"
                      stroke="var(--chart-balance)"
                      strokeWidth={2.8}
                      type="monotone"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  className="h-full"
                  description="A visualizacao sera exibida em instantes."
                  icon={WalletCards}
                  title="Preparando grafico"
                />
              )}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="p-4" variant="raised">
              <SectionHeading
                action={<Badge tone="neutral">{expenseByCategory.length} grupos</Badge>}
                eyebrow="Gastos por categoria"
                title="Composicao"
              />

              <div className="mt-4 h-64">
                {mounted && expenseByCategory.length ? (
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={expenseByCategory}
                        dataKey="value"
                        innerRadius="58%"
                        nameKey="name"
                        outerRadius="84%"
                        paddingAngle={3}
                        stroke="var(--surface)"
                        strokeWidth={4}
                      >
                        {expenseByCategory.map((entry) => (
                          <Cell fill={entry.color} key={entry.name} />
                        ))}
                      </Pie>
                      <Tooltip content={<MoneyTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    className="h-full"
                    description={
                      expenseByCategory.length
                        ? "A visualizacao sera exibida em instantes."
                        : "Registre uma despesa para formar o mapa."
                    }
                    icon={WalletCards}
                    title={
                      expenseByCategory.length
                        ? "Preparando grafico"
                        : "Sem despesas no mes"
                    }
                  />
                )}
              </div>
            </Card>

            <Card className="p-4" variant="raised">
              <SectionHeading eyebrow="Resumo comparativo" title="Mes em barras" />
              <div className="mt-4 h-44">
                {mounted ? (
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={flowData} margin={{ left: 0, right: 4 }}>
                      <CartesianGrid stroke="var(--line)" strokeDasharray="3 6" vertical={false} />
                      <XAxis
                        axisLine={false}
                        dataKey="name"
                        tick={{ fill: "var(--muted)", fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        tick={{ fill: "var(--muted)", fontSize: 11 }}
                        tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                        tickLine={false}
                        width={42}
                      />
                      <Tooltip content={<MoneyTooltip />} />
                      <Bar dataKey="value" radius={[10, 10, 4, 4]}>
                        {flowData.map((entry) => (
                          <Cell fill={entry.fill} key={entry.name} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    className="h-full"
                    description="A visualizacao sera exibida em instantes."
                    icon={WalletCards}
                    title="Preparando grafico"
                  />
                )}
              </div>

              <div className="mt-4 space-y-2">
                {expenseByCategory.slice(0, 4).map((category) => (
                  <div
                    className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs"
                    key={category.name}
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: category.color }}
                        />
                        <span className="truncate font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: category.color,
                            width: `${category.share}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-semibold text-muted-strong">
                      {category.share}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Card className="p-4" variant="raised">
        <SectionHeading
          eyebrow="Historico"
          title={`Movimentos de ${selectedMonth}`}
        />

        <div className="mt-4 space-y-2">
          {monthTransactions.map((transaction) => {
            const category = categories.find(
              (item) => item.id === transaction.category_id,
            );

            return (
              <div
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface p-3 shadow-[0_10px_28px_rgba(0,0,0,0.04)] transition hover:bg-surface-soft"
                key={transaction.id}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: category?.color ?? "var(--gold)" }}
                    />
                    <p className="truncate text-sm font-semibold">
                      {transaction.title}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {category?.name ?? "Categoria"} - {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      transaction.type === "income"
                        ? "text-sm font-semibold text-foreground"
                        : "text-sm font-semibold text-muted-strong"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    aria-label="Excluir lancamento"
                    onClick={() => deleteTransaction(transaction.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {monthTransactions.length === 0 ? (
            <EmptyState
              className="border-0 bg-surface-soft"
              description="Adicione receitas ou despesas para acompanhar o periodo."
              icon={WalletCards}
              title="Sem lancamentos para este mes"
            />
          ) : null}
        </div>
      </Card>
    </div>
  );
}
