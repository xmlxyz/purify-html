import { ImageAttributeMiddleware } from "./images";
import { PurifierMiddlware } from "./middleware";
import { NaughtyHrefMiddleware } from "./naughty-href";
import { ScriptAndStyleTagRemoverMiddleware } from "./remove-js-css";
import { XSSMiddleware } from "./xss";
import { YoutubeFrameMiddleware } from "./youtube";

export const DEFAULT_MIDDLEWARE: PurifierMiddlware[] = [
	new ImageAttributeMiddleware(),
	new NaughtyHrefMiddleware(),
	new XSSMiddleware(),
	new ScriptAndStyleTagRemoverMiddleware(),
	new YoutubeFrameMiddleware(),
];
