import { PurifyHTML } from "../src/purifier";
import { ScriptAndStyleTagRemoverMiddleware } from "../src/middleware/remove-js-css";
import { XSSMiddleware } from "../src/middleware/xss";

describe.skip("XSS", () => {
	describe("onText", () => {
		test("replaces special characters with HTML entities", () => {
			const middleware = new XSSMiddleware();
			const text = '<script>alert("XSS");</script>';
			const sanitizedText = middleware.onText(text);
			expect(sanitizedText).toEqual("&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;");
		});
	});
});

describe("Script and Style Tag Removal", () => {
	test("removes script tags from HTML", () => {
		const purify = new PurifyHTML([new ScriptAndStyleTagRemoverMiddleware()]);
		const inputHtml = '<script>alert("XSS!");</script>';
		const outputHtml = purify.cleanSync(inputHtml);
		expect(outputHtml).toEqual("");
	});

	test("removes style tags from HTML", () => {
		const purify = new PurifyHTML([new ScriptAndStyleTagRemoverMiddleware()]);
		const inputHtml = "<style>body { font-size: 16px; }</style>";
		const outputHtml = purify.cleanSync(inputHtml);
		expect(outputHtml).toEqual("");
	});

	test("allows allowed tags to pass through", () => {
		const purify = new PurifyHTML([new ScriptAndStyleTagRemoverMiddleware()]);
		const inputHtml = '<p>Hello, world!</p><a href="#">Link</a>';
		const outputHtml = purify.cleanSync(inputHtml);
		expect(outputHtml).toEqual('<p>Hello, world!</p><a href="#">Link</a>');
	});

	test("removes disallowed tags from HTML", () => {
		const purify = new PurifyHTML([new ScriptAndStyleTagRemoverMiddleware()]);
		const inputHtml =
			'<img src="image.png"><div><iframe src="https://example.com"></iframe></div>';
		const outputHtml = purify.cleanSync(inputHtml);
		expect(outputHtml).toEqual("");
	});
});
