import type { ChildNode } from "domhandler";
import { DomHandler, Parser } from "htmlparser2";
import type { PurifierMiddlware } from "./middleware/middleware";
import { DEFAULT_MIDDLEWARE } from "./middleware/default";
import { RelativeHrefMiddleware } from "./middleware/relative-href";

/**
 * @class PurifyHTML
 * @constructor {PurifierMiddlware[]} - An array of middlwares to use.
 *
 * @usage
 * ```
 * let purify = PurifyHTML.create("https://example.com/workbench/");
 * let output = purify.cleanSync("<p onclick="foo()">hello world</p>");
 * ```
 * 1. Read HTML
 * 2. Detect any malicious HTML
 * 3. Sanitize the malicious HTML
 * 4. Return the sanitized HTML
 */
export class PurifyHTML {
	private middleware: PurifierMiddlware[];
	private htmlParser?: Parser;

	static create(baseURI: string = "", middleware: PurifierMiddlware[] = DEFAULT_MIDDLEWARE) {
		return new PurifyHTML([...middleware, new RelativeHrefMiddleware(baseURI)]);
	}
	constructor(middleware: PurifierMiddlware[]) {
		this.middleware = middleware;
	}

	public cleanSync(html: string): string {
		let sanitizedHtml = "";

		// Create a new parser
		this.htmlParser = new Parser(
			new DomHandler((err, dom) => {
				if (err) {
					throw err;
				}

				sanitizedHtml = this.traverse(dom);
			})
		);

		// Parse the HTML
		this.htmlParser.write(html);
		this.htmlParser.end();

		return sanitizedHtml;
	}

	private traverse(nodes: ChildNode[]): string {
		let result = "";

		nodes.forEach((node) => {
			if (node.type === "tag") {
				let tag = node.name;
				let attrs = node.attribs;

				let filteredAttrs: { [key: string]: string } = {};
				let allowedByMiddleware = false;

				for (let i = 0; i < this.middleware.length; i++) {
					const middleware = this.middleware[i];
					if (middleware.allowedTags.has(tag) || middleware.allowedTags.has("*")) {
						allowedByMiddleware = true;

						if (middleware.onTag) {
							const newTag = middleware.onTag(tag, attrs);
							if (newTag) {
								tag = newTag;
							} else {
								// Middleware returned falsy value, skip this tag
								return;
							}
						}

						for (const attr in attrs) {
							if (
								middleware.allowedAttributes.has(attr) ||
								middleware.allowedAttributes.has("*")
							) {
								const value = middleware.onAttribute
									? middleware.onAttribute(attr, attrs[attr])
									: attrs[attr];
								filteredAttrs[attr] = value;
							}
						}
					}
				}

				if (!allowedByMiddleware) {
					return;
				}

				if (Object.keys(filteredAttrs).length === 0) {
					result += `<${tag}>`;
				} else {
					result += `<${tag} ${Object.entries(filteredAttrs)
						.map(([name, value]) => `${name}="${value}"`)
						.join(" ")}>`;
				}

				if (node.children) {
					result += this.traverse(node.children);
				}

				result += `</${tag}>`;
			} else if (node.type === "text") {
				let text = node.data;

				for (let i = 0; i < this.middleware.length; i++) {
					const middleware = this.middleware[i];
					if (middleware.onText) {
						const newText = middleware.onText(text);
						if (newText) {
							text = newText;
						} else {
							// Middleware returned falsy value, skip this text node
							return;
						}
					}
				}

				result += text;
			}
		});

		return result;
	}
}
