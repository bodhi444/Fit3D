class Content extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <h1 class="text-6xl text-red-700"> hi</h1>
        `;
  }
}

customElements.define("base-component", Content);
