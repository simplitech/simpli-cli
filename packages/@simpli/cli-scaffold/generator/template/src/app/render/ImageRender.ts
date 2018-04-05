export default class ImageRender {
  constructor(readonly url?: string, readonly alt?: string) {}

  toHtml() {
    if (!this.url) return ''
    return `
    <img src="${this.url}" alt="${this.alt || 'image'}"
    class="img-rounded" style="height: 100px"/>
    `
  }
}
