"use client";

import * as React from "react";
import { Palette, Sun, Moon } from "lucide-react";
import { useColorTheme } from "@/hooks/use-color-theme";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ColorThemeToggle() {
  const {
    lightColorTheme,
    darkColorTheme,
    setLightTheme,
    setDarkTheme,
    colorThemes,
    mounted,
  } = useColorTheme();

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">カラーテーマ選択</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">カラーテーマ選択</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          ライトモード
        </DropdownMenuLabel>
        {colorThemes.map((colorTheme) => (
          <DropdownMenuItem
            key={`light-${colorTheme.id}`}
            onClick={() => setLightTheme(colorTheme.id)}
            className="flex items-center justify-between"
          >
            <span>{colorTheme.name}</span>
            {lightColorTheme === colorTheme.id && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          ダークモード
        </DropdownMenuLabel>
        {colorThemes.map((colorTheme) => (
          <DropdownMenuItem
            key={`dark-${colorTheme.id}`}
            onClick={() => setDarkTheme(colorTheme.id)}
            className="flex items-center justify-between"
          >
            <span>{colorTheme.name}</span>
            {darkColorTheme === colorTheme.id && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
