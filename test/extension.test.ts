import assert from 'assert';
import vscode from 'vscode';

describe('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    it('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});
