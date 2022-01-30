import { Command, EditorFile } from "../Interfaces";
import * as vscode from "vscode";

export default class OpenFilesCommand implements Command {
  constructor(private files: Array<any>, private layout?: string) {}

  async execute() {
    if (this.layout) {
      await vscode.commands.executeCommand(
        "workbench.action.editorLayout" + this.layout
      );
    }

    this.files.forEach(async (file: EditorFile) => {
      let document = await vscode.workspace.openTextDocument(file.path);
      let column = file.column as keyof typeof vscode.ViewColumn; // because typescript

      await vscode.window.showTextDocument(document, {
        viewColumn: column ? vscode.ViewColumn[column] : undefined,
      });
    });
  }
}
