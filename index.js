const generateVariablesAndRegularExpression = (path) => {
  const regex = /{[a-zA-Z]*}/g;
  // Get variable names.
  const variableNames = [...path.matchAll(regex)].map((match) => {
    return match[0].replace(/[{|}]/g, '');
  });
  // Get matcher.
  const regularExpression = new RegExp(
    path.replaceAll(regex, `([a-zA-Z1-9\\-]*)`).replaceAll(/\//g, '/')
  );
  return {
    variableNames,
    regex: regularExpression,
  };
};

const getVariables = (path, { variables, regex }) => {
  const variableValues = [...path.match(regex)].filter((value) => value !== '');
  variableValues.shift();
  return variableValues.map((value, index) => ({
    name: variables[index],
    value,
  }));
};

const createRouteIndex = (route) => {
  const { variableNames, regex } = generateVariablesAndRegularExpression(
    route.path
  );
  return {
    ...route,
    variables: variableNames,
    regex,
  };
};

const createRouteIndexes = (routes) => routes.map(createRouteIndex);

export class RouterElement extends HTMLElement {
  constructor() {
    super();
    if (this.constructor == RouterElement) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  indexRoutes() {
    if (!this.routes)
      throw new Error(
        'Router element needs routes defined in the connected callback.'
      );
    this._indexedRoutes = createRouteIndexes(
      this.routes.sort((a, b) => {
        return a.path.length < b.path.length ? 1 : -1;
      })
    );
  }

  get indexedRoutes() {
    return this._indexedRoutes;
  }

  onHashChange() {
    const hash = window.location.hash;
    const safeHash = hash && hash.substring(1);
    if (safeHash !== this.currentPath) {
      this.currentPath = safeHash;
      this.render();
    }
  }

  connectedCallback() {
    this.indexRoutes();
    this.currentPath =
      window.location.hash && window.location.hash.substring(1);
    this.render();
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.onHashChange.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.indexRoutes();
      this.render();
    }
  }

  async render() {
    const route = this.indexedRoutes.find((indexedRoute) =>
      indexedRoute.regex.test(this.currentPath)
    );
    if (!route || (route.path === '' && this.currentPath !== '')) {
      this.dispatchEvent(new Event('route-not-found'));
      return;
    }
    if (this.previousRoute && route.path === this.previousRoute.path) return;
    this.previousRoute = route;
    const variables = getVariables(this.currentPath, route);
    const template = document.createElement('template');
    try {
      template.innerHTML = await route.go({
        variables,
      });
      this.innerHTML = '';
      this.appendChild(template.content.cloneNode(true));
    } catch (e) {
      throw new Error(e);
    }
  }
}
