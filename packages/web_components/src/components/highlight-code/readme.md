# framekit-code



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type      | Default             |
| ---------------- | ----------------- | ----------- | --------- | ------------------- |
| `anchor`         | `anchor`          |             | `string`  | `'// Framekit'`     |
| `anchorZoom`     | `anchor-zoom`     |             | `string`  | `'// FramekitZoom'` |
| `hideAnchor`     | `hide-anchor`     |             | `boolean` | `true`              |
| `highlightLines` | `highlight-lines` |             | `string`  | `undefined`         |
| `language`       | `language`        |             | `string`  | `'javascript'`      |
| `src`            | `src`             |             | `string`  | `undefined`         |


## Events

| Event                 | Description | Type                  |
| --------------------- | ----------- | --------------------- |
| `prismLanguageLoaded` |             | `CustomEvent<string>` |


## Methods

### `findNextAnchor(enter: boolean) => Promise<HeathScriptHighlightCodeAnchor>`



#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| `enter` | `boolean` |             |

#### Returns

Type: `Promise<HeathScriptHighlightCodeAnchor>`



### `load() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `zoomCode(zoom: boolean) => Promise<void>`



#### Parameters

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| `zoom` | `boolean` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
