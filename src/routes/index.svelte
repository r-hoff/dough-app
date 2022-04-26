<script>
	import { goto } from '$app/navigation';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte'
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
	import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte'
	import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte'
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
	import FaEdit from 'svelte-icons/fa/FaEdit.svelte'
	import FaSave from 'svelte-icons/fa/FaSave.svelte'
	import FaTimes from 'svelte-icons/fa/FaTimes.svelte'

	let servings = 1;

	let ingredients = {
		Flour: {base: 250, measurement: 250, percentage: 1},
		Water: {base: 175, measurement: 175, percentage: .7},
		Yeast: {base: 0.5, measurement: 0.5, percentage: .002},
		Salt: {base: 6, measurement: 6, percentage: .024},
	}

	let total;
	function calcTotal() {
		const ingredientList = Object.keys(ingredients);
		total = 0;
		for (const ingredient of ingredientList) {
			total += ingredients[ingredient].measurement;
		}
	}
	calcTotal();

	let recipe = {pt1: "1. Heat Water to ~100°F (38°C). Dissolve Salt in Water, then stir in Yeast. Let sit for a minute or two.",
		pt2: "2. Measure Flour into bowl of stand mixer. Add in the Water/Yeast/Salt mixture and stir with a spatula until just combined. "
		+ "Then, mix on low for 3-5 minutes, or until the dough is uniform and smooth. Let rest for 20-30 minutes.",
		pt3: "3. After resting, mix dough on low again for 30 seconds. Then, lightly oil another large bowl and transfer the dough ball. "
		+ "Cover with a lid or plastic wrap and let proof for 2 hours at room temperature.",
		pt4_1: "4. Turn out dough onto surface. Cut and shape into equal sized balls ",
		pt4_2: "and place into a large tupperware or on individual dinner plates. Cover and place in refrigerator for 12-24 hours.",
		pt5: "5. Remove dough from refrigerator 30-60 minutes before making pizza. Then stretch, top, and bake!"}

	function incServings() {
		servings += 1;
		recalcIngredients();
	}

	function decServings() {
		if (servings > 1) {
			servings -= 1;
			recalcIngredients();
		}
	}

	function recalcIngredients() {
		const ingredientList = Object.keys(ingredients);

		for (const ingredient of ingredientList) {
			if (ingredient !== "Flour") {
				ingredients[ingredient].measurement = +((servings * ingredients.Flour.base * ingredients[ingredient].percentage).toFixed(2));
			}
			else {
				ingredients.Flour.measurement = ingredients.Flour.base * servings;
			}
		}
		calcTotal();
	}

	function decIngredientPercentage(ingredient) {
		let increment;
		// change increment if over 5%
		if (ingredients[ingredient].percentage > .05) {
			increment = 0.01;
		} else if (ingredients[ingredient].percentage <= .05) {
			increment = 0.001;
		}
		// only change the percentage if it stays at or above 0%
		if (+((ingredients[ingredient].percentage - increment).toFixed(3)) >= 0) {
			ingredients[ingredient].percentage -= increment;
			recalcIngredients();
		}
	}

	function incIngredientPercentage(ingredient) {
		let increment;
		// change increment if over 5%
		if (ingredients[ingredient].percentage > .05) {
			increment = 0.01;
		} else if (ingredients[ingredient].percentage <= .05) {
			increment = 0.001;
		}
		// only change the percentage if it stays at or below 100%
		if (+((ingredients[ingredient].percentage + increment).toFixed(3)) <= 1) {
			ingredients[ingredient].percentage += increment;
			recalcIngredients();
		}
	}

	let metric = true;
	let metricDisplay = "metric";
	let metricSlider = "sliderOn";
	let advanced = false;
	let advancedDisplay = "advanced";
	let advancedSlider = "sliderOn";

	let recipeEdit = false;

	function setMetric() {
		metric = !metric;
		metricSlider === "sliderOn"? metricSlider = "sliderOff": metricSlider = "sliderOn";
		metricDisplay === "metricActive"? metricDisplay = "metric": metricDisplay = "metricActive";
	}

	function setAdvanced() {
		advanced = !advanced;
		advancedSlider === "sliderOn"? advancedSlider = "sliderOff": advancedSlider = "sliderOn";
		advancedDisplay === "advancedActive"? advancedDisplay = "advanced": advancedDisplay = "advancedActive";
	}

	function setRecipeEdit() {
		recipeEdit = !recipeEdit;
	}

	function resetDefaultValues() {
		ingredients = {
			Flour: {base: 250, measurement: 250, percentage: 1},
			Water: {base: 175, measurement: 175, percentage: .7},
			Yeast: {base: 0.5, measurement: 0.5, percentage: .002},
			Salt: {base: 6, measurement: 6, percentage: .024},
		}
		recalcIngredients();
	}

	function routeToPrint() {
		goto('/print', { replace: false }) 
	}

	let addMode = false;
	function setAddMode() {
		newIngredientName = null;
		newIngredientMeasurement = null;
		addMode = !addMode;
	}

	let newIngredientName = null;
	let newIngredientMeasurement = null;

	function saveIngredient(name, measurement) {
		if (!name || !measurement) {
			addMode = !addMode;
			return;
		}
		ingredients[name] = {base: measurement / servings, measurement: measurement, percentage: measurement / ingredients.Flour.measurement};
		addMode = !addMode;
		newIngredientName = null;
		newIngredientMeasurement = null;
		calcTotal();
	}

	let tooltipMode = false;
	let showWelcomeMessage = true;
	function dismissWelcome() {
		showWelcomeMessage = false;
	}
	
