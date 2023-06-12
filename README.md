# Some custom addons for slidev

## Demo

A demo illustrating these addons is available in a separate repository \
⇒ https://github.com/twitwi/slidev-addon-ultracharger-demo

To watch it \
⇒ https://twitwi.github.io/slidev-addon-ultracharger-demo


## Use these features

You can use them in your presentation with two steps
(see https://sli.dev/addons/use.html for a general documentation on using addons)

- Step 1: directly depending to the github repository, e.g., `npm install github:twitwi/slidev-addon-ultracharger`

- Step 2: adding the addon in your `package.json`
```json
  "slidev": {
    "addons": [
      "slidev-addon-ultracharger"
    ]
  },
```

- Step 2: (alternative) adding the addon in your frontmatter 

``` yaml
addons:
  - slidev-addon-ultracharger
```

### Some notable versions

```
github:twitwi/slidev-addon-ultracharger#v0.0.1-incubation (the version that used to be named twitwi/slidev-addon-incubation)
github:twitwi/slidev-addon-ultracharger#vslidev0.38.8     (the version before the fix for slidev 0.39.0 layout issue)
github:twitwi/slidev-addon-ultracharger#vslidev0.40.13    (the version before the 0.40.14 fix (vite update))
```

