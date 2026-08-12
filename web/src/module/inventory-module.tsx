import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  ShoppingBagAddIcon,
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PackageIcon,
  Edit02Icon,
  Delete02Icon,
  PackageProcessIcon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons";
import { FormInput } from "../components/global/form-input";
import { DemoFillButton } from "../components/global/demo-fill-button";
import { demoMedicineItem } from "../lib/demo-form-data";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { StatusBadge } from "../components/global/status-badge";
import { CategoryIcon } from "../components/global/category-icon";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { apiClient } from "../config/api";
import { useCart } from "../lib/cart";
import { useAppUser } from "../lib/roles";
import { cn } from "../lib/utils";
import { Route as InventoryRoute } from "../routes/inventory";

type StockLevel = "kritiek" | "laag" | "goed";

type InventoryItem = {
  itemId: number;
  itemName: string;
  description: string | null;
  remainingAmount: number;
  categoryId: number | null;
  categoryName: string | null;
  categoryIcon: string | null;
  stockLevel: "critical" | "low" | "ok" | StockLevel;
};

type Category = {
  categoryId: number;
  categoryName: string;
  categoryDescription: string | null;
  icon: string | null;
  itemCount?: number;
};

type InventorySummary = {
  totalItems: number;
  totalStock: number;
  criticalStock: number;
  lowStock: number;
};

