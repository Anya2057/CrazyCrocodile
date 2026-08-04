# Game-ready visual architecture

## Canvas and coordinate system

The master canvas is `1440 × 960`. All geometry lives in this coordinate system and the browser scales the finished SVG uniformly. This prevents browser-dependent layer drift and keeps every edge sharp on normal and Retina displays.

## Asset/layer set

1. Static lower body and jaw shell.
2. Mouth cavity and tongue.
3. Twelve fixed socket shadows.
4. Twelve independent lower-tooth sprites.
5. Front gum occluder, always rendered above the lower teeth.
6. Rigged upper jaw containing the head, eyes, upper gum and upper teeth.
7. Snap burst and UI overlays.

The reference PNGs are never sampled, cut up, inpainted, or used as game assets.

## Open, half and closed states

There are no unrelated raster frames to align. All states come from one SVG rig. The upper jaw uses a single transform origin at the rear mouth hinge. `open → half → closed` is interpolation of the same group, so silhouette, lighting, eye position and tooth spacing remain internally consistent. The lower jaw never moves.

## Interactive teeth

The 12 lower teeth occupy explicit points on a symmetric elliptical arc. Each tooth has its own small rotation matching the gum tangent. On press, only that tooth translates down and compresses slightly over 190 ms. The front gum is a separate occlusion layer, so the tooth disappears into the socket rather than floating over the gum. Pressed teeth remain down for the round.

The dangerous tooth runs the identical press animation. After 100 ms the upper-jaw rig snaps shut, then the whole stage shakes and Game Over appears.

## Production raster alternative

If a fully rendered studio-3D look beyond the vector version is required, new purpose-built assets are necessary: a single layered 3D render exported from one locked camera and lighting setup, not independently generated open/half/closed pictures. Ideal delivery is layered PSD/EXR or transparent PNG sequences rendered from the same scene, with the 12 lower teeth and front gum exported separately.
