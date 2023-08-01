import type { PurifierMiddlware } from "./middleware";

export class NaughtyHrefMiddleware implements PurifierMiddlware {
	private naughtyHosts = new Set(["evil.com", "malware.org"]);

	allowedTags = new Set(["a"]);
	allowedAttributes = new Set(["href"]);

	onTag(tag: string, attrs: { [key: string]: string }): string {
		const href = attrs.href;
		if (!href) {
			// No href attribute, skip the tag
			return "";
		}

		try {
			const { protocol, hostname } = new URL(href);
			if (protocol !== "http:" && protocol !== "https:") {
				// Invalid protocol, skip the tag
				return "";
			}

			if (this.naughtyHosts.has(hostname)) {
				// Naughty host, strip the href attribute
				delete attrs.href;
			}

			return tag;
		} catch (err) {
			// Invalid URL, skip the tag
			return tag;
		}
	}
}
