"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

export type ColorTheme = {
  id: string;
  name: string;
  variables: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

export const colorThemes: ColorTheme[] = [
  {
    id: "amber",
    name: "アンバー",
    variables: {
      light: {
        "--background": "oklch(99% 0.01 85)",
        "--foreground": "oklch(15% 0.02 65)",
        "--card": "oklch(98% 0.015 80)",
        "--card-foreground": "oklch(15% 0.02 65)",
        "--popover": "oklch(98% 0.015 80)",
        "--popover-foreground": "oklch(15% 0.02 65)",
        "--primary": "oklch(65% 0.15 75)",
        "--primary-foreground": "oklch(98% 0.01 80)",
        "--secondary": "oklch(94% 0.03 78)",
        "--secondary-foreground": "oklch(25% 0.03 70)",
        "--muted": "oklch(96% 0.02 75)",
        "--muted-foreground": "oklch(45% 0.04 68)",
        "--accent": "oklch(92% 0.04 76)",
        "--accent-foreground": "oklch(20% 0.03 68)",
        "--destructive": "oklch(58% 0.24 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(88% 0.03 78)",
        "--input": "oklch(88% 0.03 78)",
        "--ring": "oklch(65% 0.15 75)",
        "--sidebar": "oklch(97% 0.02 78)",
        "--sidebar-foreground": "oklch(18% 0.02 65)",
        "--sidebar-primary": "oklch(65% 0.15 75)",
        "--sidebar-primary-foreground": "oklch(98% 0.01 80)",
        "--sidebar-accent": "oklch(92% 0.04 76)",
        "--sidebar-accent-foreground": "oklch(20% 0.03 68)",
        "--sidebar-border": "oklch(88% 0.03 78)",
        "--sidebar-ring": "oklch(65% 0.15 75)",
      },
      dark: {
        "--background": "oklch(6% 0.04 65)",
        "--foreground": "oklch(96% 0.02 78)",
        "--card": "oklch(10% 0.05 68)",
        "--card-foreground": "oklch(96% 0.02 78)",
        "--popover": "oklch(10% 0.05 68)",
        "--popover-foreground": "oklch(96% 0.02 78)",
        "--primary": "oklch(78% 0.20 78)",
        "--primary-foreground": "oklch(8% 0.02 65)",
        "--secondary": "oklch(16% 0.05 68)",
        "--secondary-foreground": "oklch(94% 0.02 78)",
        "--muted": "oklch(14% 0.04 68)",
        "--muted-foreground": "oklch(72% 0.06 75)",
        "--accent": "oklch(20% 0.05 70)",
        "--accent-foreground": "oklch(94% 0.02 78)",
        "--destructive": "oklch(70% 0.28 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(22% 0.05 68)",
        "--input": "oklch(26% 0.05 70)",
        "--ring": "oklch(78% 0.20 78)",
        "--sidebar": "oklch(8% 0.04 65)",
        "--sidebar-foreground": "oklch(94% 0.02 78)",
        "--sidebar-primary": "oklch(78% 0.20 78)",
        "--sidebar-primary-foreground": "oklch(8% 0.02 65)",
        "--sidebar-accent": "oklch(20% 0.05 70)",
        "--sidebar-accent-foreground": "oklch(94% 0.02 78)",
        "--sidebar-border": "oklch(22% 0.05 68)",
        "--sidebar-ring": "oklch(78% 0.20 78)",
      },
    },
  },
  {
    id: "emerald",
    name: "エメラルド",
    variables: {
      light: {
        "--background": "oklch(99% 0.01 160)",
        "--foreground": "oklch(15% 0.02 160)",
        "--card": "oklch(98% 0.015 160)",
        "--card-foreground": "oklch(15% 0.02 160)",
        "--popover": "oklch(98% 0.015 160)",
        "--popover-foreground": "oklch(15% 0.02 160)",
        "--primary": "oklch(65% 0.15 160)",
        "--primary-foreground": "oklch(98% 0.01 160)",
        "--secondary": "oklch(94% 0.03 160)",
        "--secondary-foreground": "oklch(25% 0.03 160)",
        "--muted": "oklch(96% 0.02 160)",
        "--muted-foreground": "oklch(45% 0.04 160)",
        "--accent": "oklch(92% 0.04 160)",
        "--accent-foreground": "oklch(20% 0.03 160)",
        "--destructive": "oklch(58% 0.24 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(88% 0.03 160)",
        "--input": "oklch(88% 0.03 160)",
        "--ring": "oklch(65% 0.15 160)",
        "--sidebar": "oklch(97% 0.02 160)",
        "--sidebar-foreground": "oklch(18% 0.02 160)",
        "--sidebar-primary": "oklch(65% 0.15 160)",
        "--sidebar-primary-foreground": "oklch(98% 0.01 160)",
        "--sidebar-accent": "oklch(92% 0.04 160)",
        "--sidebar-accent-foreground": "oklch(20% 0.03 160)",
        "--sidebar-border": "oklch(88% 0.03 160)",
        "--sidebar-ring": "oklch(65% 0.15 160)",
      },
      dark: {
        "--background": "oklch(5% 0.04 160)",
        "--foreground": "oklch(96% 0.02 160)",
        "--card": "oklch(9% 0.06 160)",
        "--card-foreground": "oklch(96% 0.02 160)",
        "--popover": "oklch(9% 0.06 160)",
        "--popover-foreground": "oklch(96% 0.02 160)",
        "--primary": "oklch(75% 0.20 160)",
        "--primary-foreground": "oklch(7% 0.02 160)",
        "--secondary": "oklch(15% 0.06 160)",
        "--secondary-foreground": "oklch(94% 0.02 160)",
        "--muted": "oklch(13% 0.05 160)",
        "--muted-foreground": "oklch(70% 0.06 160)",
        "--accent": "oklch(19% 0.06 160)",
        "--accent-foreground": "oklch(94% 0.02 160)",
        "--destructive": "oklch(70% 0.28 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(21% 0.06 160)",
        "--input": "oklch(25% 0.06 160)",
        "--ring": "oklch(75% 0.20 160)",
        "--sidebar": "oklch(7% 0.04 160)",
        "--sidebar-foreground": "oklch(94% 0.02 160)",
        "--sidebar-primary": "oklch(75% 0.20 160)",
        "--sidebar-primary-foreground": "oklch(7% 0.02 160)",
        "--sidebar-accent": "oklch(19% 0.06 160)",
        "--sidebar-accent-foreground": "oklch(94% 0.02 160)",
        "--sidebar-border": "oklch(21% 0.06 160)",
        "--sidebar-ring": "oklch(75% 0.20 160)",
      },
    },
  },
  {
    id: "blue",
    name: "ブルー",
    variables: {
      light: {
        "--background": "oklch(99% 0.01 240)",
        "--foreground": "oklch(15% 0.02 240)",
        "--card": "oklch(98% 0.015 240)",
        "--card-foreground": "oklch(15% 0.02 240)",
        "--popover": "oklch(98% 0.015 240)",
        "--popover-foreground": "oklch(15% 0.02 240)",
        "--primary": "oklch(65% 0.15 240)",
        "--primary-foreground": "oklch(98% 0.01 240)",
        "--secondary": "oklch(94% 0.03 240)",
        "--secondary-foreground": "oklch(25% 0.03 240)",
        "--muted": "oklch(96% 0.02 240)",
        "--muted-foreground": "oklch(45% 0.04 240)",
        "--accent": "oklch(92% 0.04 240)",
        "--accent-foreground": "oklch(20% 0.03 240)",
        "--destructive": "oklch(58% 0.24 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(88% 0.03 240)",
        "--input": "oklch(88% 0.03 240)",
        "--ring": "oklch(65% 0.15 240)",
        "--sidebar": "oklch(97% 0.02 240)",
        "--sidebar-foreground": "oklch(18% 0.02 240)",
        "--sidebar-primary": "oklch(65% 0.15 240)",
        "--sidebar-primary-foreground": "oklch(98% 0.01 240)",
        "--sidebar-accent": "oklch(92% 0.04 240)",
        "--sidebar-accent-foreground": "oklch(20% 0.03 240)",
        "--sidebar-border": "oklch(88% 0.03 240)",
        "--sidebar-ring": "oklch(65% 0.15 240)",
      },
      dark: {
        "--background": "oklch(4% 0.05 240)",
        "--foreground": "oklch(97% 0.02 240)",
        "--card": "oklch(8% 0.07 240)",
        "--card-foreground": "oklch(97% 0.02 240)",
        "--popover": "oklch(8% 0.07 240)",
        "--popover-foreground": "oklch(97% 0.02 240)",
        "--primary": "oklch(72% 0.22 240)",
        "--primary-foreground": "oklch(6% 0.02 240)",
        "--secondary": "oklch(14% 0.07 240)",
        "--secondary-foreground": "oklch(95% 0.02 240)",
        "--muted": "oklch(12% 0.06 240)",
        "--muted-foreground": "oklch(68% 0.07 240)",
        "--accent": "oklch(18% 0.07 240)",
        "--accent-foreground": "oklch(95% 0.02 240)",
        "--destructive": "oklch(70% 0.28 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(20% 0.07 240)",
        "--input": "oklch(24% 0.07 240)",
        "--ring": "oklch(72% 0.22 240)",
        "--sidebar": "oklch(6% 0.05 240)",
        "--sidebar-foreground": "oklch(95% 0.02 240)",
        "--sidebar-primary": "oklch(72% 0.22 240)",
        "--sidebar-primary-foreground": "oklch(6% 0.02 240)",
        "--sidebar-accent": "oklch(18% 0.07 240)",
        "--sidebar-accent-foreground": "oklch(95% 0.02 240)",
        "--sidebar-border": "oklch(20% 0.07 240)",
        "--sidebar-ring": "oklch(72% 0.22 240)",
      },
    },
  },
  {
    id: "purple",
    name: "パープル",
    variables: {
      light: {
        "--background": "oklch(99% 0.01 300)",
        "--foreground": "oklch(15% 0.02 300)",
        "--card": "oklch(98% 0.015 300)",
        "--card-foreground": "oklch(15% 0.02 300)",
        "--popover": "oklch(98% 0.015 300)",
        "--popover-foreground": "oklch(15% 0.02 300)",
        "--primary": "oklch(65% 0.15 300)",
        "--primary-foreground": "oklch(98% 0.01 300)",
        "--secondary": "oklch(94% 0.03 300)",
        "--secondary-foreground": "oklch(25% 0.03 300)",
        "--muted": "oklch(96% 0.02 300)",
        "--muted-foreground": "oklch(45% 0.04 300)",
        "--accent": "oklch(92% 0.04 300)",
        "--accent-foreground": "oklch(20% 0.03 300)",
        "--destructive": "oklch(58% 0.24 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(88% 0.03 300)",
        "--input": "oklch(88% 0.03 300)",
        "--ring": "oklch(65% 0.15 300)",
        "--sidebar": "oklch(97% 0.02 300)",
        "--sidebar-foreground": "oklch(18% 0.02 300)",
        "--sidebar-primary": "oklch(65% 0.15 300)",
        "--sidebar-primary-foreground": "oklch(98% 0.01 300)",
        "--sidebar-accent": "oklch(92% 0.04 300)",
        "--sidebar-accent-foreground": "oklch(20% 0.03 300)",
        "--sidebar-border": "oklch(88% 0.03 300)",
        "--sidebar-ring": "oklch(65% 0.15 300)",
      },
      dark: {
        "--background": "oklch(3% 0.06 300)",
        "--foreground": "oklch(97% 0.02 300)",
        "--card": "oklch(7% 0.08 300)",
        "--card-foreground": "oklch(97% 0.02 300)",
        "--popover": "oklch(7% 0.08 300)",
        "--popover-foreground": "oklch(97% 0.02 300)",
        "--primary": "oklch(75% 0.18 300)",
        "--primary-foreground": "oklch(5% 0.02 300)",
        "--secondary": "oklch(13% 0.08 300)",
        "--secondary-foreground": "oklch(95% 0.02 300)",
        "--muted": "oklch(11% 0.07 300)",
        "--muted-foreground": "oklch(69% 0.08 300)",
        "--accent": "oklch(17% 0.08 300)",
        "--accent-foreground": "oklch(95% 0.02 300)",
        "--destructive": "oklch(70% 0.28 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(19% 0.08 300)",
        "--input": "oklch(23% 0.08 300)",
        "--ring": "oklch(75% 0.18 300)",
        "--sidebar": "oklch(5% 0.06 300)",
        "--sidebar-foreground": "oklch(95% 0.02 300)",
        "--sidebar-primary": "oklch(75% 0.18 300)",
        "--sidebar-primary-foreground": "oklch(5% 0.02 300)",
        "--sidebar-accent": "oklch(17% 0.08 300)",
        "--sidebar-accent-foreground": "oklch(95% 0.02 300)",
        "--sidebar-border": "oklch(19% 0.08 300)",
        "--sidebar-ring": "oklch(75% 0.18 300)",
      },
    },
  },
  {
    id: "rose",
    name: "ローズ",
    variables: {
      light: {
        "--background": "oklch(99% 0.01 15)",
        "--foreground": "oklch(15% 0.02 15)",
        "--card": "oklch(98% 0.015 15)",
        "--card-foreground": "oklch(15% 0.02 15)",
        "--popover": "oklch(98% 0.015 15)",
        "--popover-foreground": "oklch(15% 0.02 15)",
        "--primary": "oklch(65% 0.15 15)",
        "--primary-foreground": "oklch(98% 0.01 15)",
        "--secondary": "oklch(94% 0.03 15)",
        "--secondary-foreground": "oklch(25% 0.03 15)",
        "--muted": "oklch(96% 0.02 15)",
        "--muted-foreground": "oklch(45% 0.04 15)",
        "--accent": "oklch(92% 0.04 15)",
        "--accent-foreground": "oklch(20% 0.03 15)",
        "--destructive": "oklch(58% 0.24 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(88% 0.03 15)",
        "--input": "oklch(88% 0.03 15)",
        "--ring": "oklch(65% 0.15 15)",
        "--sidebar": "oklch(97% 0.02 15)",
        "--sidebar-foreground": "oklch(18% 0.02 15)",
        "--sidebar-primary": "oklch(65% 0.15 15)",
        "--sidebar-primary-foreground": "oklch(98% 0.01 15)",
        "--sidebar-accent": "oklch(92% 0.04 15)",
        "--sidebar-accent-foreground": "oklch(20% 0.03 15)",
        "--sidebar-border": "oklch(88% 0.03 15)",
        "--sidebar-ring": "oklch(65% 0.15 15)",
      },
      dark: {
        "--background": "oklch(5% 0.04 15)",
        "--foreground": "oklch(96% 0.02 15)",
        "--card": "oklch(9% 0.06 15)",
        "--card-foreground": "oklch(96% 0.02 15)",
        "--popover": "oklch(9% 0.06 15)",
        "--popover-foreground": "oklch(96% 0.02 15)",
        "--primary": "oklch(73% 0.19 15)",
        "--primary-foreground": "oklch(7% 0.02 15)",
        "--secondary": "oklch(15% 0.06 15)",
        "--secondary-foreground": "oklch(94% 0.02 15)",
        "--muted": "oklch(13% 0.05 15)",
        "--muted-foreground": "oklch(70% 0.06 15)",
        "--accent": "oklch(19% 0.06 15)",
        "--accent-foreground": "oklch(94% 0.02 15)",
        "--destructive": "oklch(70% 0.28 28)",
        "--destructive-foreground": "oklch(98% 0.01 80)",
        "--border": "oklch(21% 0.06 15)",
        "--input": "oklch(25% 0.06 15)",
        "--ring": "oklch(73% 0.19 15)",
        "--sidebar": "oklch(7% 0.04 15)",
        "--sidebar-foreground": "oklch(94% 0.02 15)",
        "--sidebar-primary": "oklch(73% 0.19 15)",
        "--sidebar-primary-foreground": "oklch(7% 0.02 15)",
        "--sidebar-accent": "oklch(19% 0.06 15)",
        "--sidebar-accent-foreground": "oklch(94% 0.02 15)",
        "--sidebar-border": "oklch(21% 0.06 15)",
        "--sidebar-ring": "oklch(73% 0.19 15)",
      },
    },
  },
];

export function useColorTheme() {
  const { theme } = useTheme();
  const [lightColorTheme, setLightColorTheme] = useState<string>("amber");
  const [darkColorTheme, setDarkColorTheme] = useState<string>("amber");
  const [mounted, setMounted] = useState(false);

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    const savedLightTheme =
      localStorage.getItem("color-theme-light") || "amber";
    const savedDarkTheme = localStorage.getItem("color-theme-dark") || "amber";
    setLightColorTheme(savedLightTheme);
    setDarkColorTheme(savedDarkTheme);
    setMounted(true);
  }, []);

  // CSS変数を適用する関数
  const applyCSSVariables = useCallback(
    (colorThemeId: string, mode: "light" | "dark") => {
      const colorTheme = colorThemes.find((t) => t.id === colorThemeId);
      if (!colorTheme) return;

      const root = document.documentElement;
      const variables = colorTheme.variables[mode];

      Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    },
    []
  );

  // テーマが変更されたときにCSS変数を適用
  useEffect(() => {
    if (!mounted) return;

    if (theme === "light") {
      applyCSSVariables(lightColorTheme, "light");
    } else if (theme === "dark") {
      applyCSSVariables(darkColorTheme, "dark");
    } else if (theme === "system") {
      // システムテーマの場合はmedia queryで判定
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyCSSVariables(
        prefersDark ? darkColorTheme : lightColorTheme,
        prefersDark ? "dark" : "light"
      );
    }
  }, [theme, lightColorTheme, darkColorTheme, mounted, applyCSSVariables]);

  // ライトモードのカラーテーマを設定
  const setLightTheme = useCallback(
    (colorThemeId: string) => {
      setLightColorTheme(colorThemeId);
      localStorage.setItem("color-theme-light", colorThemeId);

      if (
        theme === "light" ||
        (theme === "system" &&
          !window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        applyCSSVariables(colorThemeId, "light");
      }
    },
    [theme, applyCSSVariables]
  );

  // ダークモードのカラーテーマを設定
  const setDarkTheme = useCallback(
    (colorThemeId: string) => {
      setDarkColorTheme(colorThemeId);
      localStorage.setItem("color-theme-dark", colorThemeId);

      if (
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        applyCSSVariables(colorThemeId, "dark");
      }
    },
    [theme, applyCSSVariables]
  );

  return {
    lightColorTheme,
    darkColorTheme,
    setLightTheme,
    setDarkTheme,
    colorThemes,
    mounted,
  };
}
