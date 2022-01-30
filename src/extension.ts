import * as vscode from "vscode";
import CommandsProcessor from "./CommandsProcessor";
import CustomUriHandler from "./UriHandler";

export async function activate(context: vscode.ExtensionContext) {
  let commandsProcessor = new CommandsProcessor();

  // process any postponed commands
  let postponedCommand: any = context.globalState.get("postponedCommand");

  if (postponedCommand) {
    context.globalState.update("postponedCommand", undefined);
    commandsProcessor.parseCommand(postponedCommand);

    commandsProcessor.executeCommands();
  }

  // listen for new commands
  let uriHandler = new CustomUriHandler(context, commandsProcessor);
  uriHandler.register();

  vscode.commands.registerCommand("vscode-commands-executor.run", (args) => {
    commandsProcessor.parseCommand(args);
    commandsProcessor.executeCommands();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
