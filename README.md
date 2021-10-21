# ez-hash-router

Easy to use hash router custom element. No frameworks, no polyfills, no dependencies.

## Installation

```sh
npm i --save ez-hash-router
```

## Basic Usage

You have to create a router element by extending the RouterElement base class. You can then insert your routes into the router element and it will take care fo the rest.

my-custom-router.js

```JavaScript
import { RouterElement } from 'ez-hash-router';
import { HelloWorld } from './src/pages/hello-world.js';

// Optionally declare the component if it doesn't exist.
if (customElements.get('my-hello-world') === undefined) {
  customElements.define('my-hello-world', HelloWorld);
}

export class MyCustomRouter extends RouterElement {
  constructor() {
    super():
  }

  connectedCallback() {
    // Create your routes.
    this.routes = [
      {
        "path": "", // Path to the base route.
        "go": () => `<my-hello-world></my-hello-world>` // Template you wish to render.
      }
    ];
    super.connectedCallback(); // Run the connected callback of the RouterElement.
  }
}
```

index.html

```HTML
<script type="module">
import { MyCustomRouter } from './src/components/my-custom-router.js';

customElements.define('my-custom-router', MyCustomRouter);
</script>
<my-custom-router></my-custom-router>
```

## Features

### Variables in the path.

ez-hash-router supports variables in the path. You can declare the variables in the path surrounding them in curly braces. Here is an example:

```
/blog/{postId}
```

The variable will be applied to the component at that path as an attribute.
This route:

```JavaScript
{
  path: '/blog/{post-id}',
  go: ({ variables }) => {
    return `
      <my-blog-post post-id="${variables[post-id]}"></my-blog-post>
    `;
  }
}
```

With this URL:

```
/post/123
```

Will render:

```HTML
<my-blog-post post-id="123"></my-blog-post>
```

Path variables can only be composed of alphanumeric characters and hyphens.

### Path not found

When a path is not found in your configuration the custom router will throw an Error. You can catch this error and handle it however you want. Here is an example where we alert the user they've tried to request a route that doesn't exist.

```HTML
<my-custom-router></my-custom-router>
<script>
  document.querySelector('my-custom-router').addEventListener('route-not-found', (e) => {
    alert(`Route not found!`);
  });
</script>
```

This is designed so that the user has some flexibility on how they want to handle the route.
