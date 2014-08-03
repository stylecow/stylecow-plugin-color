stylecow plugin color
=====================

Stylecow plugin to add support for CSS Color Module Level 4

You write:

```css
p {
	background: color(red alpha(0.5));
	color: color(blue tint(50%));
	border-color: background: gray(50%);
}
```

And stylecow converts to:

```css
p {
	background: rgba(255, 0, 0, 0.5);
	color: #7F7FFF;
	border-color: #7F7F7F;
}
```
