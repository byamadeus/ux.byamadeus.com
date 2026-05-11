const NAV_ITEMS = [
	{
		name: 'Brand',
		href: 'https://byamadeus.com/',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarge-small-icon lucide-a-large-small"><path d="m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16"/><path d="M15.697 14h5.606"/><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"/><path d="M3.304 13h6.392"/></svg>`,
	},
	{
		name: 'UX',
		href: 'https://ux.byamadeus.com/',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer"><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h2"/><path d="M14 3h1"/><path d="M3 9v1"/><path d="M21 9v2"/><path d="M3 14v1"/></svg>`,
	},
	{
		name: 'Sites',
		href: 'https://sites.byamadeus.com/',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-app-window-icon lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>`,
	},
	{
		name: 'Tests',
		href: 'https://tests.byamadeus.com/',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-origami-icon lucide-origami"><path d="M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025"/><path d="m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009"/><path d="m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"/></svg>`,
	},];
class PNav extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		const items = NAV_ITEMS.map(
			(item) => `
			<a class="pnav-item" href="${item.href}">
				<span class="pnav-icon">${item.icon}</span>
				<span class="pnav-label">${item.name}</span>
			</a>`
		).join('');
		this.shadowRoot.innerHTML = `
			<style>${PNav.styles}</style>
			<div class="pnav" aria-label="Portfolio navigation">
				<div class="pnav-track">
					<span class="pnav-pill">ux.byamadeus.com</span>
					<div class="pnav-items">${items}</div>
				</div>
			</div>
		`;
	}
static get styles() {
return `
.pnav{--pnav-bg:rgba(255,255,255,.36);--hover-color:rgba(209,209,209,.77);--border-color:rgba(10,10,10,.1);--text-color:rgb(10,10,10);--item-text-color:rgb(10,10,10);position:fixed;top:24px;left:50%;translate:-50% 0;z-index:9999;font-family:system-ui,-apple-system,sans-serif}
.pnav-track{position:relative;display:flex;align-items:center;justify-content:center}
.pnav-pill{display:inline-flex;align-items:center;padding:6px 14px;font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-color);background:var(--pnav-bg);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border:1px solid var(--border-color);border-radius:100px;cursor:default;white-space:nowrap;transition:opacity .25s,scale .25s}
.pnav-items{position:absolute;display:flex;gap:4px;padding:4px;background:var(--pnav-bg);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border:1px solid var(--border-color);border-radius:64px;opacity:0;scale:.92;pointer-events:none;transition:opacity .3s,scale .3s}
.pnav-item{display:flex;align-items:center;gap:4px;padding:10px 16px;border-radius:24px;color:var(--item-text-color);text-decoration:none;transition:background .3s,color .5s}
.pnav-item:hover{background:var(--hover-color);color:var(--text-color)}
.pnav-icon{display:flex;align-items:center;justify-content:center;width:18px;height:18px}
.pnav-label{font-size:11px;font-weight:500;letter-spacing:.02em;white-space:nowrap}
.pnav-track:hover .pnav-pill{opacity:0;scale:.9;pointer-events:none}
.pnav-track:hover .pnav-items{opacity:1;scale:1;pointer-events:auto}
`;}
}
if(!customElements.get('portfolio-nav'))customElements.define('portfolio-nav',PNav);