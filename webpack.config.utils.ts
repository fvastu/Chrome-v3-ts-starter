import { ProgressPlugin, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';

const ExtReloader = require('webpack-ext-reloader-mv3');

const baseManifest = require('./src/baseManifest.json');

const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

interface EnvironmentConfig {
    NODE_ENV: string;
    OUTPUT_DIR: string;
    TARGET: string;
}

export const Directories = {
    DEV_DIR: 'dev',
    DIST_DIR: 'dist',
    TEMP_DIR: 'temp',
    SRC_DIR: 'src',
};

/**
 * Environment Config
 *
 */
const EnvConfig: EnvironmentConfig = {
    OUTPUT_DIR:
        process.env.NODE_ENV === 'production'
            ? Directories.TEMP_DIR
            : process.env.NODE_ENV === 'upload'
            ? Directories.DIST_DIR
            : Directories.DEV_DIR,
    ...(process.env.NODE_ENV ? { NODE_ENV: process.env.NODE_ENV } : { NODE_ENV: 'development' }),
    ...(process.env.TARGET ? { TARGET: process.env.TARGET } : { TARGET: 'chrome' }),
};

/**
 * Get HTML Plugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getHTMLPlugins = (
    browserDir: string,
    outputDir = Directories.DEV_DIR,
    sourceDir = Directories.SRC_DIR
) => [
    new HtmlWebpackPlugin({
        title: 'Popup',
        filename: path.resolve(__dirname, `${outputDir}/${browserDir}/popup/popup.html`),
        template: path.resolve(__dirname, `${sourceDir}/popup/popup.html`),
        chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
        title: 'settings',
        filename: path.resolve(__dirname, `${outputDir}/${browserDir}/settings/settings.html`),
        template: path.resolve(__dirname, `${sourceDir}/settings/settings.html`),
        chunks: ['settings'],
    }),
    new HtmlWebpackPlugin({
        title: 'Stats',
        filename: path.resolve(__dirname, `${outputDir}/${browserDir}/stats/stats.html`),
        template: path.resolve(__dirname, `${sourceDir}/stats/stats.html`),
        chunks: ['stats'],
    }),
];

/**
 * Get DefinePlugins
 *
 * @param config
 * @returns
 */
export const getDefinePlugins = (config = {}) => [
    new DefinePlugin({
        'process.env': JSON.stringify({ ...config, ...(dotenv.parsed ?? {}) }),
    }),
];

/**
 * Get Output Configurations
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getOutput = (browserDir: string, outputDir = Directories.DEV_DIR) => {
    return {
        path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
        filename: '[name]/[name].js',
    };
};

/**
 * Get Entry Points
 *
 * @param sourceDir
 * @returns
 */
export const getEntry = (sourceDir = Directories.SRC_DIR) => {
    return {
        popup: [path.resolve(__dirname, `${sourceDir}/popup/popup.ts`)],
        settings: [path.resolve(__dirname, `${sourceDir}/settings/settings.ts`)],
        stats: [path.resolve(__dirname, `${sourceDir}/stats/stats.ts`)],
        content: [path.resolve(__dirname, `${sourceDir}/content/cosmetics.ts`)],
        ['password-enforcer']: path.resolve(__dirname, `${sourceDir}/content/password-enforcer.ts`),
        ['copy-paste-unlocker']: path.resolve(__dirname, `${sourceDir}/content/copy-paste-unlocker.ts`),
        // autoconsent: [path.resolve(__dirname, `${sourceDir}/content/autoconsent.ts`)],
        background: [path.resolve(__dirname, `${sourceDir}/background/index.ts`)],
    };
};

/**
 * Get CopyPlugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getCopyPlugins = (
    browserDir: string,
    outputDir = Directories.DEV_DIR,
    sourceDir = Directories.SRC_DIR
) => {
    return [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `${sourceDir}/assets`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`),
                },
                {
                    from: path.resolve(__dirname, `${sourceDir}/shared/_locales`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`),
                },
                {
                    from: path.resolve(__dirname, `${sourceDir}/settings/`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/settings`),
                    filter: (resourcePath) => resourcePath.endsWith('.css'),
                },
                {
                    from: path.resolve(__dirname, `${sourceDir}/popup/`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/popup`),
                    filter: (resourcePath) => resourcePath.endsWith('.css'),
                },
                {
                    from: path.resolve(__dirname, `${sourceDir}/stats/`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/stats`),
                    filter: (resourcePath) => resourcePath.endsWith('.css'),
                },
            ],
        }),
    ];
};

/**
 * Get ZipPlugins
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getZipPlugins = (browserDir: string, outputDir = Directories.DIST_DIR) => {
    return [
        new ZipPlugin({
            path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
            filename: browserDir,
            extension: 'zip',
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },
            zipOptions: {
                forceZip64Format: false,
            },
        }),
    ];
};

/**
 * Get Analyzer Plugins
 *
 * @returns
 */
export const getAnalyzerPlugins = () => {
    return [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
        }),
    ];
};

/**
 * Get CleanWebpackPlugins
 *
 * @param dirs
 * @returns
 */
export const getCleanWebpackPlugins = (...dirs: string[]) => {
    return [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [...dirs?.map((dir) => path.join(process.cwd(), `${dir}`) ?? [])],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
    ];
};

/**
 * Get Resolves
 *
 * @returns
 */
export const getResolves = () => {
    return {
        alias: {
            utils: path.resolve(__dirname, './src/utils/'),
            popup: path.resolve(__dirname, './src/popup/'),
            background: path.resolve(__dirname, './src/background/'),
            features: path.resolve(__dirname, './src/features'),
            core: path.resolve(__dirname, './src/core'),
            settings: path.resolve(__dirname, './src/settings/'),
            stats: path.resolve(__dirname, './src/stats/'),
            content: path.resolve(__dirname, './src/content/'),
            assets: path.resolve(__dirname, './src/assets/'),
            components: path.resolve(__dirname, './src/components/'),
            lib: path.resolve(__dirname, './src/lib/'),
            types: path.resolve(__dirname, './src/types/'),
            hooks: path.resolve(__dirname, './src/hooks/'),
            shared: path.resolve(__dirname, './src/shared'),
            '@redux': path.resolve(__dirname, './src/@redux/'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    };
};

/**
 * Get Extension Manifest Plugins
 *
 * @returns
 */
export const getExtensionManifestPlugins = () => {
    return [
        new WebpackExtensionManifestPlugin({
            config: { base: baseManifest },
        }),
    ];
};

export const eslintOptions = {
    fix: true,
};

/**
 * Get Eslint Plugins
 *
 * @returns
 */
export const getEslintPlugins = (options = eslintOptions) => {
    return [new ESLintPlugin(options)];
};

/**
 * Get Progress Plugins
 *
 * @returns
 */
export const getProgressPlugins = () => {
    return [new ProgressPlugin()];
};

/**
 * Environment Configuration Variables
 *
 */
export const config = EnvConfig;

/**
 * Get Extension Reloader Plugin
 *
 * @returns
 */
export const getExtensionReloaderPlugins = () => {
    return [
        new ExtReloader({
            port: 9090,
            reloadPage: true,
            entries: {
                contentScript: ['cosmetics'],
                background: 'background',
                extensionPage: ['popup', 'options'],
            },
        }),
    ];
};
