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
      <my-blog-post post-id="${variables['post-id']}"></my-blog-post>
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

When you try to reach a route that is not defined, the router will render a notFound message. You can customize this message by creating your own custom notFound function and setting this.innerHTML to the template you desire.

```JavaScript
class MyRouter extends RouterElement {
  constructor() {
    super();
  }

  notFound() {
    this.innerHTML = `Oh no! We couldn't find that page.`;
  }

  connectedCallback() {
    this.routes = [
      {
        path: '/',
        go: () => `<my-home-page></my-home-page>`
      }
    ];
    super.connectedCallback();
  }
}
```
