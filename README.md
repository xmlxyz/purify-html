## @xmlxyz/purify-html

### Description

`@xmlxyz/purify-html` is an open-source package that provides a powerful HTML sanitization and purifying utility. It allows you to detect and handle malicious HTML content and produce sanitized output using a customizable set of middleware functions. This package is designed to protect your application from potential security vulnerabilities by ensuring that only trusted and allowed tags, attributes, and text are retained in the HTML.

### Installation

You can install `@xmlxyz/purify-html` using npm or yarn:

```bash
npm install @xmlxyz/purify-html
# or
yarn add @xmlxyz/purify-html
```

### Usage

```javascript
import { createPurifier } from "@xmlxyz/purify-html";

// Create a new instance of PurifyHTML with custom middleware
const purify = createPurifier("https://example.com/workbench/", [
	/* Add your PurifierMiddleware instances here */
]);

// Sanitize and purify HTML
const inputHTML = '<p onclick="foo()">hello world</p>';
const sanitizedHTML = purify.cleanSync(inputHTML);
console.log(sanitizedHTML);
// Output: "<p>hello world</p>"
```

### `PurifierMiddleware` Interface

The `PurifierMiddleware` interface provides a structure to define custom middleware functions for `@xmlxyz/purify-html`. Middleware functions enable customization and filtering of allowed tags, attributes, and text within the HTML. The interface consists of the following properties:

- `allowedTags`: A `Set` containing strings representing the HTML tags allowed in the sanitized output.
- `allowedAttributes`: A `Set` containing strings representing the attributes allowed in the sanitized output.
- `onTag?`: An optional function to handle individual HTML tags. It takes two parameters - `tag` (string) representing the tag name and `attrs` (object) representing the tag attributes as key-value pairs. The `onTag` function can modify the tag or attributes or return `void` to allow the tag as-is.
- `onAttribute?`: An optional function to handle individual HTML attributes. It takes two parameters - `attr` (string) representing the attribute name and `value` (string) representing the attribute value. The `onAttribute` function can modify the attribute value or return `void` to allow the attribute as-is.
- `onText?`: An optional function to handle text content within the HTML. It takes a single parameter - `text` (string) representing the text content. The `onText` function can modify the text content or return the modified text.

### `PurifyHTML` Class

The `PurifyHTML` class is the core of this package and provides the HTML sanitization functionality. It utilizes the set of middleware functions to detect and handle malicious HTML content. The class follows a step-by-step process to sanitize the HTML:

1. **Read HTML**: Provide the HTML content to the `cleanSync` method of `PurifyHTML`.
2. **Detect Malicious HTML**: The class uses the specified middleware functions to detect and handle potentially malicious tags and attributes.
3. **Sanitize Malicious HTML**: Detected malicious HTML is sanitized and purified based on the middleware rules.
4. **Return Sanitized HTML**: The sanitized and cleaned HTML content is returned as the output.

### Contributing

Contributions to `@xmlxyz/purify-html` are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

### License

This package is open-source and released under the Unlicense License. See the [LICENSE](LICENSE.md) file for more details.
