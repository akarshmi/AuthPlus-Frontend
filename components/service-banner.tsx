// components/service-banner.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, Clock, Zap, X, Loader2, Server, Cloud, Coffee, Pause, Play } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceBannerProps {
    dismissible?: boolean;
    autoDismiss?: number; // milliseconds
    position?: "center" | "top" | "bottom";
}

export function ServiceBanner({
    dismissible = true,
    autoDismiss = 5000, // 5 seconds
    position = "center",
}: ServiceBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const [timeLeft, setTimeLeft] = useState(autoDismiss / 1000);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number>(0);
    const elapsedTimeRef = useRef<number>(0);

    useEffect(() => {
        // Show banner immediately when component mounts
        const hasDismissed = sessionStorage.getItem("service-banner-dismissed");
        if (!hasDismissed) {
            setIsVisible(true);
            setIsLoading(true);

            // Simulate server starting animation
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);

            startTimer();

            return () => {
                clearTimeout(loadingTimer);
                clearTimer();
            };
        }
    }, []);

    // Separate effect to handle pause/resume
    useEffect(() => {
        if (isPaused || isHovering) {
            clearTimer();
        } else if (isVisible) {
            startTimer();
        }
    }, [isPaused, isHovering]);

    const startTimer = () => {
        clearTimer();

        const totalTime = autoDismiss;
        const interval = 50; // update every 50ms for smoother animation
        startTimeRef.current = Date.now() - elapsedTimeRef.current;

        progressTimerRef.current = setInterval(() => {
            const currentElapsed = Date.now() - startTimeRef.current;
            elapsedTimeRef.current = currentElapsed;

            const newProgress = Math.max(0, 100 - (currentElapsed / totalTime) * 100);
            setProgress(newProgress);
            setTimeLeft(Math.ceil((newProgress / 100) * (autoDismiss / 1000)));

            if (newProgress <= 0) {
                clearTimer();
                handleDismiss();
            }
        }, interval);
    };

    const clearTimer = () => {
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const handleDismiss = () => {
        clearTimer();
        setIsVisible(false);
        if (dismissible) {
            sessionStorage.setItem("service-banner-dismissed", "true");
        }
    };

    const resetTimer = () => {
        clearTimer();
        elapsedTimeRef.current = 0;
        setProgress(100);
        setTimeLeft(autoDismiss / 1000);
        setIsPaused(false);
        setIsHovering(false);
        startTimer();
    };

    if (!isVisible) return null;

    const positionClasses = {
        center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        top: "top-4 left-1/2 transform -translate-x-1/2",
        bottom: "bottom-4 left-1/2 transform -translate-x-1/2",
    };

    const isTimerPaused = isPaused || isHovering;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                ref={bannerRef}
                className={cn(
                    "absolute w-full max-w-2xl px-4",
                    positionClasses[position]
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-blue-500/10 overflow-hidden group hover:shadow-blue-500/20 transition-shadow duration-300">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>

                    <CardContent className="p-8 relative">
                        {/* Timer control indicator */}
                        <div className="absolute -top-3 right-8">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "flex items-center gap-1.5 text-xs transition-all duration-300",
                                                isTimerPaused
                                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20 shadow-lg"
                                                    : "bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/20 shadow-lg"
                                            )}
                                        >
                                            {isTimerPaused ? (
                                                <>
                                                    <Pause className="w-3 h-3 animate-pulse" />
                                                    Paused
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-3 h-3" />
                                                    Active
                                                </>
                                            )}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            {isTimerPaused
                                                ? "Timer paused - leave area or click to resume"
                                                : "Timer running - hover to pause"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Left side - Icon and main message */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/30 flex items-center justify-center group-hover:border-blue-600/50 transition-all duration-300">
                                        {isLoading ? (
                                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                                        ) : (
                                            <Server className="w-10 h-10 text-green-400 animate-pulse" />
                                        )}
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white shadow-lg">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Free Tier
                                        </Badge>
                                    </div>
                                </div>

                                {/* Timer control button */}
                                <div className="mt-4 flex justify-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "w-full text-xs border-gray-700 transition-all duration-300",
                                                        isPaused
                                                            ? "text-green-400 hover:text-green-300 hover:border-green-500/50 bg-green-500/5"
                                                            : "text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/50 bg-yellow-500/5"
                                                    )}
                                                    onClick={togglePause}
                                                >
                                                    {isPaused ? (
                                                        <>
                                                            <Play className="w-3 h-3 mr-1" />
                                                            Resume
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Pause className="w-3 h-3 mr-1" />
                                                            Pause
                                                        </>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to {isPaused ? "resume" : "pause"} auto-dismiss timer</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Right side - Content */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-5 h-5 text-blue-400" />
                                            <AlertTitle className="text-2xl font-bold text-white">
                                                Server Starting Up
                                            </AlertTitle>
                                        </div>
                                        <p className="text-gray-300 text-lg mb-4">
                                            Our backend is running on free-tier resources. The first request may take a moment.
                                        </p>
                                    </div>

                                    {dismissible && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                                            onClick={handleDismiss}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Details grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:bg-gray-800/70 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
                                                <Cloud className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Cold Start Delay</p>
                                                <p className="text-xs text-gray-400">30-60 seconds on first request</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:bg-gray-800/70 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Subsequent Requests</p>
                                                <p className="text-xs text-gray-400">Much faster response times</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span>{isTimerPaused ? "Timer paused at" : "Auto-dismissing in"}</span>
                                                    <span className={cn(
                                                        "font-mono font-bold px-2 py-1 rounded transition-all duration-300",
                                                        isTimerPaused
                                                            ? "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30"
                                                            : "text-blue-400 bg-blue-500/10 border border-blue-500/30"
                                                    )}>
                                                        {timeLeft}s
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-1">
                                                    <Coffee className="w-3 h-3" />
                                                    {isTimerPaused ? "Paused" : "Please wait"}
                                                </span>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className={cn(
                                                    "h-2 transition-all duration-300",
                                                    isTimerPaused
                                                        ? "bg-gray-800/50"
                                                        : "bg-gray-800"
                                                )}
                                               
                                            />
                                        </div>

                                        <div className="text-sm text-gray-400 p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 group-hover:bg-gray-800/40 transition-colors">
                                            <p className="italic">
                                                "This is normal for free-tier hosting. Your patience helps us provide this service at no cost!"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                    <div className="text-sm text-gray-500">
                                        Need faster response times?
                                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto ml-2">
                                            Upgrade to Premium →
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-colors"
                                            onClick={resetTimer}
                                        >
                                            Reset timer
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-colors"
                                            onClick={handleDismiss}
                                        >
                                            Got it
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                                            onClick={handleDismiss}
                                        >
                                            Continue anyway
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hint that it's dismissible */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500 animate-pulse flex items-center justify-center gap-2">
                        {isTimerPaused ? (
                            <>
                                <Pause className="w-3 h-3 text-yellow-400" />
                                Timer paused - {isHovering ? "move mouse away" : "click resume"} to continue
                            </>
                        ) : (
                            <>
                                <Clock className="w-3 h-3 text-blue-400" />
                                Auto-dismissing in {timeLeft} seconds • Hover to pause
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}