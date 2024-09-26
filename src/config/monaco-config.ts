import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

monaco.languages.register({ id: "graphql" });

monaco.languages.setMonarchTokensProvider("graphql", {
  tokenizer: {
    root: [
      [
        /[a-z_$][\w$]*/,
        { cases: { "@keywords": "keyword", "@default": "identifier" } },
      ],
      [/[A-Z][\w\$]*/, "type.identifier"],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/#.*$/, "comment"],
    ],
  },
  keywords: [
    "query",
    "mutation",
    "subscription",
    "fragment",
    "on",
    "type",
    "input",
    "enum",
    "interface",
    "union",
    "scalar",
    "schema",
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "+",
    "-",
    "*",
    "/",
    "^",
    "%",
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
});

monaco.languages.registerCompletionItemProvider("graphql", {
  provideCompletionItems: (model, position) => {
    const suggestions = [
      {
        label: "query",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "query ${1:QueryName} {\n\t${2}\n}",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Query operation",
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      },
      {
        label: "mutation",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "mutation ${1:MutationName} {\n\t${2}\n}",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Mutation operation",
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      },
    ];
    return { suggestions: suggestions };
  },
});
