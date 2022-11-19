import * as vscode from "vscode";
import CommandsProcessor from "./CommandsProcessor";
import StartupProcessor from "./startup/StartupProcessor";
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

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-commands-executor.run", (args) => {
      if (args && args.args && args.args.newWindow) {
        context.globalState.update("postponedCommand", args);

        // doing this to allow the new window to take the focus
        setTimeout(() => {
          vscode.commands.executeCommand("workbench.action.newWindow");
        }, 200);
      } else {
        commandsProcessor.parseCommand(args);
        commandsProcessor.executeCommands();
      }
    })
  );

  const startupProcessor = new StartupProcessor();
  startupProcessor.readConfigurations();
  startupProcessor.runCommands();
}

// this method is called when your extension is deactivated
export function deactivate() {}