type InventoryResponse = {
  items: InventoryItem[];
  summary: InventorySummary;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

function toUiStockLevel(level: InventoryItem["stockLevel"]): StockLevel {
  if (level === "critical" || level === "kritiek") return "kritiek";
  if (level === "low" || level === "laag") return "laag";
  return "goed";
}

export function InventoryPage() {
  const navigate = useNavigate();
  const searchParams = InventoryRoute.useSearch();
  const { addItem, productCount, totalCount } = useCart();
  const { isApotheker, role } = useAppUser();
  const canManageItems = isApotheker;
  const canAddToCart = role === "verpleging";
  const isVerpleging = role === "verpleging";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [globalSummary, setGlobalSummary] = useState<InventorySummary | null>(
    null,
  );
  const [focusItemId, setFocusItemId] = useState<number | null>(
    searchParams.itemId ?? null,
  );

  // Deep-link from dashboard: open category (+ focus item for edit)
  useEffect(() => {
    const cat = searchParams.categoryId;
    const item = searchParams.itemId;
    if (cat == null && item == null) return;

    if (cat != null) {
      setCategoryId(cat);
      setPage(1);
    }
    if (item != null) setFocusItemId(item);

    void navigate({
      to: "/inventory",
      search: {},
      replace: true,
    });
  }, [searchParams.categoryId, searchParams.itemId, navigate]);

  // Resolve category / search for focused product so it shows and can be edited
  useEffect(() => {
    if (focusItemId == null) return;

    let cancelled = false;
    apiClient(`/items/${focusItemId}`)
      .then((res) => {
        if (cancelled) return;
        const product = (res as { item: InventoryItem }).item;
        if (!product) return;
        if (product.categoryId != null) {
          setCategoryId(product.categoryId);
        }
        if (product.itemName) {
          setSearch(product.itemName);
        }
        setPage(1);
      })
      .catch(() => {
        /* keep category view even if lookup fails */
      });

    return () => {
      cancelled = true;
    };
  }, [focusItemId]);

  const refreshList = () => {
    setPage(1);
    setReloadKey((k) => k + 1);
  };

  const selectedCategory =
    categories.find((c) => c.categoryId === categoryId) ?? null;
  const inCategory = categoryId !== null;
  const searchQuery = search.trim();
  const isGlobalSearch = !inCategory && searchQuery.length > 0;
  const loadProducts = inCategory || isGlobalSearch;

  const refreshCategories = () => {
    setCategoriesLoading(true);
    apiClient("/items/categories")
      .then((res) =>
        setCategories((res as { categories: Category[] }).categories),
      )
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  };

  useEffect(() => {
    refreshCategories();
    apiClient("/items?page=1&pageSize=1")
      .then((res) =>
        setGlobalSummary((res as InventoryResponse).summary ?? null),
      )
      .catch(() => setGlobalSummary(null));
  }, [reloadKey]);

  // Products: either inside a category, or global search on the overview
  useEffect(() => {
    if (!loadProducts) {
      setData(null);
      setItemsLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setItemsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "12",
        });
        if (categoryId != null) params.set("categoryId", String(categoryId));
        if (searchQuery) params.set("search", searchQuery);

        const result = (await apiClient(
          `/items?${params.toString()}`,
        )) as InventoryResponse;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Voorraad kon niet worden geladen.");
      } finally {
        if (!cancelled) setItemsLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, categoryId, page, reloadKey, loadProducts]);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const summary = inCategory || isGlobalSearch
    ? (data?.summary ?? null)
    : globalSummary;

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery || inCategory) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.categoryName.toLowerCase().includes(q) ||
      (cat.categoryDescription ?? "").toLowerCase().includes(q)
    );
  });

  const stats = [
    {
      label: inCategory
        ? "Items in categorie"
        : isGlobalSearch
          ? "Gevonden items"
          : "Totaal items",
      value: summary?.totalItems ?? "—",
    },
    {
      label: inCategory
        ? "Voorraad in categorie"
        : isGlobalSearch
          ? "Voorraad (zoekresultaat)"
          : "Totale voorraad",
      value: summary?.totalStock ?? "—",
    },
    { label: "Kritiek", value: summary?.criticalStock ?? "—" },
    { label: "Laag", value: summary?.lowStock ?? "—" },
  ];

  const openCategory = (id: number) => {
    setCategoryId(id);
    setPage(1);
    setSearch("");
  };

  const backToCategories = () => {
    setCategoryId(null);
    setPage(1);
    setSearch("");
    setData(null);
    setError("");
  };

  const renderItemCard = (item: InventoryItem) => (
    <article
      key={item.itemId}
      id={`inventory-item-${item.itemId}`}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-800",
        focusItemId === item.itemId
          ? "border-sky-400 ring-2 ring-sky-300/50 dark:border-sky-500"
          : "border-slate-200/80 dark:border-slate-700",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-slate-900">
          <CategoryIcon name={item.categoryIcon} className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-rkz-navy dark:text-white">
            {item.itemName}
          </h3>
          <p className="text-xs text-slate-500">
            {item.categoryName ?? "Geen categorie"}
          </p>
        </div>
        <StatusBadge status={toUiStockLevel(item.stockLevel)} />
      </div>

      <p className="line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
        {item.description || "Geen beschrijving"}
      </p>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
        <div>
          <p className="text-[11px] text-slate-400">Voorraad</p>
          <p className="text-lg font-bold text-sky-900 dark:text-sky-100">
            {item.remainingAmount}
          </p>
        </div>
        {canManageItems ? (
          <ItemManageActions
            item={item}
            categories={categories}
            onChanged={() => setReloadKey((k) => k + 1)}
            autoOpenStock={focusItemId === item.itemId}
            onAutoStockConsumed={() => setFocusItemId(null)}
          />
        ) : canAddToCart ? (
          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 rounded-xl"
            onClick={() =>
              addItem({
                itemId: item.itemId,
                itemName: item.itemName,
                remainingAmount: item.remainingAmount,
              })
            }
          >
            <HugeiconsIcon
              icon={ShoppingBagAddIcon}
              strokeWidth={2}
              className="size-4"
            />
            Mand
          </Button>
        ) : null}
      </div>
    </article>
  );

  const renderPagination = () =>
    pagination && pagination.totalPages > 1 ? (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Pagina {pagination.page} van {pagination.totalPages} ·{" "}
          {pagination.total} items
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={page <= 1 || itemsLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Vorige
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={!pagination.hasMore || itemsLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Volgende
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">
            {isVerpleging ? "Supplies" : "Totale Voorraad"}
          </h1>
          <p className="text-sm text-slate-500">
            {inCategory
              ? isVerpleging
                ? "Kies producten en zet ze in je mand"
                : "Medicijnen en supplies in deze categorie"
              : isGlobalSearch
                ? "Zoekresultaten in alle categorieën"
                : isVerpleging
                  ? "Kies een categorie en voeg producten toe aan je mand"
                  : "Kies een categorie of zoek direct op product"}
          </p>
        </div>
        {canManageItems ? (
          <AddMedicineDialog
            categories={categories}
            defaultCategoryId={categoryId}
            onCreated={refreshList}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="text-2xl font-semibold text-rkz-navy dark:text-white">
              {(loadProducts ? itemsLoading : categoriesLoading) && !summary
                ? "…"
                : card.value}
            </p>
          </div>
        ))}
      </div>

      {inCategory ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5 rounded-xl"
            onClick={backToCategories}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4"
            />
            Alle categorieën
          </Button>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
            <CategoryIcon
              name={selectedCategory?.icon}
              className="size-4 shrink-0"
            />
            <span className="truncate font-semibold">
              {selectedCategory?.categoryName ?? "Categorie"}
            </span>
            {selectedCategory?.itemCount != null ? (
              <span className="text-sky-700/80 dark:text-sky-200/80">
                · {selectedCategory.itemCount} items
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <FormInput
        label={inCategory ? "Zoeken in categorie" : "Zoeken"}
        name="inventory-search"
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder={
          inCategory
            ? "Zoek medicijn of product"
            : "Zoek categorie of product…"
        }
        className="rounded-xl"
        icon={
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="size-4"
          />
        }
      />

      {/* Overview: categories (+ optional global product hits) */}
      {!inCategory ? (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            {isGlobalSearch ? (
              <h2 className="text-sm font-semibold text-rkz-navy dark:text-white">
                Categorieën
                {filteredCategories.length > 0
                  ? ` (${filteredCategories.length})`
                  : ""}
              </h2>
            ) : null}

            {categoriesLoading ? (
              <LoadingSpinner label="Categorieën laden..." />
            ) : filteredCategories.length === 0 ? (
              isGlobalSearch ? (
                <p className="text-sm text-slate-500">
                  Geen passende categorieën.
                </p>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                  Geen categorieën gevonden.
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    type="button"
                    onClick={() => openCategory(cat.categoryId)}
                    className={cn(
                      "group flex h-full cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all",
                      "hover:border-sky-200 hover:bg-sky-50/40 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                      "dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-800 dark:hover:bg-slate-800/80",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-800 transition-colors group-hover:bg-sky-100 dark:bg-slate-900 dark:text-sky-200">
                        <CategoryIcon name={cat.icon} className="size-7" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {cat.itemCount ?? 0} items
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-rkz-navy dark:text-white">
                        {cat.categoryName}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {cat.categoryDescription || "Geen beschrijving"}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-1.5 text-sm font-medium text-sky-700 group-hover:text-sky-800 dark:text-sky-300">
                      <span>Bekijk voorraad</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {isGlobalSearch ? (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-rkz-navy dark:text-white">
                Producten
                {pagination?.total != null ? ` (${pagination.total})` : ""}
              </h2>

              {itemsLoading && !data ? (
                <LoadingSpinner label="Producten zoeken..." />
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                  Geen producten gevonden voor “{searchQuery}”.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map(renderItemCard)}
                  </div>
                  {renderPagination()}
                </>
              )}
            </section>
          ) : null}
        </div>
      ) : itemsLoading && !data ? (
        <LoadingSpinner label="Producten laden..." />
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
            <HugeiconsIcon
              icon={PackageIcon}
              strokeWidth={2}
              className="size-6"
            />
          </div>
          Geen producten in deze categorie.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(renderItemCard)}
          </div>
          {renderPagination()}
        </>
      )}

      {isVerpleging && productCount > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sky-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(14,116,144,0.08)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 md:left-64">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-rkz-navy dark:text-white">
                {productCount} product{productCount === 1 ? "" : "en"} in mand
              </p>
              <p className="text-xs text-slate-500">{totalCount} stuks totaal</p>
            </div>
            <Button
              type="button"
              className="h-11 gap-2 rounded-xl bg-sky-800 px-5 font-semibold hover:bg-sky-900"
              onClick={() => void navigate({ to: "/request" })}
            >
              Aanvraag plaatsen
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AddMedicineDialog({
  categories,
  defaultCategoryId,
  onCreated,
}: {
  categories: Category[];
  defaultCategoryId?: number | null;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [voorraad, setVoorraad] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    naam?: string;
    categoryId?: string;
    voorraad?: string;
  }>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open && defaultCategoryId) {
      setCategoryId(String(defaultCategoryId));
    }
  }, [open, defaultCategoryId]);

  const categoryItems = [
    { value: "", label: "Kies categorie" },
    ...categories.map((c) => ({
      value: String(c.categoryId),
      label: c.categoryName,
    })),
  ];

  const resetForm = () => {
    setNaam("");
    setVoorraad("");
    setDescription("");
    setCategoryId("");
    setFieldErrors({});
    setSubmitError("");
  };

  const handleSave = async () => {
    setSubmitError("");
    const next: typeof fieldErrors = {};

    if (!naam.trim()) next.naam = "Naam is verplicht.";
    if (!categoryId) next.categoryId = "Kies een categorie.";
    if (!voorraad.trim()) {
      next.voorraad = "Voorraad is verplicht.";
    } else {
      const amount = Number(voorraad);
      if (!Number.isInteger(amount) || amount < 0) {
        next.voorraad = "Voer een heel getal in (0 of hoger).";
      }
    }

    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await apiClient("/items", {
        method: "POST",
        body: JSON.stringify({
          itemName: naam.trim(),
          remainingAmount: Number(voorraad),
          description: description.trim() || undefined,
          categoryId: Number(categoryId),
        }),
      });
      setOpen(false);
      resetForm();
      onCreated();
    } catch {
      setSubmitError("Opslaan mislukt. Heb je de rol admin of apotheker?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-medium text-white hover:bg-sky-800">
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
        Medicijn toevoegen
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <DialogHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div className="flex flex-wrap items-start justify-between gap-2 pr-8">
            <DialogTitle className="text-base font-bold text-rkz-navy dark:text-white">
              Nieuw medicijn / item
            </DialogTitle>
            <DemoFillButton
              disabled={saving}
              onClick={() => {
                const firstCat =
                  categories[0]?.categoryId != null
                    ? String(categories[0].categoryId)
                    : categoryId;
                const demo = demoMedicineItem(firstCat);
                setNaam(demo.naam);
                setCategoryId(demo.categoryId);
                setVoorraad(demo.voorraad);
                setDescription(demo.description);
                setFieldErrors({});
                setSubmitError("");
              }}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-4">
          <FormInput
            label="Naam"
            name="naam"
            value={naam}
            onChange={(v) => {
              setNaam(v);
              if (fieldErrors.naam) {
                setFieldErrors((e) => ({ ...e, naam: undefined }));
              }
            }}
            placeholder="Bijv. Paracetamol 500mg"
            required
            error={fieldErrors.naam}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-sky-950">
              Categorie
              <span className="ml-0.5 text-rkz-red" aria-hidden="true">
                *
              </span>
            </label>
            <Select
              items={categoryItems}
              value={categoryId}
              onValueChange={(v) => {
                setCategoryId(v ?? "");
                if (fieldErrors.categoryId) {
                  setFieldErrors((e) => ({ ...e, categoryId: undefined }));
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-full rounded-xl",
                  fieldErrors.categoryId &&
                    "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200",
                )}
                aria-invalid={Boolean(fieldErrors.categoryId)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryItems.map((opt) => (
                  <SelectItem key={opt.value || "none"} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.categoryId ? (
              <p className="text-sm text-red-500">{fieldErrors.categoryId}</p>
            ) : null}
          </div>
          <FormInput
            label="Voorraad"
            name="voorraad"
            type="number"
            value={voorraad}
            onChange={(v) => {
              setVoorraad(v);
              if (fieldErrors.voorraad) {
                setFieldErrors((e) => ({ ...e, voorraad: undefined }));
              }
            }}
            placeholder="Aantal"
            required
            error={fieldErrors.voorraad}
          />
          <FormInput
            label="Beschrijving"
            name="description"
            value={description}
            onChange={setDescription}
            placeholder="Optioneel"
          />
          {submitError ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          ) : null}
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:justify-end dark:border-slate-700 dark:bg-slate-900/40">
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="h-11 w-full gap-2 rounded-xl bg-sky-700 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 sm:min-w-[8.5rem] sm:w-auto"
          >
            <HugeiconsIcon
              icon={saving ? PackageProcessIcon : FloppyDiskIcon}
              strokeWidth={2}
              className="size-4"
            />
            {saving ? "Bezig..." : "Opslaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ItemManageActions({
  item,
  categories,
  onChanged,
  autoOpenStock = false,
  onAutoStockConsumed,
}: {
  item: InventoryItem;
  categories: Category[];
  onChanged: () => void;
  autoOpenStock?: boolean;
  onAutoStockConsumed?: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [naam, setNaam] = useState(item.itemName);
  const [description, setDescription] = useState(item.description ?? "");
  const [categoryId, setCategoryId] = useState(
    item.categoryId != null ? String(item.categoryId) : "",
  );
  const [voorraad, setVoorraad] = useState(String(item.remainingAmount));

  const categoryItems = [
    { value: "", label: "Geen categorie" },
    ...categories.map((c) => ({
      value: String(c.categoryId),
      label: c.categoryName,
    })),
  ];

  const openEdit = () => {
    setNaam(item.itemName);
    setDescription(item.description ?? "");
    setCategoryId(item.categoryId != null ? String(item.categoryId) : "");
    setError("");
    setEditOpen(true);
  };

  const openStock = () => {
    setVoorraad(String(item.remainingAmount));
    setError("");
    setStockOpen(true);
  };

  useEffect(() => {
    if (!autoOpenStock) return;
    openStock();
    onAutoStockConsumed?.();
    document
      .getElementById(`inventory-item-${item.itemId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when deep-linked
  }, [autoOpenStock]);

  const handleEdit = async () => {
    setError("");
    if (!naam.trim()) {
      setError("Naam is verplicht.");
      return;
    }
    setBusy(true);
    try {
      await apiClient(`/items/${item.itemId}`, {
        method: "PATCH",
        body: JSON.stringify({
          itemName: naam.trim(),
          description: description.trim() || undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
        }),
      });
      setEditOpen(false);
      onChanged();
    } catch {
      setError("Bewerken mislukt.");
    } finally {
      setBusy(false);
    }
  };

  const handleStock = async () => {
    setError("");
    const amount = Number(voorraad);
    if (!Number.isInteger(amount) || amount < 0) {
      setError("Voer een geldige voorraad in (0 of hoger).");
      return;
    }
    setBusy(true);
    try {
      await apiClient(`/items/${item.itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ remainingAmount: amount }),
      });
      setStockOpen(false);
      onChanged();
    } catch {
      setError("Voorraad bijwerken mislukt.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Weet je zeker dat je “${item.itemName}” wilt verwijderen?`,
    );
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await apiClient(`/items/${item.itemId}`, { method: "DELETE" });
      onChanged();
    } catch {
      setError("Verwijderen mislukt.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          className="h-9 gap-1 rounded-xl px-2.5"
          title="Bewerken"
          onClick={openEdit}
        >
          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          className="h-9 gap-1 rounded-xl px-2.5"
          title="Voorraad bijwerken"
          onClick={openStock}
        >
          <HugeiconsIcon
            icon={PackageProcessIcon}
            strokeWidth={2}
            className="size-4"
          />
          <span className="hidden sm:inline">Voorraad</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          className="h-9 gap-1 rounded-xl border-red-200 px-2.5 text-red-600 hover:bg-red-50 hover:text-red-700"
          title="Verwijderen"
          onClick={() => void handleDelete()}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            className="size-4"
          />
        </Button>
      </div>
      {error && !editOpen && !stockOpen ? (
        <p className="max-w-[12rem] text-right text-xs text-red-500">{error}</p>
      ) : null}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Product bewerken</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <FormInput
              label="Naam"
              name={`edit-naam-${item.itemId}`}
              value={naam}
              onChange={setNaam}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-sky-950">
                Categorie
              </label>
              <Select
                items={categoryItems}
                value={categoryId}
                onValueChange={(v) => setCategoryId(v ?? "")}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryItems.map((opt) => (
                    <SelectItem key={opt.value || "none"} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormInput
              label="Beschrijving"
              name={`edit-desc-${item.itemId}`}
              value={description}
              onChange={setDescription}
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => void handleEdit()}
              disabled={busy}
              className="rounded-xl bg-sky-700 hover:bg-sky-800"
            >
              {busy ? "Bezig..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Voorraad bijwerken</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-slate-500">
              {item.itemName} · huidig:{" "}
              <span className="font-semibold text-rkz-navy">
                {item.remainingAmount}
              </span>
            </p>
            <FormInput
              label="Nieuwe voorraad"
              name={`stock-${item.itemId}`}
              type="number"
              value={voorraad}
              onChange={setVoorraad}
              placeholder="Aantal"
              required
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => void handleStock()}
              disabled={busy}
              className="rounded-xl bg-sky-700 hover:bg-sky-800"
            >
              {busy ? "Bezig..." : "Bijwerken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
