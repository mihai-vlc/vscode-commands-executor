# VSCode Commands Executor

Enables the execution of vscode commands on open vscode via the vscode:// URI and keyboard shortcuts.

## Features

### Executing commands via the vscode:// URI

```sh
code --open-url 'vscode://ionutvmi.vscode-commands-executor/runCommands?data=[{"id": "workbench.
action.editorLayoutThreeRows"}, {"id": "workbench.action.files.newUntitledFile" }, { "id": "
default:type", "args": { "text": "Very nice !" } }]'

code --open-url 'vscode://ionutvmi.vscode-commands-executor/openFiles?data=[{"path": "C:/tmp/tes
t.txt" }]&layout=TwoColumns'

code --open-url 'vscode://ionutvmi.vscode-commands-executor/openFiles?data=[{"path": "C:/t
mp/test.txt", "column": "Two" }]&layout=TwoColumns&newWindow=true'

```

### Executing commands via custom keyboard bindings

To register custom keyboard shortcuts for a groups of commands follow the examples below.

```json
[
  // keybindings.json
  {
    "key": "ctrl+alt+/",
    "command": "vscode-commands-executor.run",
    "args": {
      "command": "openFiles",
      "args": {
        "layout": "TwoColumns",
        "data": [
          {
            "path": "C:/tmp/test.txt",
            "column": "Two"
          }
        ]
      }
    }
  },
  {
    "key": "ctrl+alt+\\",
    "command": "vscode-commands-executor.run",
    "args": {
      "command": "runCommands",
      "args": {
        "data": [
          {
            "id": "workbench.action.editorLayoutThreeRows"
          },
          {
            "id": "workbench.action.files.newUntitledFile"
          },
          {
            "id": "default:type",
            "args": {
              "text": "Very nice !"
            }
          }
        ]
      }
    }
  }
]
```

## Supported commands

### openFiles

Opens a list of files and optionally configures an editor layout.

Parameters:
| Parameter | Required | Description |
|:-----|:-------|:-----|
| data| Yes | Array of objects - contains the list of files that will be opened. <br/><br/>A file consists of the following:<br/> - `path` - full path to the document on the disk<br/>- `column` - The location of the files in the configured layout. Possible values are described in the `vscode.ViewColumn` |
| layout | No | String - Triggers the following command before opening the files: `workbench.action.editorLayout<layout>` |
| newWindow | No | Boolean - If false the files are opened in the topmost vscode window. <br/> If true it will first open a new window then open the files. |

### runCommands

Executes a sequence of pre-defined commands.

Parameters:
| Parameter | Required | Description |
|:-----|:-------|:-----|
| data| Yes | Array of objects - contains the list of commands to be executed. <br/><br/>A commands consists of the following:<br/> - `id` - Required - the id of the command that will be executed<br/>- `args` - Optional - The arguments of the command. |
| newWindow | No | Boolean - If `false` the commands are executed in the topmost vscode window. <br/> If `true` it will first open a new window then open the files. |

## Release Notes

#### 30-Jan-2022

Initial Release

## Author

Mihai Ionut Vilcu

- [github/ionutvmi](https://github.com/ionutvmi)
- [twitter/mihaivlc93](http://twitter.com/mihaivlc93)
