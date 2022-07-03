# Adobe Extension Development Tools

> **Note**: Only for MacOS now!

## ExtendScript Features

### JSX module definition jump

![JSX module definition jump](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/jump_to_definition.gif?raw=true)

You need to set fie associations to tell vscode treat `.jsx` as javascript:

```json
{
    "files.associations": {
            "**/jsx_folder/**/*.jsx": "javascript"
    }
}
```

## AE Features

### AE Composition Tree View

You need to manually refresh the outline to get latest info about active composition.

![AE Composition Tree View](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/ae_composition_outline.gif?raw=true)

## PS Features

### View Active Layer Descriptor Info

You can open an editor to view the current active layer descriptor info with command `View Active Layer Descriptor Info`:

![Layer Info](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/layer_info.gif?raw=true)

### View Active Layer Descriptor Info in Diff Editor

When you develop ps extension, you may often need to compare the layer descriptor info before and after an operation. Call command `View Active Layer Descriptor Info in Diff Editor` will open a diff editor, and fill the before editor with latest active layer descriptor info. Call twice will fill the latest info to after editor.

![Layer Info Diff Editor](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/layer_info_diff.gif?raw=true)

### Action Manager ids transform between charID, stringID, typeID

Select the id you want to transform and call corresponding command, support following commands:

- `convert char id to type id`
- `convert char id to string id`
- `convert string id to type id`
- `convert string id to char id`
- `convert type id to char id`
- `convert type id to string id`

![id transform](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/id_transform.gif?raw=true)

## TODOs

- [x] JSX module definition jump
- [x] AE Composition Tree View
- [x] Snippets, recommend: [My personal snippets](https://marketplace.visualstudio.com/items?itemName=YuTengjing.ytj-snippets)
- [x] PS view layer descriptor info, support diff mode
- [x] PS view document descriptor info, support diff mode
- [x] PS view application descriptor info, support diff mode
- [x] PS id transform between charID, StringID, typeID

## Related

- [VSCode Scripting Listener](https://github.com/tjx666/scripting-listener)
