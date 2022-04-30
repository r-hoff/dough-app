import { writable } from "svelte/store";

export let servingsW = writable(1);

export let ingredientsW = writable({
    Flour: { base: 250, measurement: 250, percentage: 1 },
    Water: { base: 175, measurement: 175, percentage: .7 },
    Yeast: { base: 0.5, measurement: 0.5, percentage: .002 },
    Salt: { base: 6, measurement: 6, percentage: .024 },
});

export let recipeW = writable({
    pt1: "1. Heat Water to ~100°F (38°C). Dissolve Salt in Water, then stir in Yeast. Let sit for a minute or two.",
    pt2: "2. Measure Flour into bowl of stand mixer. Add in the Water/Yeast/Salt mixture and stir with a spatula until just combined. "
        + "Then, mix on low for 3-5 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.",
    pt3: "3. After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. "
        + "Cover with a lid or plastic wrap and let proof for 2 hours at room temperature.",
    pt4: "4. Turn out dough onto surface. Cut and shape into equal sized balls and place into a large tupperware or "
        + "on individual dinner plates. Cover and place in refrigerator for 12-24 hours.",
    pt5: "5. Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!"
});

export let tooltipModeW = writable(false);

export let advancedModeW = writable(false);

export let showWelcomeMessageW = writable(true);