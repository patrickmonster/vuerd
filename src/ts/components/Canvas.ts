import { html, customElement, property } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import { repeat } from "lit-html/directives/repeat";
import { EditorElement } from "./EditorElement";
import "./Table";
import "./CanvasSVG";

@customElement("vuerd-canvas")
class Canvas extends EditorElement {
  get theme() {
    const { canvas } = this.context.theme;
    const { width, height } = this.context.store.canvasState;
    return {
      backgroundColor: canvas,
      width: `${width}px`,
      height: `${height}px`
    };
  }

  constructor() {
    super();
    console.log("Canvas constructor");
  }
  connectedCallback() {
    super.connectedCallback();
    console.log("Canvas before render");
  }
  firstUpdated() {
    console.log("Canvas after render");
  }
  disconnectedCallback() {
    console.log("Canvas destroy");
    super.disconnectedCallback();
  }

  render() {
    console.log("Canvas render");
    const { tables } = this.context.store.tableState;
    return html`
      <div class="vuerd-canvas" style=${styleMap(this.theme)}>
        ${repeat(
          tables,
          table => table.id,
          table => html`
            <vuerd-table .table=${table} .context=${this.context}></vuerd-table>
          `
        )}
        <vuerd-canvas-svg .context=${this.context}></vuerd-canvas-svg>
      </div>
    `;
  }
}
