import type { PurifierMiddlware } from "./middleware";

export class ImageAttributeMiddleware implements PurifierMiddlware {
	allowedTags = new Set(["img"]);
	allowedAttributes = new Set(["src", "alt"]);

	onTag(tag: string, attrs: { [key: string]: string }): string {
		if (attrs.src && attrs.src.match(/^https?:\/\/.*\.(jpg|jpeg|gif|png)$/i)) {
			return tag;
		} else {
			return "";
		}
	}
}
