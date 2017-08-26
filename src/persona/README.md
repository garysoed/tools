Rendering stuff onto the template.

```typescript
const $projectName = staticId('projectName', StringParser);
const projectNameProvider = Graph.createProvider($projectName, 'Avatar');
const $ = selectors({
  name: {
    element: elementSelector('#name', InstanceofType(HTMLDivElement)),
    innerText: innerTextSelector(elementSelector('name.element'), StringType, StringParser),
  },
});

@customElement({
  name: 'gs-custom-element',
  parent: HTMLDivElement,
  templateKey: '/src/path/to/template',
})
class CustomElementCtrl extends BaseDisposable {
  // These are called when the element is attached.
  @render.innerText($.name.innerText)
  renderName(@nodeIn($projectName) projectName: string): string {
    return `Project: ${projectName}`;
  }
}

projectNameProvider('New Avatar'); // Updates the UI.
```

Reacting to DOM events.

```typescript
const $projectName = staticId('projectName', StringParser);
const projectNameProvider = Graph.createProvider($projectName, 'Avatar');
const $ = selectors({
  name: {
    element: elementSelector('#name', InstanceofType(HTMLDivElement)),
    innerText: innerTextSelector(elementSelector('name.element'), StringType, StringParser),
  },
  button: {
    element: elementSelector('#button', InstanceofType(HTMLButtonElement)),
  },
});

@customElement({
  name: 'gs-custom-element',
  parent: HTMLDivElement,
  templateKey: '/src/path/to/template',
})
class CustomElementCtrl extends BaseDisposable {
  // These are called when the element is attached.
  @render.innerText($.name)
  renderName(@nodeIn($projectName) projectName: string): string {
    return `Project: ${projectName}`;
  }

  @onDom.event($.button.element, 'click')
  onButtonClick(): void {
    projectNameProvider('New Avatar'); // Eventually updates the UI.
  }
}
```
