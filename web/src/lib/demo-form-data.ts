/** Shared demo values for form autofill (presentations / testing). */
export const DEMO_PASSWORD = "Test1234!";

export function demoRequestDetails() {
  return {
    afdeling: "SEH",
    urgentie: "hoog" as const,
    opmerking: "Demo aanvraag — acute behoefte voor patiëntenzorg op de SEH.",
  };
}

export function demoMedicineItem(firstCategoryId?: string) {
  const suffix = Date.now().toString().slice(-4);
  return {
    naam: `Paracetamol 500mg (demo ${suffix})`,
    categoryId: firstCategoryId ?? "",
    voorraad: "25",
    description: "Demo product — kan na presentatie verwijderd worden.",
  };
}

export function demoUser(roles: { roleId: number; roleName: string }[]) {
  const suffix = Date.now().toString().slice(-6);
  const verpleging = roles.find((r) => r.roleName === "verpleging");
  return {
    name: "Demo Verpleger",
    email: `demo.verpleger.${suffix}@rkz.sr`,
    roleId: verpleging ? String(verpleging.roleId) : "",
  };
}
