import type { PurifierMiddlware } from "./middleware/middleware";

import { RelativeHrefMiddleware } from "./middleware/relative-href";
import { PurifyHTML } from "./purifier";
import { DEFAULT_MIDDLEWARE } from "./middleware/default";

export function createPurifier(
	baseURI: string = "",
	middleware: PurifierMiddlware[] = DEFAULT_MIDDLEWARE
): PurifyHTML {
	return new PurifyHTML([...middleware, new RelativeHrefMiddleware(baseURI)]);
}

export { PurifierMiddlware, PurifyHTML };
