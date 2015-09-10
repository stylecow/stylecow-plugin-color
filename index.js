"use strict";

//http://dev.w3.org/csswg/css-color/

var Color = require('color');
var ColorFunction = require('css-color-function');

module.exports = function (tasks) {

    //Convert hex + alpha values to rgba values
    tasks.addTask({
        filter: 'Hex',
        fn: function (hex) {
            var color = hexaColor(hex);

            if (!color) {
                return;
            }

            //if its opaque
            if (color.alpha() == 1) {
                return hex.setName(color.hexString().substr(1));
            }

            //replace by rgba
            hex.replaceWithCode(color.rgbString(), 'Function');
        }
    });

    //Convert gray() function to rgba/hex values
    tasks.addTask({
        filter: {
            type: 'Function',
            name: 'gray'
        },
        fn: function (fn) {
            var color = grayColor(fn.toArray());

            //if its opaque
            if (color.alpha() == 1) {
                return fn.replaceWithCode(color.hexString(), 'Hex');
            }

            //replace by rgba
            fn.replaceWithCode(color.rgbString(), 'Function');
        }
    });

    //Convert color() function to rgba/hex values
    tasks.addTask({
        filter: {
            type: 'Function',
            name: 'color'
        },
        fn: function (fn) {
            fn.replaceWithCode(ColorFunction.convert(fn.toString()), 'Function');
        }
    });
};


function hexaColor (hex) {
    if (hex.name.length === 4) {
        return (Color('#' + hex.name.substr(0, 3))).alpha(parseFloat((parseInt(hex.name.substr(3) + hex.name.substr(3), 16) / 255).toFixed(2)));
    }

    if (hex.name.length === 8) {
        return (Color('#' + hex.name.substr(0, 6))).alpha(parseFloat((parseInt(hex.name.substr(6), 16) / 255).toFixed(2)));
    }
}

function grayColor (val) {
    if (val[1] === undefined) {
        val[1] = 1;
    }

    return Color('rgba(' + val[0] + ',' + val[0] + ',' + val[0] + ',' + val[1] + ')');
}

function modify (val, amount, modifier) {
    switch (modifier) {
        case '+': return val + amount;
        case '-': return val - amount;
        case '*': return val * amount;
        default: return amount;
    }
}
