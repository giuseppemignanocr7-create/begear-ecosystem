import { expect, test, type Page } from "@playwright/test";

interface RouteInfo {
  label: string;
  path: string;
  tagline: string;
}

const MODULES: RouteInfo[] = [
  { label: "CoreMind", path: "/coremind", tagline: "Assistente AI trasversale" },
  { label: "BeTalent", path: "/betalent", tagline: "Matching e screening" },
  { label: "Academy", path: "/academy", tagline: "Formazione certificata" },
  { label: "ATS Recruiting", path: "/ats", tagline: "Pipeline selezione" },
  { label: "Placement", path: "/placement", tagline: "Inserimento alumni" },
  { label: "Gestionale", path: "/gestionale", tagline: "Progetti e budget" },
  { label: "Turni e risorse", path: "/turni", tagline: "Presidio sedi" },
  { label: "Staffing ICT", path: "/staffing", tagline: "Consulenti e allocazioni" },
  { label: "CRM B2B", path: "/crm", tagline: "Account enterprise" },
  { label: "Input Hub", path: "/input-hub", tagline: "Acquisizione lead" },
  { label: "Integration Hub", path: "/integration-hub", tagline: "Connettori e API" },
  { label: "Documenti", path: "/documenti", tagline: "Archivio e contratti" },
  { label: "GDPR e Compliance", path: "/compliance", tagline: "Governance e audit" },
];

const ALL: RouteInfo[] = [
  { label: "Dashboard", path: "/", tagline: "Panoramica operativa" },
  ...MODULES,
];

const SECTIONS: Record<string, string[]> = {
  "/": ["Moduli", "KPI operativi", "Filiera"],
  "/coremind": ["Cosa sa fare", "Esempi di risposta"],
  "/betalent": ["Matching motivato"],
  "/academy": ["Corsi", "Edizioni"],
  "/ats": ["Posizioni aperte", "Candidati"],
  "/placement": ["Outcome di inserimento"],
  "/gestionale": ["Progetti"],
  "/turni": ["Pianificazione"],
  "/staffing": ["Consulenti", "Allocazioni"],
  "/crm": ["Account enterprise"],
  "/input-hub": ["Canali di ingresso", "Ingressi recenti"],
  "/integration-hub": ["Connettori"],
  "/documenti": ["Categorie documentali"],
  "/compliance": ["Ruoli e permessi", "Stato timesheet", "Audit log"],
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !/favicon/i.test(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(String(error));
  });
  return errors;
}

test.describe("Rendering rotte", () => {
  for (const route of ALL) {
    test(`risponde 200 su ${route.path}`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status(), `status ${route.path}`).toBe(200);
    });

    test(`una sola h1 con titolo su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(route.label);
    });

    test(`nessun errore console su ${route.path}`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.goto(route.path);
      await page.waitForLoadState("load");
      await page.waitForTimeout(400);
      expect(errors, errors.join("\n")).toEqual([]);
    });

    test(`shell presente su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("aside")).toBeVisible();
      await expect(page.getByRole("navigation")).toBeVisible();
      await expect(page.locator("header").first()).toBeVisible();
    });

    test(`tagline visibile su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("main")).toContainText(route.tagline);
    });

    test(`header KPI presente su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("main dl").first()).toBeVisible();
    });
  }
});

test.describe("Navigazione sidebar", () => {
  for (const mod of MODULES) {
    test(`sidebar naviga a ${mod.label}`, async ({ page }) => {
      await page.goto("/");
      await page
        .locator("aside")
        .getByRole("link", { name: mod.label, exact: true })
        .click();
      await page.waitForURL(`**${mod.path}`);
      await expect(page.locator('aside [aria-current="page"]')).toHaveText(
        mod.label,
      );
    });
  }
});

test.describe("Stato attivo", () => {
  for (const route of ALL) {
    test(`evidenzia una sola voce attiva su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const current = page.locator('aside [aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(route.label);
    });
  }
});

test.describe("Griglia dashboard", () => {
  for (const mod of MODULES) {
    test(`la card apre ${mod.label}`, async ({ page }) => {
      await page.goto("/");
      await page
        .locator("main")
        .getByRole("link", { name: new RegExp("^" + escapeRegExp(mod.label)) })
        .first()
        .click();
      await page.waitForURL(`**${mod.path}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(mod.label);
    });
  }
});

test.describe("Link interni validi", () => {
  for (const route of ALL) {
    test(`nessun link rotto su ${route.path}`, async ({ page, request }) => {
      await page.goto(route.path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((nodes) =>
        Array.from(
          new Set(
            nodes
              .map((node) => node.getAttribute("href"))
              .filter((href): href is string => Boolean(href)),
          ),
        ),
      );
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        const response = await request.get(href);
        expect(response.status(), `${href}`).toBeLessThan(400);
      }
    });
  }
});

