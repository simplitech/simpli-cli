export default class AnchorRender {
  constructor(readonly label?: string, readonly href?: string, readonly target: string = '_self') {}

  toHtml() {
    if (!this.label || !this.href) return ''
    return `
    <a href="${this.href}" target="${this.target}">
      ${this.label}
    </a>
    `
  }
}
