// components/service-status-card.tsx
"use client";

import { useState, useEffect } from "react";
import { Info, Zap, Clock, ChevronRight, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ServiceStatusCardProps {
    className?: string;
    showCloseButton?: boolean;
    variant?: "default" | "compact" | "minimal";
}

export function ServiceStatusCard({
    className,
    showCloseButton = true,
    variant = "default",
}: ServiceStatusCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const isDismissed = localStorage.getItem("service-card-dismissed");
        if (isDismissed) {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("service-card-dismissed", "true");
    };

    if (!isVisible) return null;

    if (variant === "minimal") {
        return (
            <div className={cn("mb-4", className)}>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-amber-500/10">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium">Running on free tier resources</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleClose}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Card className={cn("border-muted/50 bg-card", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/15"
                        >
                            <Clock className="h-3 w-3 mr-1" />
                            Free Tier
                        </Badge>
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 ml-auto"
                                onClick={handleClose}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold mb-2">Service Performance Notice</h3>
                    <p className="text-sm text-muted-foreground">
                        Our backend service is running on free tier resources.
                        Initial requests may take a moment to start up.
                    </p>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <div className="p-1 rounded bg-amber-500/10 mt-0.5">
                            <Zap className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Cold starts may take 30-60 seconds</p>
                            <p className="text-xs text-muted-foreground">First request after idle period</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <div className="p-1 rounded bg-emerald-500/10 mt-0.5">
                            <div className="h-3.5 w-3.5 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Subsequent requests will be faster</p>
                            <p className="text-xs text-muted-foreground">Once service is warmed up</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <Link
                    href="/pricing"
                    className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Learn more about our service tiers</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </CardContent>
        </Card>
    );
}