test.describe("Accessibilita base", () => {
  for (const route of ALL) {
    test(`tutti i bottoni hanno un nome su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const buttons = await page.getByRole("button").all();
      for (const button of buttons) {
        const ariaLabel = await button.getAttribute("aria-label");
        const text = (await button.textContent())?.trim();
        expect(Boolean(ariaLabel) || Boolean(text)).toBeTruthy();
      }
    });
  }
});

test.describe("Contenuto sezioni", () => {
  for (const route of ALL) {
    const headings = SECTIONS[route.path] ?? [];
    test(`mostra le sezioni attese su ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      for (const heading of headings) {
        await expect(
          page.getByRole("heading", { level: 2, name: heading, exact: true }),
        ).toBeVisible();
      }
    });
  }
});

test.describe("Command palette", () => {
  test("si apre con Ctrl+K", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("si apre dal pulsante di ricerca", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Cerca moduli/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("filtra i moduli digitando", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    await dialog.locator("input").fill("Academy");
    await expect(dialog.getByRole("option", { name: /Academy/ })).toBeVisible();
    await expect(dialog.getByRole("option", { name: /Documenti/ })).toHaveCount(0);
  });

  test("naviga selezionando un risultato", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    await dialog.locator("input").fill("Academy");
    await dialog.getByRole("option", { name: /Academy/ }).first().click();
    await page.waitForURL("**/academy");
  });

  test("si chiude con Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("CoreMind dock", () => {
  test("mostra il trigger ed e chiuso di default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Apri CoreMind" })).toBeVisible();
    await expect(page.getByText("Assistente AI BeGear")).toBeHidden();
  });

  test("si apre al click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri CoreMind" }).click();
    await expect(page.getByText("Assistente AI BeGear")).toBeVisible();
  });

  test("accetta una domanda e svuota l'input", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri CoreMind" }).click();
    const input = page.getByLabel("Domanda per CoreMind");
    await input.fill("Quanti placement?");
    await page.getByRole("button", { name: "Invia domanda" }).click();
    await expect(input).toHaveValue("");
  });

  test("si chiude di nuovo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri CoreMind" }).click();
    await page.getByRole("button", { name: "Chiudi CoreMind" }).click();
    await expect(page.getByRole("button", { name: "Apri CoreMind" })).toBeVisible();
  });
});

test.describe("Sidebar collapse", () => {
  test("comprime la sidebar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comprimi menu" }).click();
    await expect(page.getByRole("button", { name: "Espandi menu" })).toBeVisible();
  });

  test("riespande la sidebar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comprimi menu" }).click();
    await page.getByRole("button", { name: "Espandi menu" }).click();
    await expect(page.getByRole("button", { name: "Comprimi menu" })).toBeVisible();
  });

  test("mantiene lo stato durante la navigazione", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comprimi menu" }).click();
    await page
      .locator("aside")
      .getByRole("link", { name: "Academy", exact: true })
      .click();
    await page.waitForURL("**/academy");
    await expect(page.getByRole("button", { name: "Espandi menu" })).toBeVisible();
  });
});

test.describe("Rotta inesistente", () => {
  test("restituisce 404", async ({ page }) => {
    const response = await page.goto("/rotta-inesistente-xyz");
    expect(response?.status()).toBe(404);
  });

  test("non genera errori console", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/rotta-inesistente-xyz");
    await page.waitForLoadState("load");
    await page.waitForTimeout(300);
    const unexpected = errors.filter(
      (error) => !/failed to load resource/i.test(error),
    );
    expect(unexpected, unexpected.join("\n")).toEqual([]);
  });
});

test.describe("Meta", () => {
  test("titolo e lingua corretti", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BeGear/);
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
  });

  test("il marchio BeGear e presente", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("BeGear").first()).toBeVisible();
  });
});

test.describe("Mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("la sidebar desktop e nascosta", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("aside")).toBeHidden();
  });

  test("il pulsante menu e visibile", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Apri menu di navigazione" }),
    ).toBeVisible();
  });

  test("il drawer si apre", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri menu di navigazione" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Academy", exact: true })).toBeVisible();
  });

  test("il drawer elenca tutti i moduli", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri menu di navigazione" }).click();
    await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(14);
  });

  for (const mod of MODULES) {
    test(`il drawer naviga a ${mod.label}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Apri menu di navigazione" }).click();
      await page
        .getByRole("dialog")
        .getByRole("link", { name: mod.label, exact: true })
        .click();
      await page.waitForURL(`**${mod.path}`);
      await expect(page.getByRole("dialog")).toBeHidden();
    });
  }

  test("il drawer si chiude con Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Apri menu di navigazione" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("la ricerca e disponibile su mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Cerca", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
