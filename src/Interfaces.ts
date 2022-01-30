export interface Command {
  execute(): Promise<any>;
}

export interface CommandData {
  command: string;
  args: any;
}

export interface EditorFile {
  path: string;
  column?: string;
}
