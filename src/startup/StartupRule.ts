import * as vscode from "vscode";
import { RuleConfiguration } from "./RuleConfiguration";

export default class StartupRule {
  constructor(private config: RuleConfiguration) {}

  async isApplicable() {
    if (!this.config.conditions) {
      return true;
    }

    const conditions = this.config.conditions.map(async (condition) => {
      const [id, ...rest] = condition.split(":");
      const args = rest.map((v) => v.trim());

      switch (id) {
        case "never":
          return false;

        case "always":
          return true;

        case "hasFile":
          const results = await vscode.workspace.findFiles(args[0], "", 1);
          return Array.isArray(results) && results.length > 0;

        case "hasWorkspaceFolder":
          const workspaceFolders = vscode.workspace.workspaceFolders;

          if (!workspaceFolders) {
            return false;
          }

          return workspaceFolders.some((folder) => {
            const folderMatches = folder.uri.fsPath.match(/([^\/]*)\/*$/);
            const match = folderMatches && folderMatches[1];
            return match && match === args[0];
          });
        default:
          vscode.window.showErrorMessage("Invalid startup condition " + id);
          return false;
      }
    });

    return (await Promise.all(conditions)).every(Boolean);
  }

  async executeCommands() {
    if (!this.config.commands) {
      vscode.window.showErrorMessage(
        "Incomplete configuration for startup rule. Missing commands."
      );
      return;
    }

    if (this.config.message) {
      vscode.window.showInformationMessage(this.config.message);
    }

    this.config.commands.forEach(async (command) => {
      const args = command.args || [];
      await vscode.commands.executeCommand(command.id, ...args);
    });
  }
}
