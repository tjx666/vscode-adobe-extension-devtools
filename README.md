# Adobe Extension Development Tools

## Features

### JSX module definition jump

![JSX module definition jump](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/jump_to_definition.gif?raw=true)

You need to set fie associations to tell vscode treat `.jsx` as javascript:

```json
{
    "files.associations": {
            "**/JSX/**/*.jsx": "javascript"
    }
}
```

### AE Composition Tree View

For MacOS Only Now, you need to manually refresh the outline to get latest info about activate composition.

![AE Composition Tree View](https://github.com/tjx666/adobe-extension-devtools/blob/master/assets/screenshot/ae_composition_outline.gif?raw=true)

## TODOs

- [x] JSX module definition jump
- [x] AE Composition Tree View
- [ ] Snippets
- [ ] char id to string id
- [ ] string id to char id
- [ ] PS Document Tree View
- [ ] Paste last operation AM script

## Related

- [VSCode Scripting Listener](https://github.com/tjx666/scripting-listener)