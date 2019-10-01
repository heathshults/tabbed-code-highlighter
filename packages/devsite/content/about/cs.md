---
title: Framekit Cheate Sheet
slug: cheat-sheet
layout: margin
description: A list of functions and codes to use in your development project.
menu:
    sidenav:
        parent: about
toc: true
---
<style>
  .hightlight {
      margin: 2rem 0;
  }
  
</style>
## Global Variables

## __$fk-separator-breakpoint:__ 
{{< spacer "10px" >}}{{< /spacer >}}

```{r}
@ The seperator for responsive classes

Example: u-display-none@sm  (hide on small breakpoint)
```
----
## Typography Mixin
###  __fk-type($name)__  
{{< spacer "10px" >}}{{< /spacer >}}

{{< highlight sql >}}

Sets font-weight, font-size, line-height, letter spacing
font-size: fk-type('display1')

### Available Options:
  display1, display2, 
  headline1, headline2, headline3, headline4, headline5, 
  category1, category2, category3, 
  body1, body2, body3, 
  micro

{{< /highlight  >}}

---
## Various Functions for type. 
__Try not to use unless absolutly necessary__
{{< highlight sql >}}

text-size('xxxl')
font-weight('semibold')
line-height()
$fk-type-default-letter-spacing

{{< /highlight >}}

---
## Theme
__Background Colors__
Get background color

{{< highlight sql >}}
### Function  
fk-theme-get-bg($name, $mode: $fk-theme-default-mode)

### Mixin
fk-theme-bg($bgName)                    (Click the button for more below.)

### Sets:
    - Background-color
    - Text color for light and dark mode 

### Available Options:
    - canvas
    - layer1
    - layer2
    - layer3
    - brand1
    - brand2
    - overlay
    - gray1
    - gray2


{{< /highlight >}}

---

## Mixin and Function
__fk-shade()__

{{< highlight sql >}}

Provides a RGBA nuetral. 05 being the most transparent, 90 being least

Available Options are:
    fk-shade(05)      fk-shade(10)      fk-shade(15)      fk-shade(25)      
    fk-shade(50)      fk-shade(75)      fk-shade(90)

{{< /highlight >}}

---

# Text

## Function  
__fk-theme-get-text(name, $mode: $fk-theme-default-mode)__


---

## Mixin
__fk-theme-text($name)__

{{< spacer "10px" >}}{{< /spacer >}}

{{< highlight sql >}}
Sets color for default, light and dark mode
Available Options:
- primary               - secondary           - success         - warning 
- brand1                - brand2              - brand3          - error
- subtle                - link             
- hint (Do no use at this time)               
                 
{{< /highlight >}}

---

## Border
{{< highlight sql >}}


__fk-theme-get-border($name, $mode: $fk-theme-default-mode)__
{{< /highlight >}}

## Feedback Interactive (click identifiers) 
{{< highlight sql >}}

__fk-theme-get-interactive($name, $mode: $fk-theme-default-mode)__
{{< /highlight >}}

## Feedback Messaging Colors
{{< highlight sql >}}


__fk-theme-get-messaging($name, $type:'strong', $mode: $fk-theme-default-mode)__
{{< /highlight >}}

## Shadow
{{< highlight sql >}}


__fk-theme-get-shadow($name, $type:'outset', $mode: $fk-theme-default-mode)__
{{< /highlight >}}

## Generic Functions
{{< highlight sql >}}


__fk-theme-get-prop($mode, $type, $name, $keys... )__
{{< /highlight >}}


{{< highlight sql >}}


Get a theme prop from tokens.  Typically not directly used. Use shortcut functions <br />
Example:  fk-theme-get-prop("lm", 'text', 'primary') <br />
Example:  fk-theme-get-prop("lm", 'messaging', 'error', 'strong')
{{< /highlight >}}

__fk-theme-determine-mode($bgcolor)__
{{< highlight sql >}}


Given a background color (any hex) it returns 'lm' or 'dm' depending if its a light or dark color. 
{{< /highlight  >}}

## Generic Theme Mixins
__fk-theme-switcher($prop, $onLight, $onDark)__

{{< highlight sql >}}
$prop: Css property like 'color', 'backgroud-color'
$onLight: The value for prop in light mode
$onDark: The value for prop in dark mod
Will write a root prop: value depending on the default set theme
{{< /highlight >}}


__fk-theme-in-dark()__ 
__fk-theme-in-light()__
{{< callout-info "" >}}


Wrap css to display for dark mode or light mode
{{< /callout-info >}}

{{< highlight sql >}}


.customclass {
    @include fk-theme-in-dark(){
        prop: value to be used in dark mode
    }
}
{{< /highlight >}}

---

## __map()__
{{< highlight sql >}}
Given a dot seperate token address of a map location, returns a map back.  
Map() will error out if address gives back a value.   
Use Val if needing a value

map('type.font-weight.sans')
{{< /highlight >}}

---

## __val()__
{{< callout-info "" >}}
Given a dot seperated address, returns a value. Errors if return is map. 
{{< /callout-info >}}
{{< spacer "10px" >}}{{< /spacer >}}
## __get()__
{{< callout-info "" >}}
Given a dot seperated address, returns whatever it is.. map or value
{{< /callout-info >}}
