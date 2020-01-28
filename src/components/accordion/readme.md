# bpds-accordion



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                    | Description | Type     | Default     |
| -------------------------- | ---------------------------- | ----------- | -------- | ----------- |
| `accordionContainerHeight` | `accordion-container-height` |             | `any`    | `undefined` |
| `convToHTMLElement`        | `conv-to-h-t-m-l-element`    |             | `any`    | `undefined` |
| `cssClass`                 | `css-class`                  |             | `string` | `undefined` |
| `height`                   | `height`                     |             | `string` | `'400'`     |
| `idx`                      | `idx`                        |             | `any`    | `undefined` |
| `value`                    | `value`                      |             | `string` | `''`        |
| `width`                    | `width`                      |             | `string` | `'100%'`    |


## Events

| Event    | Description | Type                |
| -------- | ----------- | ------------------- |
| `change` |             | `CustomEvent<void>` |


## Methods

### `currentTab() => Promise<number>`



#### Returns

Type: `Promise<number>`



### `expand(accordionPanelIndex: number) => void`



#### Parameters

| Name                  | Type     | Description |
| --------------------- | -------- | ----------- |
| `accordionPanelIndex` | `number` |             |

#### Returns

Type: `void`



### `getNewHeight() => Promise<string>`



#### Returns

Type: `Promise<string>`



### `openAccordionPanel(accordionPanelIndex: number) => void`



#### Parameters

| Name                  | Type     | Description |
| --------------------- | -------- | ----------- |
| `accordionPanelIndex` | `number` |             |

#### Returns

Type: `void`



### `removeFocus(accordionPanelIndex: number) => void`



#### Parameters

| Name                  | Type     | Description |
| --------------------- | -------- | ----------- |
| `accordionPanelIndex` | `number` |             |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
