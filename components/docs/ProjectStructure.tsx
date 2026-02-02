'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, ChevronRight, ChevronDown, FileText, Package, GitBranch, Settings } from 'lucide-react';

interface TreeNode {
    name: string;
    type: 'folder' | 'file';
    children?: TreeNode[];
    icon?: React.ReactNode;
}

const projectStructure: TreeNode[] = [
    {
        name: 'authplus',
        type: 'folder',
        icon: <Folder className="w-4 h-4 text-blue-500" />,
        children: [
            {
                name: 'backend',
                type: 'folder',
                icon: <Folder className="w-4 h-4 text-green-500" />,
                children: [
                    {
                        name: 'src',
                        type: 'folder',
                        icon: <Folder className="w-4 h-4 text-yellow-500" />,
                        children: [
                            {
                                name: 'main/java/com/authplus',
                                type: 'folder',
                                icon: <Folder className="w-4 h-4 text-purple-500" />,
                                children: [
                                    {
                                        name: 'controller',
                                        type: 'folder',
                                        icon: <Folder className="w-4 h-4 text-pink-500" />,
                                        children: [
                                            { name: 'AuthController.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                            { name: 'UserController.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                        ]
                                    },
                                    {
                                        name: 'service',
                                        type: 'folder',
                                        icon: <Folder className="w-4 h-4 text-indigo-500" />,
                                        children: [
                                            { name: 'AuthService.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                            { name: 'JwtService.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                        ]
                                    },
                                    {
                                        name: 'security',
                                        type: 'folder',
                                        icon: <Folder className="w-4 h-4 text-teal-500" />,
                                        children: [
                                            { name: 'JwtAuthFilter.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                            { name: 'SecurityConfig.java', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'resources',
                                type: 'folder',
                                icon: <Folder className="w-4 h-4 text-orange-500" />,
                                children: [
                                    { name: 'application.yml', type: 'file', icon: <Settings className="w-4 h-4 text-gray-500" /> },
                                ]
                            }
                        ]
                    },
                    {
                        name: 'pom.xml',
                        type: 'file',
                        icon: <Package className="w-4 h-4 text-amber-500" />
                    },
                    {
                        name: '.env.example',
                        type: 'file',
                        icon: <FileText className="w-4 h-4 text-gray-500" />
                    }
                ]
            },
            {
                name: 'frontend',
                type: 'folder',
                icon: <Folder className="w-4 h-4 text-cyan-500" />,
                children: [
                    {
                        name: 'app',
                        type: 'folder',
                        icon: <Folder className="w-4 h-4 text-blue-500" />,
                        children: [
                            { name: 'page.tsx', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                            { name: 'layout.tsx', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                            {
                                name: 'auth',
                                type: 'folder',
                                icon: <Folder className="w-4 h-4 text-purple-500" />,
                                children: [
                                    { name: 'login', type: 'folder', icon: <Folder className="w-4 h-4 text-pink-500" /> },
                                    { name: 'register', type: 'folder', icon: <Folder className="w-4 h-4 text-pink-500" /> },
                                    { name: 'callback', type: 'folder', icon: <Folder className="w-4 h-4 text-pink-500" /> },
                                ]
                            }
                        ]
                    },
                    {
                        name: 'components',
                        type: 'folder',
                        icon: <Folder className="w-4 h-4 text-green-500" />,
                        children: [
                            {
                                name: 'auth',
                                type: 'folder',
                                icon: <Folder className="w-4 h-4 text-yellow-500" />,
                                children: [
                                    { name: 'LoginForm.tsx', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                    { name: 'SocialButtons.tsx', type: 'file', icon: <File className="w-4 h-4 text-red-500" /> },
                                ]
                            }
                        ]
                    },
                    {
                        name: 'package.json',
                        type: 'file',
                        icon: <Package className="w-4 h-4 text-amber-500" />
                    },
                    {
                        name: '.env.local',
                        type: 'file',
                        icon: <Settings className="w-4 h-4 text-gray-500" />
                    }
                ]
            },
            {
                name: 'README.md',
                type: 'file',
                icon: <FileText className="w-4 h-4 text-gray-500" />
            },
            {
                name: '.gitignore',
                type: 'file',
                icon: <GitBranch className="w-4 h-4 text-gray-500" />
            },
            {
                name: 'docker-compose.yml',
                type: 'file',
                icon: <Package className="w-4 h-4 text-amber-500" />
            }
        ]
    }
];

function TreeNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const handleClick = () => {
        if (node.type === 'folder') {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${depth === 0 ? 'font-semibold' : ''}`}
                style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
            >
                {node.type === 'folder' ? (
                    <span className="mr-1">
                        {isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-3 h-3 text-gray-500" />
                        )}
                    </span>
                ) : (
                    <span className="w-4 mr-1" />
                )}
                <span className="mr-2">{node.icon}</span>
                <span className={`text-sm ${node.type === 'folder' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    {node.name}
                </span>
            </div>

            <AnimatePresence>
                {isExpanded && node.children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child, index) => (
                            <TreeNode key={index} node={child} depth={depth + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ProjectStructure() {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Project Structure
                </h3>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    {showAll ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            <div className="font-mono text-sm">
                {projectStructure.map((node, index) => (
                    <TreeNode key={index} node={node} depth={0} />
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <Folder className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Directory</span>
                    </div>
                    <div className="flex items-center">
                        <File className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">File</span>
                    </div>
                    <div className="flex items-center">
                        <Package className="w-4 h-4 text-amber-500 mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Config</span>
                    </div>
                </div>
            </div>
        </div>
    );
}