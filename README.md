# Morse Code Alphabet

Production static build for `morsecodealphabet.net`.

```bash
npm run build
npm run serve
```

The deployable output is `dist/`.

## AdSense verification

After AdSense gives you the real 16-digit publisher ID, build with:

```bash
ADSENSE_PUBLISHER_ID=pub-0000000000000000 npm run build
```

The build validates the format, adds the `google-adsense-account` verification meta tag, and creates the matching root `ads.txt`. Replace the example with the publisher ID copied from AdSense; never deploy the placeholder value.
