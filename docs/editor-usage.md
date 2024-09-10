<script setup>
import Editor from "./components/demo/editor-app/editor.vue"
</script>

<DemoContainer>
  <Editor />
</DemoContainer>

<<< @/components/demo/editor-app/editor.vue

## Properties

| Name   | Type            | Default | Description              |
| ------ | --------------- | ------- | ------------------------ |
| config | EditorAppConfig | -       | Configures the EditorApp |

## Events

| Name         | Parameters  | Description                                         |
| ------------ | ----------- | --------------------------------------------------- |
| action-click | ActionEvent | Action event fired when an action has been clicked. |

## Resolver Map

<<< @/components/demo/editor-app/resolvermap.ts

## Blueprints

<<< @/components/demo/editor-app/blueprints.ts
