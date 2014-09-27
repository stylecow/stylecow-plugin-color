stylecow plugin color
=====================

Stylecow plugin to add support for [CSS Color Module Level 4](http://dev.w3.org/csswg/css-color/)

* Hex + alpha colors. Example: #26f3 or #2266ff33
* Support for gray(). Example: gray(50%)
* Support for color() to calculate color conversions. Example: color(red tint(50%)).

The available color modifiers supported inside color() are:

* alpha() / a(). Modify the alpha channel: color(green a(0.5))
* red(). Modify the red channel: color(blue red(+55))
* green(). Modify the green channel: color(blue green(+55))
* blue(). Modify the blue channel: color(blue green(+55))
* rgb(). Modify the red,green,blue channels: color(blue rgb(+55, -23, +12))
* saturation() / s(). Modify the saturation: color(blue s(50%))
* lightness() / l(). Modify the lightness: color(blue l(50%))
* whiteness() / w(). Modify the amount of white: color(blue w(50%))
* blackness() / b(). Modify the amount of black: color(blue b(50%))
* blend(). Blends a color with other: color(blue blend(yellow, 50%))
* blenda(). Blends a color with other including the alpha channel: color(blue blenda(rgba(23, 12, 123, 0.3, 50%))
* tint(). Calculate the percentage of a color to white: color(red tint(50%))
* shade(). Calculate the percentage of a color to black: color(red shade(50%))
* contrast(). Calculate the color with a enought contrast to be readable in front of: color(red contrast(50%))


You write:

```css
p {
	background: color(red alpha(0.5));
	color: color(blue tint(50%));
	border-color: gray(50%);
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
