import { resolve } from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    const projectRoot = resolve(__dirname, '../../');
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = projectRoot;

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = resolve(projectRoot, 'out/test');
    const testWorkspace = resolve(projectRoot, 'test-workspace');

    try {
        // Download VS Code, unzip it and run the integration test
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: 'insiders',
            launchArgs: [testWorkspace],
        });
    } catch (err) {
        console.error(err);
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