</script>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<div class="container">
	<h1 class="widthAll centerText marginAuto title">Pizza Dough Planner</h1>
	{#if showWelcomeMessage}
		<div class="row spaceEvenly">
			<div class="marginBottom">
				<b>Welcome to Pizza Dough Planner v1.0!</b><br>
				This is the official first release of the application. Bugs are expected—don't let them keep you from exploring!<br>
				Pizza dough calculations are made based on number of servings, which can be adusted with the up/down arrows below.<br>
				Options are available, but some are either not implemented or incomplete, so please approach with an open mind.<br>
				Please send comments, questions, or concerns: <a href="mailto:hoffr@oregonstate.edu">hoffr@oregonstate.edu</a>. Thanks for using Pizza Dough Planner!
			</div>
			<div class="tooltipArrowAbove">
				<button class="transparentButton icon" on:click={dismissWelcome}><FaTimes /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowAbove">
						Dismiss this message.
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<hr>
	<div class="row center">
		<label for="servings">How many pizzas would you like to prepare dough for?</label>
		<input id="servings" type="number" class="servings" readonly bind:value={servings} />
		<div class="column">
			<div class="tooltipArrowAbove">
				<button class="transparentButton icon" on:click={incServings}><FaChevronUp /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowAbove">
						Increase the number of pizzas created by this recipe by one.
					</div>
				{/if}
			</div>
			<div class="tooltipArrowBelow">
				<button class="transparentButton icon" on:click={decServings}><FaChevronDown /></button>
				{#if !tooltipMode}
					<div class="tooltiptextArrowBelow">
						Decrease the number of pizzas created by this recipe by one.
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="column widthAll">
			<h3 class="centerText setMargin">Ingredient Summary</h3>
			<div class="row spaceBetween">
				<div class="column">
					<u>Ingredient</u>
					{#each Object.entries(ingredients) as [name]}
						<div>{name}</div>
					{/each}
				</div>
				<div class="column">
					<u>Measurement</u>
					{#each Object.entries(ingredients) as [name, details]}
						{#if details.measurement % 1 !== 0}
							<div>{details.measurement.toFixed(2)} g</div>
						{/if}
						{#if details.measurement % 1 === 0}
							<div>{details.measurement.toFixed(0)} g</div>
						{/if}
					{/each}
				</div>
				<div class="column centerText">
					<u>Percentage</u>
					<div class="row">
						{#if advanced}
							<div class="column">
								{#each Object.entries(ingredients) as [name, details]}
									{#if name === "Flour"}
										<div class="row"><br></div>
									{/if}
									{#if name !== "Flour"}
										<div class="row">
											<div class="tooltipArrowAbove">
												<button class="transparentButton iconSmall" on:click={() => decIngredientPercentage(name)}><FaChevronLeft /></button>
												{#if !tooltipMode}
													<div class="tooltiptextArrowAbove">
														Increase {name} by {details.percentage > .05 ? "1%" : "0.1%"}.
													</div>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
						</div>
						{/if}
						<div class="column widthAll">
							{#each Object.entries(ingredients) as [name, details]}
								{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) !== 0}
									<div>{(details.percentage * 100).toFixed(1)} %</div>
								{/if}
								{#if (details.percentage / .01) - (Math.round(details.percentage * 100)) === 0}
									<div>{(details.percentage * 100).toFixed(0)} %</div>
								{/if}
							{/each}
						</div>
						{#if advanced}
						<div class="column">
							{#each Object.entries(ingredients) as [name, details]}
								{#if name === "Flour"}
									<div class="row"><br></div>
								{/if}
								{#if name !== "Flour"}
									<div class="row">
										<div class="row">
											<div class="tooltipArrowAbove">
												<button class="transparentButton iconSmall" on:click={() => incIngredientPercentage(name)}><FaChevronRight /></button>
												{#if !tooltipMode}
													<div class="tooltiptextArrowAbove">
														Decrease {name} by {details.percentage > .05 ? "1%" : "0.1%"}.
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
						{/if}
					</div>
				</div>
			</div>
			{#if advanced}
				{#if addMode}
					<div class="spaceBetween">
						<br>
						<div class="row spaceBetween">
							<div class="tooltip">
								<b>Add New Ingredient</b>
								{#if !tooltipMode}
									<div class="tooltiptext">
										<u>Add New Ingredient</u><br>
										<b>Caution: This feature is still in development!</b><br>
										If any bugs are encountered, reload the page. Any changes will be lost.<br><br>
										To add a new ingredient, fill out the name and measurement inputs below.
									</div>
								{/if}
							</div>
							<div class="tooltipArrowAbove">
								<button class="transparentButton icon" on:click={() => saveIngredient(newIngredientName, newIngredientMeasurement)}><FaSave /></button>
								{#if !tooltipMode}
									<div class="tooltiptextArrowAbove">
										<u>Save Ingredient</u><br>
										<b>Caution: This feature is still in development!</b><br>
										If any bugs are encountered, reload the page. Any changes will be lost.<br><br>
										Click to save the new ingredient. If either the name or measurement are missing, the ingredient will not be added.
									</div>
								{/if}
							</div>
						</div>
						<div class="row">
							<div class="column widthAll">
								<label for="ingredientName">Ingredient name:</label>
								<label for="ingredientMeasurement">Measurement:</label>
							</div>
							<div class="column widthAll">
								<input id="ingredientName" type="text" placeholder="Ex: Honey" bind:value={newIngredientName}>
								<input id="ingredientName" type="number" placeholder="in grams" bind:value={newIngredientMeasurement}>
							</div>
						</div>
					</div>
				{/if}
				{#if !addMode}
					<div class="tooltipSmall">
						<div class="row"><button class="transparentButton iconSmall" on:click={setAddMode}><FaPlus /></button>Add Ingredient</div>
						{#if !tooltipMode}
							<div class="tooltiptextSmall">
								<u>Add Ingredient</u><br>
								<b>Caution: This feature is still in development!</b><br>
								If any bugs are encountered, reload the page. Any changes will be lost.<br><br>
								Click the "+" to add a new ingredient.
							</div>
						{/if}
					</div>
				{/if}
				<br>
				<div class="centerText lightText">Unsure on how modifying ingredients will affect your dough? <a target="_blank" href="http://www.thehomepizzeria.com/pizza-dough/ingredients/#">Read more here</a></div>
			{/if}
		</div>
		<div class="column pad"></div>
		<div class="column widthAll">
			<h3 class="centerText setMargin">Options</h3>
			<div class="column options">
				<br>
				<div class="row center">
					<div class="tooltip">
						<label for="tooltipMode">Disable tooltips:</label>
						<input id="tooltipMode" type="checkbox" bind:checked="{tooltipMode}">
						{#if !tooltipMode}
							<div class="tooltiptext">
								<u>Disable tooltips</u><br>
								Already know your way around the application? Disable tooltips by checking this option.
							</div>
						{/if}
					</div>
				</div>
				<div class="row spaceEvenly options">
					<div class="marginAuto">
						<br>
						<div class="tooltip">
							<div>Use Cups/Tsp:</div>
							{#if !tooltipMode}
								<div class="tooltiptext">
									<u>Use Cups/Tsp</u><br>
									<b>Caution: This feature has not been implemented!</b><br>
									In future releases, you will be able to convert
									ingredient measurements from grams to cups/tsp.
								</div>
							{/if}
						</div>
						<div class="{metricSlider} marginAuto">
							<button class="{metricDisplay}" on:click={setMetric}>{metric? "OFF": "ON"}</button>
						</div>
						<br>
					</div>
					<div class="marginAuto">
						<br>
						<div class="tooltip">
							<div>Pizzaiolo Mode:</div>
							{#if !tooltipMode}
								<div class="tooltiptext">
									<u>Pizzaiolo Mode</u><br>
									<b>Caution: This feature is still in development!</b><br>
									If any bugs are encountered, use the "Reset to Default" button below or reload the page. Any changes will be lost.<br><br>
									This is an advanced mode intended for dough enthusiasts looking to change up and/or refine their recipe to achieve
									that perfect pie. If this sounds like too much, don't worry; our base recipe will still impress your friends and family!
								</div>
							{/if}
						</div>
						<div class="{advancedSlider} marginAuto">
							<button class="{advancedDisplay}" on:click={setAdvanced}>{advanced? "ON": "OFF"}</button>
						</div>
						<br>
					</div>
				</div>
			</div>
			<br>
			<div class="centerText lightText">Activate Pizzaiolo Mode to fine tune your recipe!</div>
		</div>
	</div>
	<br>
	<hr>
	<div class="column">
		<div class="row spaceBetween">
			<h4>Step-by-step Pizza Dough Instructions:</h4>
			{#if advanced}
				{#if !recipeEdit}
					<div class="tooltipArrowAbove">
						<button class="transparentButton icon" on:click={setRecipeEdit}><FaEdit /></button>
						{#if !tooltipMode}
							<div class="tooltiptextArrowAbove">
								<u>Edit Recipe</u><br>
								<b>Caution: This feature is still in development!</b><br>
								If any bugs are encountered, reload the page. Any changes will be lost.<br><br>
								If you'd like to make any changes to the recipe, click this edit button. After your changes are made, click save.
							</div>
						{/if}
					</div>
				{/if}
				{#if recipeEdit}
					<div class="tooltipArrowAbove">
						<button class="transparentButton icon" on:click={setRecipeEdit}><FaSave /></button>
						{#if !tooltipMode}
							<div class="tooltiptextArrowAbove">
								<u>Save Recipe Edit</u><br>
								<b>Caution: This feature is still in development!</b><br>
								If any bugs are encountered, reload the page. Any changes will be lost.<br><br>
								Click save to finalize your edits.
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
		<p contenteditable="{recipeEdit}">
			{recipe.pt1}<br><br>
			{recipe.pt2}<br><br>
			{recipe.pt3}<br><br>
			{recipe.pt4_1}(roughly {(Math.round((total) / servings))} g each) {recipe.pt4_2}<br><br>
			{recipe.pt5}
		</p>
	</div>
	<br>
	<div class="row">
		<div class="widthAll centerText">
			<div class="tooltip">
				<button class="printReset" on:click={resetDefaultValues}>Reset to Default</button>
				{#if !tooltipMode}
					<div class="tooltiptext">
						<u>Reset to Default</u><br>
						This will reset all ingredients, measurements, and percentages to their default values.
					</div>
				{/if}
			</div>
		</div>
		<div class="widthAll centerText">
			<div class="tooltip">
				<button class="printReset">Print Recipe</button>
				{#if !tooltipMode}
					<div class="tooltiptext">
						<u>Print Recipe</u><br>
						<b>Caution: This feature has not been implemented!</b><br>
						In future releases, you will be able print a neatly formatted
						document with all ingredient measurements and instructions.
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Quicksand', sans-serif;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		height: 100%;
		margin: auto;
	}
	.rightText {
		text-align: right;
	}
	.centerText {
		text-align: center;
	}
	.lightText {
		font-size: smaller;
		color: #757575;
	}
	.setMargin {
		margin: .5em;
	}
	.marginBottom {
		margin-bottom: .5em;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.widthAll {
		width: 100%;
	}
	.heightAll {
		height: 100%;
	}
	.pad {
		padding: 3em;
	}
	.title {
		padding: .5em;
	}
	.marginAuto {
		margin: auto;
	}
	.flexEnd {
		justify-content: flex-end;
	}
	hr {
		width: 100%;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.spaceEvenly {
		justify-content: space-evenly;
	}
	.spaceBetween {
		justify-content: space-between;
	}

	.options {
		background-color: #EEEEEE;
		border-radius: 12px;
	}

	.icon {
		width: 28px;
		height: 28px;
	}
	.iconSmall {
		width: 20px;
		height: 20px;
	}
	button {
		cursor: pointer;
	}
	.transparentButton {
		border: none;
		background-color: transparent;
	}
	.sliderOff {
		width: 4em;
		text-align: right;
		background-color: #283593;
		border-radius: 12px;
	}
	.sliderOn {
		width: 4em;
		text-align: left;
		background-color: #BDBDBD;
		border-radius: 12px;
	}
	.metricActive {
		font-weight: bold;
		background-color: white;
		border-color: #283593;
		border-radius: 12px;
	}
	.metric {
		font-weight: bold;
		color: #757575;
		background-color: white;
		border-color: #BDBDBD;
		border-radius: 12px;
	}
	.advancedActive {
		font-weight: bold;
		background-color: white;
		border-color: #283593;
		border-radius: 12px;
	}
	.advanced {
		font-weight: bold;
		color: #757575;
		background-color: white;
		border-color: #BDBDBD;
		border-radius: 12px;
	}
	.servings {
		border: none;
		font-size: x-large;
		width: 2em;
		text-align: center; 
	}
	input {
		border: none;
		border-bottom: 1px solid #BDBDBD;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.printReset {
		width: 10em;
		border: 0;
		background-color: #303F9F;
		color: white;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
        box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
	}
	.printReset:hover {
		background-color: #283593;
	}
	.printReset:active {
		background-color: #1A237E;
	}

	/* tooltip related */
	.tooltip {
		position: relative;
		display: inline-block;
	}
	.tooltip .tooltiptext {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 225%;
		/* Position the tooltip */
		position: absolute;
		z-index: 1;
		bottom: 100%;
		left: 50%;
		margin-left: -50%;
	}
	.tooltip:hover .tooltiptext {
		visibility: visible;
		opacity: 1;
	}

	.tooltipSmall {
		position: relative;
		display: inline-block;
	}
	.tooltipSmall .tooltiptextSmall {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 50%;
		/* Position the tooltip */
		position: absolute;
		z-index: 1;
		bottom: 100%;
		left: 50%;
		margin-left: -50%;
	}
	.tooltipSmall:hover .tooltiptextSmall {
		visibility: visible;
		opacity: 1;
	}

	.tooltipArrowBelow {
		position: relative;
		display: inline-block;
	}
	.tooltipArrowBelow .tooltiptextArrowBelow {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 500%;
		position: absolute;
		z-index: 1;
	}
	.tooltipArrowBelow:hover .tooltiptextArrowBelow {
		visibility: visible;
		opacity: 1;
	}

	.tooltipArrowAbove {
		position: relative;
		display: inline-block;
	}
	.tooltipArrowAbove .tooltiptextArrowAbove {
		opacity: 0;
		transition: opacity .5s;
		visibility: hidden;
		background-color: #3F51B5;
		font-size: small;
		color: #FFFFFF;
		text-align: left;
		border-radius: 6px;
		padding: 10px;
		width: 500%;
		bottom: 100%;
		left: 50%;
		position: absolute;
		z-index: 1;
	}
	.tooltipArrowAbove:hover .tooltiptextArrowAbove {
		visibility: visible;
		opacity: 1;
	}


</style>