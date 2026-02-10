"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Monitor } from 'lucide-react';
import { useTheme } from "next-themes";

export const Header = () => {
    const [time, setTime] = useState<string>("");
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Client-side clock
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-wider text-primary">BASE DE DATOS UAS</h1>
                        <span className="text-xs text-muted-foreground font-mono tracking-widest">PLAER SYSTEM</span>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-50 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-wider text-primary">BASE DE DATOS UAS</h1>
                    <span className="text-xs text-muted-foreground font-mono tracking-widest">PLAER SYSTEM</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 text-sm text-foreground bg-secondary/50 px-3 py-1 rounded-md border border-border">
                    <Clock size={14} className="text-primary" />
                    <span className="capitalize">{time}</span>
                </div>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};
