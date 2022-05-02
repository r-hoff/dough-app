import { writable } from "svelte/store";

export let servingsW = writable(1);

export let ingredientsW = writable({
    Flour: { base: 250, measurement: 250, percentage: 1, default: true },
    Water: { base: 175, measurement: 175, percentage: .7, default: true },
    Yeast: { base: 0.5, measurement: 0.5, percentage: .002, default: true },
    Salt: { base: 6, measurement: 6, percentage: .024, default: true },
});

export let recipeW = writable([
    "Heat water to ~100°F (38°C). Dissolve salt in water, then stir in yeast. Let sit for a minute or two.",
    "Measure flour into bowl of stand mixer. Add in the water/yeast/salt mixture and stir with a spatula until just combined. "
    + "Then, mix on low for 2-3 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.",
    "After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. "
    + "Cover with a lid or plastic wrap and let proof for 1-2 hours at room temperature.",
    "Turn out dough onto surface. Cut and shape into equal sized balls and place into a large tupperware or "
    + "on individual dinner plates. Cover and place in refrigerator for 12-24 hours.",
    "Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!"
]);

export let tooltipModeW = writable(false);

export let advancedModeW = writable(false);

export let showWelcomeMessageW = writable(true);

export let recipeTitleW = writable("Pizza Dough Recipe");

export let pizzaSizeW = writable(16);

export let lastSelectionW = writable(16);